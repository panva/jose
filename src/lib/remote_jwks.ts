import type * as types from '../types.d.ts'
import { JOSEError, JWKSNoMatchingKey, JWKSTimeout } from '../util/errors.js'
import type {
  FetchImplementation,
  ExportedJWKSCache,
  JWKSCacheInput,
  RemoteJWKSet,
  RemoteJWKSetOptions,
} from '../jwks/remote.js'
import type { LocalJWKSet } from '../jwks/local.js'
import { isJwkSet } from './type_checks.js'

export const customFetch: unique symbol = Symbol()
export const jwksCache: unique symbol = Symbol()

type LocalJWKSetFactory = (jwks: types.JSONWebKeySet) => LocalJWKSet

function isCloudflareWorkers() {
  return (
    // @ts-expect-error
    typeof WebSocketPair !== 'undefined' ||
    // @ts-ignore
    (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') ||
    // @ts-expect-error
    (typeof EdgeRuntime !== 'undefined' && EdgeRuntime === 'vercel')
  )
}

// An explicit user-agent in browser environment is a trigger for CORS preflight requests which
// are not needed for our request, so we're omitting setting a default user-agent in browser
// environments.
let USER_AGENT: string
// @ts-ignore
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
  const NAME = 'jose'
  const VERSION = 'v6.2.10'
  USER_AGENT = `${NAME}/${VERSION}`
}

async function fetchJwks(
  url: string,
  headers: Headers,
  signal: AbortSignal,
  fetchImpl: FetchImplementation = fetch,
) {
  const response = await fetchImpl(url, {
    method: 'GET',
    signal,
    redirect: 'manual',
    headers,
  }).catch((err) => {
    if (err.name === 'TimeoutError') {
      throw new JWKSTimeout()
    }

    throw err
  })

  if (response.status !== 200) {
    throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response')
  }

  try {
    return await response.json()
  } catch {
    throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON')
  }
}

function isFreshFor(timestamp: unknown, duration: number): timestamp is number {
  return Number.isFinite(timestamp) && Date.now() < (timestamp as number) + duration
}

function validateDuration(value: number | undefined, fallback: number, option: string): number {
  if (Number.isNaN(value)) {
    throw new TypeError(`"${option}" option must not be NaN`)
  }
  return typeof value === 'number' ? value : fallback
}

export function createRemoteJWKSetWithFactory(
  url: URL,
  options: RemoteJWKSetOptions | undefined,
  createLocalJWKSet: LocalJWKSetFactory,
): RemoteJWKSet {
  if (!(url instanceof URL)) {
    throw new TypeError('url must be an instance of URL')
  }
  const href = new URL(url.href).href

  const opts = options ?? {}
  const timeoutOption = opts.timeoutDuration
  if (
    typeof timeoutOption === 'number' &&
    (!Number.isInteger(timeoutOption) || timeoutOption < 0)
  ) {
    throw new TypeError('"timeoutDuration" option must be a non-negative integer')
  }
  const timeoutDuration = typeof timeoutOption === 'number' ? timeoutOption : 5000
  const cooldownDuration = validateDuration(opts.cooldownDuration, 30000, 'cooldownDuration')
  const cacheMaxAge = validateDuration(opts.cacheMaxAge, 600000, 'cacheMaxAge')
  const headers = new Headers(opts.headers)
  if (USER_AGENT && !headers.has('User-Agent')) {
    headers.set('User-Agent', USER_AGENT)
  }
  if (!headers.has('accept')) {
    headers.set('accept', 'application/json, application/jwk-set+json')
  }

  const fetchImpl = (opts as { [customFetch]?: FetchImplementation })[customFetch]
  const cache = (opts as { [jwksCache]?: JWKSCacheInput })[jwksCache]
  let jwksTimestamp: number | undefined
  let pendingFetch: Promise<unknown> | undefined
  let reloadSequence = 0
  let appliedSequence = 0
  let local: LocalJWKSet | undefined

  if (cache && typeof cache === 'object') {
    const { uat, jwks } = cache as Partial<ExportedJWKSCache>
    if (isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks)) {
      jwksTimestamp = uat
      local = createLocalJWKSet(jwks)
    }
  }

  const reload = async () => {
    // Do not assume a fetch created in another request reliably resolves.
    if (pendingFetch && isCloudflareWorkers()) {
      pendingFetch = undefined
    }

    if (!pendingFetch) {
      const sequence = ++reloadSequence
      const current = (pendingFetch = fetchJwks(
        href,
        headers,
        AbortSignal.timeout(timeoutDuration),
        fetchImpl,
      )
        .then((json) => {
          const next = createLocalJWKSet(json as unknown as types.JSONWebKeySet)
          if (sequence <= appliedSequence) {
            return
          }
          local = next
          const updatedAt = Date.now()
          if (cache) {
            cache.uat = updatedAt
            cache.jwks = json as unknown as types.JSONWebKeySet
          }
          jwksTimestamp = updatedAt
          appliedSequence = sequence
        })
        .finally(() => {
          if (pendingFetch === current) {
            pendingFetch = undefined
          }
        }))
    }

    await pendingFetch
  }

  const remoteJWKSet = async (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> => {
    if (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) {
      await reload()
    }

    try {
      return await local!(protectedHeader, token)
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration)) {
        await reload()
        return local!(protectedHeader, token)
      }
      throw err
    }
  }

  return Object.defineProperties(remoteJWKSet, {
    coolingDown: {
      get: () => isFreshFor(jwksTimestamp, cooldownDuration),
      enumerable: true,
    },
    fresh: {
      get: () => isFreshFor(jwksTimestamp, cacheMaxAge),
      enumerable: true,
    },
    reload: {
      value: reload,
      enumerable: true,
    },
    reloading: {
      get: () => !!pendingFetch,
      enumerable: true,
    },
    jwks: {
      value: () => local?.jwks(),
      enumerable: true,
    },
  }) as RemoteJWKSet
}
