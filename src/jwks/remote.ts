import fetchJwks from '../runtime/fetch_jwks.js'

import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput } from '../types.d'
import { JWKSInvalid, JWKSNoMatchingKey } from '../util/errors.js'

import { isJWKSLike, LocalJWKSet } from './local.js'

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
  const VERSION = 'v5.2.0'
  USER_AGENT = `${NAME}/${VERSION}`
}

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
}

class RemoteJWKSet<KeyLikeType extends KeyLike = KeyLike> extends LocalJWKSet<KeyLikeType> {
  private _url: URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cacheMaxAge: number

  private _jwksTimestamp?: number

  private _pendingFetch?: Promise<unknown>

  private _options: Pick<RemoteJWKSetOptions, 'agent' | 'headers'>

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
    super({ keys: [] })

    this._jwks = undefined

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
    if (!this._jwks || !this.fresh()) {
      await this.reload()
    }

    try {
      return await super.getKey(protectedHeader, token)
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload()
          return super.getKey(protectedHeader, token)
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
        if (!isJWKSLike(json)) {
          throw new JWKSInvalid('JSON Web Key Set malformed')
        }

        this._jwks = { keys: json.keys }
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
) {
  const set = new RemoteJWKSet<KeyLikeType>(url, options)
  return async function (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> {
    return set.getKey(protectedHeader, token)
  }
}
