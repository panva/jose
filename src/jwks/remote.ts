/**
 * Verification using a JSON Web Key Set (JWKS) available on an HTTP(S) URL
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { JOSEError, JWKSNoMatchingKey, JWKSTimeout } from '../util/errors.js'
import { createLocalJWKSet } from './local.js'
import { isJwkSet } from '../lib/validate.js'

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
  const VERSION = 'v6.2.11'
  USER_AGENT = `${NAME}/${VERSION}`
}

/**
 * Symbol used to configure a custom fetch implementation for remote JWKS retrieval.
 *
 * Pass this to {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to use advanced fetch
 * configurations, HTTP proxies, network-error retries, and similar behavior.
 *
 * > [!NOTE]\
 * > Known caveat: Expect Type-related issues when passing the inputs through to fetch-like modules,
 * > they hardly ever get their typings inline with actual fetch, you should `@ts-expect-error` them.
 *
 * @example
 *
 * Using [sindresorhus/ky](https://github.com/sindresorhus/ky) for retries and its hooks feature for
 * logging outgoing requests and their responses.
 *
 * ```ts
 * import ky from 'ky'
 *
 * // Prerequisites
 * let url!: URL
 *
 * let logRequest!: (request: Request) => void
 * let logResponse!: (request: Request, response: Response) => void
 * let logRetry!: (request: Request, error: Error, retryCount: number) => void
 *
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.customFetch]: (...args) =>
 *     ky(args[0], {
 *       ...args[1],
 *       hooks: {
 *         beforeRequest: [
 *           (request) => {
 *             logRequest(request)
 *           },
 *         ],
 *         beforeRetry: [
 *           ({ request, error, retryCount }) => {
 *             logRetry(request, error, retryCount)
 *           },
 *         ],
 *         afterResponse: [
 *           (request, _, response) => {
 *             logResponse(request, response)
 *           },
 *         ],
 *       },
 *     }),
 * })
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to detect and use HTTP proxies.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // Prerequisites
 * let url!: URL
 *
 * // see https://undici.nodejs.org/api/EnvHttpProxyAgent
 * let envHttpProxyAgent = new undici.EnvHttpProxyAgent()
 *
 * // @ts-ignore
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.customFetch]: (...args) => {
 *     // @ts-ignore
 *     return undici.fetch(args[0], { ...args[1], dispatcher: envHttpProxyAgent }) // prettier-ignore
 *   },
 * })
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to automatically retry network errors.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // Prerequisites
 * let url!: URL
 *
 * // see https://undici.nodejs.org/api/RetryAgent
 * let retryAgent = new undici.RetryAgent(new undici.Agent(), {
 *   statusCodes: [],
 *   errorCodes: [
 *     'ECONNRESET',
 *     'ECONNREFUSED',
 *     'ENOTFOUND',
 *     'ENETDOWN',
 *     'ENETUNREACH',
 *     'EHOSTDOWN',
 *     'UND_ERR_SOCKET',
 *   ],
 * })
 *
 * // @ts-ignore
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.customFetch]: (...args) => {
 *     // @ts-ignore
 *     return undici.fetch(args[0], { ...args[1], dispatcher: retryAgent }) // prettier-ignore
 *   },
 * })
 * ```
 *
 * @example
 *
 * Using [nodejs/undici](https://github.com/nodejs/undici) to mock responses in tests.
 *
 * ```ts
 * import * as undici from 'undici'
 *
 * // Prerequisites
 * let url!: URL
 *
 * // see https://undici.nodejs.org/api/MockAgent
 * let mockAgent = new undici.MockAgent()
 * mockAgent.disableNetConnect()
 *
 * // @ts-ignore
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.customFetch]: (...args) => {
 *     // @ts-ignore
 *     return undici.fetch(args[0], { ...args[1], dispatcher: mockAgent }) // prettier-ignore
 *   },
 * })
 * ```
 */
export const customFetch: unique symbol = Symbol()

/** Function signature accepted by {@link customFetch}. */
export type FetchImplementation = (
  /** URL the request is being made sent to {@link !fetch} as the `resource` argument */
  url: string,
  /** Options otherwise sent to {@link !fetch} as the `options` argument */
  options: {
    /** HTTP Headers */
    headers: Headers
    /** The {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods request method} */
    method: 'GET'
    /** See {@link !Request.redirect} */
    redirect: 'manual'
    signal: AbortSignal
  },
) => Promise<Response>

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

/**
 * Symbol used to configure an externally persisted remote JWKS cache.
 *
 * > [!WARNING]\
 * > This option has security implications that must be understood, assessed for applicability, and
 * > accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
 * > code.
 *
 * This option is intended for cloud computing runtimes that cannot keep an in memory cache between
 * their code's invocations. The supplied writable object seeds the resolver's cache and is updated
 * with `jwks` and `uat` after a successful fetch; persist it whenever `uat` changes. Using this in
 * runtimes that can keep an in-memory cache between requests is not desirable.
 *
 * When passed to {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} this allows the passed in
 * object to:
 *
 * - Serve as an initial value for the JSON Web Key Set that the module would otherwise need to
 *   trigger an HTTP request for
 * - Have the JSON Web Key Set the function optionally ended up triggering an HTTP request for
 *   assigned to it as properties
 *
 * The intended use pattern is:
 *
 * - Before verifying with {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} you pull the
 *   previously cached object from a low-latency key-value store offered by the cloud computing
 *   runtime it is executed on;
 * - Default to an empty object `{}` instead when there's no previously cached value;
 * - Pass it in as {@link RemoteJWKSetOptions[jwksCache]};
 * - Afterwards, update the key-value storage if the {@link ExportedJWKSCache.uat `uat`} property of
 *   the object has changed.
 *
 * @example
 *
 * ```ts
 * // Prerequisites
 * let url!: URL
 * let jwt!: string
 * let getPreviouslyCachedJWKS!: () => Promise<jose.ExportedJWKSCache>
 * let storeNewJWKScache!: (cache: jose.ExportedJWKSCache) => Promise<void>
 *
 * // Load JSON Web Key Set cache
 * const jwksCache: jose.JWKSCacheInput = (await getPreviouslyCachedJWKS()) || {}
 * const { uat } = jwksCache
 *
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.jwksCache]: jwksCache,
 * })
 *
 * // Use JSON Web Key Set cache
 * await jose.jwtVerify(jwt, JWKS)
 *
 * if (uat !== jwksCache.uat) {
 *   // Update JSON Web Key Set cache
 *   await storeNewJWKScache(jwksCache)
 * }
 * ```
 */
