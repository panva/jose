import fetchJwks from '../runtime/fetch_jwks.ts'

import type {
  KeyLike,
  JWSHeaderParameters,
  JWK,
  FlattenedJWSInput,
  GetKeyFunction,
} from '../types.d.ts'
import { importJWK } from '../key/import.ts'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.ts'
import isObject from '../lib/is_object.ts'

function getKtyFromAlg(alg: unknown) {
  switch (typeof alg === 'string' && alg.substr(0, 2)) {
    case 'RS':
    case 'PS':
      return 'RSA'
    case 'ES':
      return 'EC'
    case 'Ed':
      return 'OKP'
    default:
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set')
  }
}

interface Cache {
  [alg: string]: KeyLike
}

/**
 * Options for the remote JSON Web Key Set.
 */
export interface RemoteJWKSetOptions {
  /**
   * Timeout for the HTTP request. When reached the request will be
   * aborted and the verification will fail. Default is 5000.
   */
  timeoutDuration?: number

  /**
   * Duration for which no more HTTP requests will be triggered
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

function isJWKLike(key: unknown) {
  return isObject<JWK>(key)
}

class RemoteJWKSet {
  private _url: globalThis.URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cooldownStarted?: number

  private _jwks?: { keys: JWK[] }

  private _cached: WeakMap<JWK, Cache> = new WeakMap()

  private _pendingFetch?: Promise<unknown>

  private _options: Pick<RemoteJWKSetOptions, 'agent'>

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
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
    const joseHeader = {
      ...protectedHeader,
      ...token.header,
    }

    if (!this._jwks) {
      await this.reload()
    }

    const candidates = this._jwks!.keys.filter((jwk) => {
      // filter keys based on the mapping of signature algorithms to Key Type
      let candidate = jwk.kty === getKtyFromAlg(joseHeader.alg)

      // filter keys based on the JWK Key ID in the header
      if (candidate && typeof joseHeader.kid === 'string') {
        candidate = joseHeader.kid === jwk.kid
      }

      // filter keys based on the key's declared Algorithm
      if (candidate && typeof jwk.alg === 'string') {
        candidate = joseHeader.alg === jwk.alg
      }

      // filter keys based on the key's declared Public Key Use
      if (candidate && typeof jwk.use === 'string') {
        candidate = jwk.use === 'sig'
      }

      // filter keys based on the key's declared Key Operations
      if (candidate && Array.isArray(jwk.key_ops)) {
        candidate = jwk.key_ops.includes('verify')
      }

      // filter out non-applicable OKP Sub Types
      if (candidate && joseHeader.alg === 'EdDSA') {
        candidate = jwk.crv === 'Ed25519' || jwk.crv === 'Ed448'
      }

      // filter out non-applicable EC curves
      if (candidate) {
        switch (joseHeader.alg) {
          case 'ES256':
            candidate = jwk.crv === 'P-256'
            break
          case 'ES256K':
            candidate = jwk.crv === 'secp256k1'
            break
          case 'ES384':
            candidate = jwk.crv === 'P-384'
            break
          case 'ES512':
            candidate = jwk.crv === 'P-521'
            break
          default:
        }
      }

      return candidate
    })

    const { 0: jwk, length } = candidates

    if (length === 0) {
      if (this.coolingDown() === false) {
        await this.reload()
        return this.getKey(joseHeader, token)
      }
      throw new JWKSNoMatchingKey()
    } else if (length !== 1) {
      throw new JWKSMultipleMatchingKeys()
    }

    const cached = this._cached.get(jwk) || this._cached.set(jwk, {}).get(jwk)!
    if (cached[joseHeader.alg!] === undefined) {
      const keyObject = await importJWK({ ...jwk, ext: true }, joseHeader.alg!)

      if (keyObject instanceof Uint8Array || keyObject.type !== 'public') {
        throw new JWKSInvalid('JSON Web Key Set members must be public keys')
      }

      cached[joseHeader.alg!] = keyObject
    }

    return cached[joseHeader.alg!]
  }

  async reload() {
    if (!this._pendingFetch) {
      this._pendingFetch = fetchJwks(this._url, this._timeoutDuration, this._options)
        .then((json) => {
          if (
            typeof json !== 'object' ||
            !json ||
            !Array.isArray(json.keys) ||
            !json.keys.every(isJWKLike)
          ) {
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
