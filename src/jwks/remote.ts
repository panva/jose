import fetchJwks from '../runtime/fetch_jwks.js'
import { isCloudflareWorkers } from '../runtime/env.js'

import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput } from '../types.d'
import { JWKSInvalid, JWKSNoMatchingKey } from '../util/errors.js'

import { isJWKSLike, LocalJWKSet } from './local.js'

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
   * An instance of [http.Agent](https://nodejs.org/api/http.html#class-httpagent) or
   * [https.Agent](https://nodejs.org/api/https.html#class-httpsagent) to pass to the
   * [http.get](https://nodejs.org/api/http.html#httpgetoptions-callback) or
   * [https.get](https://nodejs.org/api/https.html#httpsgetoptions-callback) method's options. Use
   * when behind an http(s) proxy. This is a Node.js runtime specific option, it is ignored when
   * used outside of Node.js runtime.
   */
  agent?: any

  /** Optional headers to be sent with the HTTP request. */
  headers?: Record<string, string>
}

class RemoteJWKSet<T extends KeyLike = KeyLike> extends LocalJWKSet<T> {
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

  async getKey(protectedHeader?: JWSHeaderParameters, token?: FlattenedJWSInput): Promise<T> {
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
    // see https://github.com/panva/jose/issues/355
    if (this._pendingFetch && isCloudflareWorkers()) {
      return new Promise<void>((resolve) => {
        const isDone = () => {
          if (this._pendingFetch === undefined) {
            resolve()
          } else {
            setTimeout(isDone, 5)
          }
        }
        isDone()
      })
    }

    if (!this._pendingFetch) {
      this._pendingFetch = fetchJwks(this._url, this._timeoutDuration, this._options)
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
    }

    await this._pendingFetch
  }
}

/**
 * Returns a function that resolves to a key object downloaded from a remote endpoint returning a
 * JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC jwks_uri. The JSON Web Key Set is
 * fetched when no key matches the selection process but only as frequently as the
 * `cooldownDuration` option allows to prevent abuse.
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
 * @example Usage
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
 * @example Opting-in to multiple JWKS matches using `createRemoteJWKSet`
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
export function createRemoteJWKSet<T extends KeyLike = KeyLike>(
  url: URL,
  options?: RemoteJWKSetOptions,
) {
  const set = new RemoteJWKSet<T>(url, options)
  return async function (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<T> {
    return set.getKey(protectedHeader, token)
  }
}