export const jwksCache: unique symbol = Symbol()

/** Remote JWKS resolver options. */
export interface RemoteJWKSetOptions {
  /**
   * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
   * the verification will fail. Must be a non-negative integer. Default is 5000 (5 seconds).
   */
  timeoutDuration?: number

  /**
   * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
   * successful fetch. Must not be `NaN`. Default is 30000 (30 seconds).
   */
  cooldownDuration?: number

  /**
   * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
   * minutes). Must not be `NaN`.
   */
  cacheMaxAge?: number | typeof Infinity

  /** Headers to be sent with the HTTP request. */
  headers?: Record<string, string>

  /** See {@link jwksCache}. */
  [jwksCache]?: JWKSCacheInput

  /** See {@link customFetch}. */
  [customFetch]?: FetchImplementation
}

/** Shape of an externally persisted remote JWKS cache. */
export interface ExportedJWKSCache {
  /** Current cached JSON Web Key Set */
  jwks: types.JSONWebKeySet
  /** Last updated at timestamp (milliseconds since epoch) */
  uat: number
}

/** Values accepted by the {@link jwksCache} option. */
export type JWKSCacheInput = ExportedJWKSCache | Record<string, never>

/**
 * A key resolver created by {@link createRemoteJWKSet}.
 *
 * @see {@link jwt/verify.jwtVerify jwtVerify} and the other consuming functions, all of which accept
 *   this directly.
 */
export interface RemoteJWKSet {
  (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey>

  /** Whether the cooldown window following the last successful fetch is still in effect. */
  readonly coolingDown: boolean

  /**
   * Whether the currently cached JSON Web Key Set is within its
   * {@link RemoteJWKSetOptions.cacheMaxAge}.
   */
  readonly fresh: boolean

  /** Whether a JSON Web Key Set fetch is currently in flight. */
  readonly reloading: boolean

  /**
   * Triggers a JSON Web Key Set fetch, bypassing
   * {@link RemoteJWKSetOptions.cooldownDuration the cooldown}.
   */
  reload: () => Promise<void>

  /**
   * The currently cached JSON Web Key Set, or `undefined` when none has been fetched or seeded via
   * {@link jwksCache} yet.
   */
  jwks: () => types.JSONWebKeySet | undefined
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

/**
 * Creates a resolver for a JSON Web Key Set available at an HTTP(S) URL.
 *
 * The JSON Web Key Set is fetched when no key matches, but only as frequently as the
 * `cooldownDuration` option allows. Selection uses the header's "alg" (Algorithm) and "kid" (Key
 * ID), and respects the JWK's "use" (Public Key Use) and "key_ops" (Key Operations). Exactly one
 * key must match.
 *
 * Only a single public key must match the selection process. As shown in the example below when
 * multiple keys get matched it is possible to opt-in to iterate over the matched keys and attempt
 * verification in an iterative manner.
 *
 * > [!NOTE]\
 * > The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwks/remote'`.
 *
 * @example
 *
 * ```js
 * const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @example
 *
 * Opting-in to multiple JWKS matches using `createRemoteJWKSet`
 *
 * ```js
 * const options = {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * }
 * const { payload, protectedHeader } = await jose
 *   .jwtVerify(jwt, JWKS, options)
 *   .catch(async (error) => {
 *     if (error instanceof jose.errors.JWKSMultipleMatchingKeys) {
 *       for await (const publicKey of error) {
 *         try {
 *           return await jose.jwtVerify(jwt, publicKey, options)
 *         } catch (innerError) {
 *           if (innerError instanceof jose.errors.JWSSignatureVerificationFailed) {
 *             continue
 *           }
 *           throw innerError
 *         }
 *       }
 *       throw new jose.errors.JWSSignatureVerificationFailed()
 *     }
 *
 *     throw error
 *   })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): RemoteJWKSet {
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

  const fetchImpl = opts[customFetch]
  const cache = opts[jwksCache]
  let jwksTimestamp: number | undefined
  let pendingFetch: Promise<unknown> | undefined
  let reloadSequence = 0
  let appliedSequence = 0
  let local: ReturnType<typeof createLocalJWKSet> | undefined

  if (cache && typeof cache === 'object') {
    const { uat, jwks } = cache as Partial<ExportedJWKSCache>
    if (isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks)) {
      jwksTimestamp = uat
      local = createLocalJWKSet(jwks)
    }
  }

  const reload = async () => {
    // Do not assume a fetch created in another request reliably resolves
    // see https://github.com/panva/jose/issues/355 and https://github.com/panva/jose/issues/509
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

  // Object.defineProperties is used for the property attributes it affords and returns the
  // un-augmented type; RemoteJWKSet describes exactly what the block below installs.
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
