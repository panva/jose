/**
 * Verification using a JSON Web Key Set (JWKS) available on an HTTP(S) URL
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { JOSEError, JWKSNoMatchingKey, JWKSTimeout } from '../util/errors.js'

import { createLocalJWKSet } from './local.js'
import isObject from '../lib/is_object.js'

function isCloudflareWorkers() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' ||
    // @ts-ignore
    (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') ||
    // @ts-ignore
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
  const VERSION = 'v6.0.13'
  USER_AGENT = `${NAME}/${VERSION}`
}

/**
 * When passed to {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} this allows the resolver
 * to make use of advanced fetch configurations, HTTP Proxies, retry on network errors, etc.
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
 * // see https://undici.nodejs.org/#/docs/api/EnvHttpProxyAgent
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
 * // see https://undici.nodejs.org/#/docs/api/RetryAgent
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
 * // see https://undici.nodejs.org/#/docs/api/MockAgent
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

/** See {@link customFetch}. */
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
 * > [!WARNING]\
 * > This option has security implications that must be understood, assessed for applicability, and
 * > accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
 * > code.
 *
 * This option is intended for cloud computing runtimes that cannot keep an in memory cache between
 * their code's invocations. Use in runtimes where an in memory cache between requests is available
 * is not desirable.
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

/** Options for the remote JSON Web Key Set. */
export interface RemoteJWKSetOptions {
  /**
   * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
   * the verification will fail. Default is 5000 (5 seconds).
   */
  timeoutDuration?: number

  /**
   * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
   * successful fetch. Default is 30000 (30 seconds).
   */
  cooldownDuration?: number

  /**
   * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
   * minutes).
   */
  cacheMaxAge?: number | typeof Infinity

  /** Headers to be sent with the HTTP request. */
  headers?: Record<string, string>

  /** See {@link jwksCache}. */
  [jwksCache]?: JWKSCacheInput

  /** See {@link customFetch}. */
  [customFetch]?: FetchImplementation
}

/** See {@link jwksCache}. */
export interface ExportedJWKSCache {
  /** Current cached JSON Web Key Set */
  jwks: types.JSONWebKeySet
  /** Last updated at timestamp (seconds since epoch) */
  uat: number
}

/** See {@link jwksCache}. */
export type JWKSCacheInput = ExportedJWKSCache | Record<string, never>

function isFreshJwksCache(input: unknown, cacheMaxAge: number): input is ExportedJWKSCache {
  if (typeof input !== 'object' || input === null) {
    return false
  }

  if (!('uat' in input) || typeof input.uat !== 'number' || Date.now() - input.uat >= cacheMaxAge) {
    return false
  }

  if (
    !('jwks' in input) ||
    !isObject<types.JSONWebKeySet>(input.jwks) ||
    !Array.isArray(input.jwks.keys) ||
    !Array.prototype.every.call(input.jwks.keys, isObject)
  ) {
    return false
  }

  return true
}

class RemoteJWKSet {
  #url: URL

  #timeoutDuration: number

  #cooldownDuration: number

  #cacheMaxAge: number

  #jwksTimestamp?: number

  #pendingFetch?: Promise<unknown>

  #headers: Headers

  #customFetch?: FetchImplementation

  #local!: ReturnType<typeof createLocalJWKSet>

  #cache?: JWKSCacheInput

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
    if (!(url instanceof URL)) {
      throw new TypeError('url must be an instance of URL')
    }
    this.#url = new URL(url.href)

    this.#timeoutDuration =
      typeof options?.timeoutDuration === 'number' ? options?.timeoutDuration : 5000
    this.#cooldownDuration =
      typeof options?.cooldownDuration === 'number' ? options?.cooldownDuration : 30000
    this.#cacheMaxAge = typeof options?.cacheMaxAge === 'number' ? options?.cacheMaxAge : 600000
    this.#headers = new Headers(options?.headers)
    if (USER_AGENT && !this.#headers.has('User-Agent')) {
      this.#headers.set('User-Agent', USER_AGENT)
    }

    if (!this.#headers.has('accept')) {
      this.#headers.set('accept', 'application/json')
      this.#headers.append('accept', 'application/jwk-set+json')
    }

    this.#customFetch = options?.[customFetch]

