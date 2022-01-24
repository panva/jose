import fetchJwks from '../runtime/fetch_jwks.ts'

import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput, GetKeyFunction } from '../types.d.ts'
import { JWKSInvalid, JWKSNoMatchingKey } from '../util/errors.ts'

import { isJWKSLike, LocalJWKSet } from './local.ts'

/**
 * Options for the remote JSON Web Key Set.
 */
export interface RemoteJWKSetOptions {
  /**
   * Timeout (in milliseconds) for the HTTP request. When reached the request will be
   * aborted and the verification will fail. Default is 5000.
   */
  timeoutDuration?: number

  /**
   * Duration (in milliseconds) for which no more HTTP requests will be triggered
   * after a previous successful fetch. Default is 30000.
   */
  cooldownDuration?: number

  /**
   * An instance of [http.Agent](https://nodejs.org/api/http.html#http_class_http_agent)
   * or [https.Agent](https://nodejs.org/api/https.html#https_class_https_agent) to pass
   * to the [http.get](https://nodejs.org/api/http.html#http_http_get_options_callback)
   * or [https.get](https://nodejs.org/api/https.html#https_https_get_options_callback)
   * method's options. Use when behind an http(s) proxy.
   * This is a Node.js runtime specific option, it is ignored
   * when used outside of Node.js runtime.
   */
  agent?: any
}

class RemoteJWKSet extends LocalJWKSet {
  private _url: globalThis.URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cooldownStarted?: number

  private _pendingFetch?: Promise<unknown>

  private _options: Pick<RemoteJWKSetOptions, 'agent'>

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
    super({ keys: [] })

    this._jwks = undefined

    if (!(url instanceof URL)) {
      throw new TypeError('url must be an instance of URL')
    }
    this._url = new URL(url.href)
    this._options = { agent: options?.agent }
    this._timeoutDuration =
      typeof options?.timeoutDuration === 'number' ? options?.timeoutDuration : 5000
    this._cooldownDuration =
      typeof options?.cooldownDuration === 'number' ? options?.cooldownDuration : 30000
  }

  coolingDown() {
    if (!this._cooldownStarted) {
      return false
    }

    return Date.now() < this._cooldownStarted + this._cooldownDuration
  }

  async getKey(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<KeyLike> {
    if (!this._jwks) {
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
    if (!this._pendingFetch) {
      this._pendingFetch = fetchJwks(this._url, this._timeoutDuration, this._options)
        .then((json) => {
          if (!isJWKSLike(json)) {
            throw new JWKSInvalid('JSON Web Key Set malformed')
          }

          this._jwks = { keys: json.keys }
          this._cooldownStarted = Date.now()
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

interface URL {
  href: string
}

/**
 * Returns a function that resolves to a key object downloaded from a
 * remote endpoint returning a JSON Web Key Set, that is, for example,
 * an OAuth 2.0 or OIDC jwks_uri. Only a single public key must match
 * the selection process.
 * The JSON Web Key Set is fetched when no key matches the selection
 * process but only as frequently as the `cooldownDuration` option allows,
 * to prevent abuse.
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 *
 * @example Usage
 * ```js
 * const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export function createRemoteJWKSet(
  url: URL,
  options?: RemoteJWKSetOptions,
): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
  return RemoteJWKSet.prototype.getKey.bind(new RemoteJWKSet(url, options))
}
