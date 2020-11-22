import type { KeyObject } from 'crypto'
import type { Agent as HttpAgent } from 'http'
import type { Agent as HttpsAgent } from 'https'

import type { JWSHeaderParameters, JWK, FlattenedJWSInput, GetKeyFunction } from '../types.d'
import parseJWK from '../jwk/parse.js'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.js'
import fetchJson from '../runtime/fetch.js'

function getKtyFromAlg(alg: string) {
  switch (alg.substr(0, 2)) {
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
  [alg: string]: KeyObject | CryptoKey
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
   * An instance of http.Agent or https.Agent to pass to the http.get or
   * https.get method options. Use when behind an http(s) proxy.
   * This is a Node.js runtime specific option, it is ignored
   * when used outside of Node.js runtime.
   */
  agent?: HttpAgent | HttpsAgent
}

class RemoteJWKSet {
  private _url: URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cooldownStarted?: number

  private _jwks?: { keys: JWK[] }

  private _cached: WeakMap<JWK, Cache> = new WeakMap()

  private _pendingFetch?: ReturnType<typeof fetchJson>

  private _options: Pick<RemoteJWKSetOptions, 'agent'>

  constructor(url: URL, options?: RemoteJWKSetOptions) {
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
    if (typeof this._cooldownStarted === 'undefined') {
      return false
    }

    return Date.now() < this._cooldownStarted + this._cooldownDuration
  }

  async getKey(protectedHeader: JWSHeaderParameters): Promise<KeyObject | CryptoKey> {
    if (!this._jwks) {
      await this.reload()
    }

    const candidates = this._jwks!.keys.filter((jwk) => {
      // filter keys based on the mapping of signature algorithms to Key Type
      let candidate = jwk.kty === getKtyFromAlg(protectedHeader.alg!)

      // filter keys based on the JWK Key ID in the header
      if (candidate && typeof protectedHeader.kid === 'string') {
        candidate = protectedHeader.kid === jwk.kid
      }

      // filter keys based on the key's declared Algorithm
      if (candidate && typeof jwk.alg === 'string') {
        candidate = protectedHeader.alg! === jwk.alg
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
      if (candidate && protectedHeader.alg! === 'EdDSA') {
        candidate = ['Ed25519', 'Ed448'].includes(jwk.crv!)
      }

      // filter out non-applicable EC curves
      if (candidate) {
        switch (protectedHeader.alg!) {
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
        return this.getKey(protectedHeader)
      }
      throw new JWKSNoMatchingKey()
    } else if (length !== 1) {
      throw new JWKSMultipleMatchingKeys()
    }

    if (!this._cached.has(jwk)) {
      this._cached.set(jwk, {})
    }

    const cached = this._cached.get(jwk)!
    if (cached[protectedHeader.alg!] === undefined) {
      const keyObject = (await parseJWK({ ...jwk, alg: protectedHeader.alg! })) as
        | KeyObject
        | CryptoKey

      if (keyObject.type !== 'public') {
        throw new JWKSInvalid('JSON Web Key Set members must be public keys')
      }

      cached[protectedHeader.alg!] = keyObject
    }

    return cached[protectedHeader.alg!]
  }

  async reload() {
    if (!this._pendingFetch) {
      this._pendingFetch = fetchJson(this._url, this._timeoutDuration, this._options)
        .then((json: { keys: object[] }) => {
          if (
            typeof json !== 'object' ||
            !json ||
            !Array.isArray(json.keys) ||
            json.keys.some((key: object) => typeof key !== 'object' || !key)
          ) {
            throw new JWKSInvalid('JSON Web Key Set malformed')
          }
          this._jwks = json
          this._cooldownStarted = Date.now()
          this._pendingFetch = undefined
        })
        .catch((err) => {
          this._pendingFetch = undefined
          throw err
        })
    }

    await this._pendingFetch
  }
}

/**
 * Returns a function that resolves to a key object downloaded from a
 * remote endpoint returning a JSON Web Key Set, that is, for example,
 * an OAuth 2.0 or OIDC jwks_uri. Only a single public key must match
 * the selection process.
 *
 * @example
 * ```
 * // ESM import
 * import createRemoteJWKSet from 'jose/jwks/remote'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: createRemoteJWKSet } = require('jose/jwks/remote')
 * ```
 *
 * @example
 * ```
 * // usage
 * import jwtVerify from 'jose/jwt/verify'
 *
 * const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
 *
 * const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export default function createRemoteJWKSet(
  url: URL,
  options?: RemoteJWKSetOptions,
): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
  const set = new RemoteJWKSet(url, options)
  return set.getKey.bind(set)
}