    if (options?.[jwksCache] !== undefined) {
      this.#cache = options?.[jwksCache]
      if (isFreshJwksCache(options?.[jwksCache], this.#cacheMaxAge)) {
        this.#jwksTimestamp = this.#cache.uat
        this.#local = createLocalJWKSet(this.#cache.jwks)
      }
    }
  }

  pendingFetch(): boolean {
    return !!this.#pendingFetch
  }

  coolingDown(): boolean {
    return typeof this.#jwksTimestamp === 'number'
      ? Date.now() < this.#jwksTimestamp + this.#cooldownDuration
      : false
  }

  fresh(): boolean {
    return typeof this.#jwksTimestamp === 'number'
      ? Date.now() < this.#jwksTimestamp + this.#cacheMaxAge
      : false
  }

  jwks(): types.JSONWebKeySet | undefined {
    // @ts-expect-error
    return this.#local?.jwks()
  }

  async getKey(
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> {
    if (!this.#local || !this.fresh()) {
      await this.reload()
    }

    try {
      return await this.#local(protectedHeader, token)
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload()
          return this.#local(protectedHeader, token)
        }
      }
      throw err
    }
  }

  async reload() {
    // Do not assume a fetch created in another request reliably resolves
    // see https://github.com/panva/jose/issues/355 and https://github.com/panva/jose/issues/509
    if (this.#pendingFetch && isCloudflareWorkers()) {
      this.#pendingFetch = undefined
    }

    this.#pendingFetch ||= fetchJwks(
      this.#url.href,
      this.#headers,
      AbortSignal.timeout(this.#timeoutDuration),
      this.#customFetch,
    )
      .then((json) => {
        this.#local = createLocalJWKSet(json as unknown as types.JSONWebKeySet)
        if (this.#cache) {
          this.#cache.uat = Date.now()
          this.#cache.jwks = json as unknown as types.JSONWebKeySet
        }
        this.#jwksTimestamp = Date.now()
        this.#pendingFetch = undefined
      })
      .catch((err: Error) => {
        this.#pendingFetch = undefined
        throw err
      })

    await this.#pendingFetch
  }
}

/**
 * Returns a function that resolves a JWS JOSE Header to a public key object downloaded from a
 * remote endpoint returning a JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC
 * jwks_uri. The JSON Web Key Set is fetched when no key matches the selection process but only as
 * frequently as the `cooldownDuration` option allows to prevent abuse.
 *
 * It uses the "alg" (JWS Algorithm) Header Parameter to determine the right JWK "kty" (Key Type),
 * then proceeds to match the JWK "kid" (Key ID) with one found in the JWS Header Parameters (if
 * there is one) while also respecting the JWK "use" (Public Key Use) and JWK "key_ops" (Key
 * Operations) Parameters (if they are present on the JWK).
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
 *     if (error?.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
 *       for await (const publicKey of error) {
 *         try {
 *           return await jose.jwtVerify(jwt, publicKey, options)
 *         } catch (innerError) {
 *           if (innerError?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
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
export function createRemoteJWKSet(
  url: URL,
  options?: RemoteJWKSetOptions,
): {
  (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey>
  /** @ignore */
  coolingDown: boolean
  /** @ignore */
  fresh: boolean
  /** @ignore */
  reloading: boolean
  /** @ignore */
  reload: () => Promise<void>
  /** @ignore */
  jwks: () => types.JSONWebKeySet | undefined
} {
  const set = new RemoteJWKSet(url, options)

  const remoteJWKSet = async (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> => set.getKey(protectedHeader, token)

  Object.defineProperties(remoteJWKSet, {
    coolingDown: {
      get: () => set.coolingDown(),
      enumerable: true,
      configurable: false,
    },
    fresh: {
      get: () => set.fresh(),
      enumerable: true,
      configurable: false,
    },
    reload: {
      value: () => set.reload(),
      enumerable: true,
      configurable: false,
      writable: false,
    },
    reloading: {
      get: () => set.pendingFetch(),
      enumerable: true,
      configurable: false,
    },
    jwks: {
      value: () => set.jwks(),
      enumerable: true,
      configurable: false,
      writable: false,
    },
  })

  // @ts-expect-error
  return remoteJWKSet
}
