import type {
  KeyLike,
  JWSHeaderParameters,
  JWK,
  JSONWebKeySet,
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
  switch (typeof alg === 'string' && alg.slice(0, 2)) {
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
 * @private
 */
export function isJWKSLike(jwks: unknown): jwks is JSONWebKeySet {
  return (
    jwks &&
    typeof jwks === 'object' &&
    // @ts-expect-error
    Array.isArray(jwks.keys) &&
    // @ts-expect-error
    jwks.keys.every(isJWKLike)
  )
}

function isJWKLike(key: unknown) {
  return isObject<JWK>(key)
}

function clone<T>(obj: T): T {
  // @ts-ignore
  if (typeof structuredClone === 'function') {
    // @ts-ignore
    return structuredClone(obj)
  }

  return JSON.parse(JSON.stringify(obj))
}

/**
 * @private
 */
export class LocalJWKSet {
  protected _jwks?: JSONWebKeySet

  private _cached: WeakMap<JWK, Cache> = new WeakMap()

  constructor(jwks: unknown) {
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid('JSON Web Key Set malformed')
    }

    this._jwks = clone<JSONWebKeySet>(jwks)
  }

  async getKey(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<KeyLike> {
    const joseHeader = {
      ...protectedHeader,
      ...token.header,
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
}

/**
 * Returns a function that resolves to a key object from a locally
 * stored, or otherwise available, JSON Web Key Set.
 *
 * Only a single public key must match the selection process.
 *
 * @param jwks JSON Web Key Set formatted object.
 *
 * @example Usage
 * ```js
 * const JWKS = jose.createLocalJWKSet({
 *   keys: [
 *     {
 *       kty: 'RSA',
 *       e: 'AQAB',
 *       n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
 *       alg: 'PS256'
 *     },
 *     {
 *       crv: 'P-256',
 *       kty: 'EC',
 *       x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *       y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
 *       alg: 'ES256'
 *     }
 *   ]
 * })
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export function createLocalJWKSet(
  jwks: JSONWebKeySet,
): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
  return LocalJWKSet.prototype.getKey.bind(new LocalJWKSet(jwks))
}
