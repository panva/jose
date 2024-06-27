import fetchJwks from '../runtime/fetch_jwks.js'

import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput, JSONWebKeySet } from '../types.d'
import { JWKSNoMatchingKey } from '../util/errors.js'

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
  const VERSION = 'v5.6.2'
  USER_AGENT = `${NAME}/${VERSION}`
}

/**
 * This is an experimental feature, it is not subject to semantic versioning rules. Non-backward
 * compatible changes or removal may occur in any future release.
 *
 * DANGER ZONE - This option has security implications that must be understood, assessed for
 * applicability, and accepted before use. It is critical that the JSON Web Key Set cache only be
 * writable by your own code.
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
 * - Pass it in as {@link RemoteJWKSetOptions[experimental_jwksCache]};
 * - Afterwards, update the key-value storage if the {@link ExportedJWKSCache.uat `uat`} property of
 *   the object has changed.
 *
 * @example
 *
 * ```ts
 * import * as jose from 'jose'
 *
 * // Prerequisites
 * let url!: URL
 * let jwt!: string
 *
 * // Load JSON Web Key Set cache
 * const jwksCache: jose.JWKSCacheInput = (await getPreviouslyCachedJWKS()) || {}
 * const { uat } = jwksCache
 *
 * const JWKS = jose.createRemoteJWKSet(url, {
 *   [jose.experimental_jwksCache]: jwksCache,
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
export const experimental_jwksCache: unique symbol = Symbol()

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

  /**
   * An instance of {@link https://nodejs.org/api/http.html#class-httpagent http.Agent} or
   * {@link https://nodejs.org/api/https.html#class-httpsagent https.Agent} to pass to the
   * {@link https://nodejs.org/api/http.html#httpgetoptions-callback http.get} or
   * {@link https://nodejs.org/api/https.html#httpsgetoptions-callback https.get} method's options.
   * Use when behind an http(s) proxy. This is a Node.js runtime specific option, it is ignored when
   * used outside of Node.js runtime.
   */
  agent?: any

  /**
   * Headers to be sent with the HTTP request. Default is that `User-Agent: jose/v${version}` header
   * is added unless the runtime is a browser in which adding an explicit headers fetch
   * configuration would cause an unnecessary CORS preflight request.
   */
  headers?: Record<string, string>

  /** See {@link experimental_jwksCache}. */
  [experimental_jwksCache]?: JWKSCacheInput
}

export interface ExportedJWKSCache {
  jwks: JSONWebKeySet
  uat: number
}

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
    !isObject<JSONWebKeySet>(input.jwks) ||
    !Array.isArray(input.jwks.keys) ||
    !Array.prototype.every.call(input.jwks.keys, isObject)
  ) {
    return false
  }

  return true
}

class RemoteJWKSet<KeyLikeType extends KeyLike = KeyLike> {
  private _url: URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cacheMaxAge: number

  private _jwksTimestamp?: number

  private _pendingFetch?: Promise<unknown>

  private _options: Pick<RemoteJWKSetOptions, 'agent' | 'headers'>

  private _local!: ReturnType<typeof createLocalJWKSet<KeyLikeType>>

  private _cache?: JWKSCacheInput

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
    if (!(url instanceof URL)) {
      throw new TypeError('url must be an instance of URL')
    }
    this._url = new URL(url.href)
    this._options = { agent: options?.agent, headers: options?.headers }
    this._timeoutDuration =
      typeof options?.timeoutDuration === 'number' ? options?.timeoutDuration : 5000
    this._cooldownDuration =
      typeof options?.cooldownDuration === 'number' ? options?.cooldownDuration : 30000
    this._cacheMaxAge = typeof options?.cacheMaxAge === 'number' ? options?.cacheMaxAge : 600000

    if (options?.[experimental_jwksCache] !== undefined) {
      this._cache = options?.[experimental_jwksCache]
      if (isFreshJwksCache(options?.[experimental_jwksCache], this._cacheMaxAge)) {
        this._jwksTimestamp = this._cache.uat
        this._local = createLocalJWKSet(this._cache.jwks)
      }
    }
  }

  coolingDown() {
    return typeof this._jwksTimestamp === 'number'
      ? Date.now() < this._jwksTimestamp + this._cooldownDuration
      : false
  }

  fresh() {
    return typeof this._jwksTimestamp === 'number'
      ? Date.now() < this._jwksTimestamp + this._cacheMaxAge
      : false
  }

  async getKey(
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> {
    if (!this._local || !this.fresh()) {
      await this.reload()
    }

    try {
      return await this._local(protectedHeader, token)
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload()
          return this._local(protectedHeader, token)
        }
      }
      throw err
    }
  }

  async reload() {
    // Do not assume a fetch created in another request reliably resolves
    // see https://github.com/panva/jose/issues/355 and https://github.com/panva/jose/issues/509
    if (this._pendingFetch && isCloudflareWorkers()) {
      this._pendingFetch = undefined
    }

    const headers = new Headers(this._options.headers)
    if (USER_AGENT && !headers.has('User-Agent')) {
      headers.set('User-Agent', USER_AGENT)
      this._options.headers = Object.fromEntries(headers.entries())
    }

    this._pendingFetch ||= fetchJwks(this._url, this._timeoutDuration, this._options)
      .then((json) => {
        this._local = createLocalJWKSet(<JSONWebKeySet>(<unknown>json))
        if (this._cache) {
          this._cache.uat = Date.now()
          this._cache.jwks = <JSONWebKeySet>(<unknown>json)
        }
        this._jwksTimestamp = Date.now()
        this._pendingFetch = undefined
      })
      .catch((err: Error) => {
        this._pendingFetch = undefined
        throw err
      })

    await this._pendingFetch
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
 * Note: The function's purpose is to resolve public keys used for verifying signatures and will not
 * work for public encryption keys.
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
export function createRemoteJWKSet<KeyLikeType extends KeyLike = KeyLike>(
  url: URL,
  options?: RemoteJWKSetOptions,
): {
  (protectedHeader?: JWSHeaderParameters, token?: FlattenedJWSInput): Promise<KeyLikeType>
  /** @ignore */
  coolingDown: boolean
  /** @ignore */
  fresh: boolean
  /** @ignore */
  reloading: boolean
  /** @ignore */
  reload: () => Promise<void>
  /** @ignore */
  jwks: () => JSONWebKeySet | undefined
} {
  const set = new RemoteJWKSet<KeyLikeType>(url, options)

  const remoteJWKSet = async (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> => set.getKey(protectedHeader, token)

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
      // @ts-expect-error
      get: () => !!set._pendingFetch,
      enumerable: true,
      configurable: false,
    },
    jwks: {
      // @ts-expect-error
      value: () => set._local?.jwks(),
      enumerable: true,
      configurable: false,
      writable: false,
    },
  })

  // @ts-expect-error
  return remoteJWKSet
}
