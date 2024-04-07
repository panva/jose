import type {
  KeyLike,
  JWSHeaderParameters,
  JWK,
  JSONWebKeySet,
  FlattenedJWSInput,
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

interface Cache<KeyLikeType extends KeyLike = KeyLike> {
  [alg: string]: KeyLikeType
}

function isJWKSLike(jwks: unknown): jwks is JSONWebKeySet {
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

/** @private */
export class LocalJWKSet<KeyLikeType extends KeyLike = KeyLike> {
  protected _jwks?: JSONWebKeySet

  private _cached: WeakMap<JWK, Cache<KeyLikeType>> = new WeakMap()

  constructor(jwks: unknown) {
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid('JSON Web Key Set malformed')
    }

    this._jwks = clone<JSONWebKeySet>(jwks)
  }

  async getKey(
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> {
    const { alg, kid } = { ...protectedHeader, ...token?.header }
    const kty = getKtyFromAlg(alg)

    const candidates = this._jwks!.keys.filter((jwk) => {
      // filter keys based on the mapping of signature algorithms to Key Type
      let candidate = kty === jwk.kty

      // filter keys based on the JWK Key ID in the header
      if (candidate && typeof kid === 'string') {
        candidate = kid === jwk.kid
      }

      // filter keys based on the key's declared Algorithm
      if (candidate && typeof jwk.alg === 'string') {
        candidate = alg === jwk.alg
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
      if (candidate && alg === 'EdDSA') {
        candidate = jwk.crv === 'Ed25519' || jwk.crv === 'Ed448'
      }

      // filter out non-applicable EC curves
      if (candidate) {
        switch (alg) {
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
        }
      }

      return candidate
    })

    const { 0: jwk, length } = candidates

    if (length === 0) {
      throw new JWKSNoMatchingKey()
    }
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys()

      const { _cached } = this
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk of candidates) {
          try {
            yield await importWithAlgCache<KeyLikeType>(_cached, jwk, alg!)
          } catch {}
        }
      }

      throw error
    }

    return importWithAlgCache<KeyLikeType>(this._cached, jwk, alg!)
  }
}

async function importWithAlgCache<KeyLikeType extends KeyLike = KeyLike>(
  cache: WeakMap<JWK, Cache<KeyLikeType>>,
  jwk: JWK,
  alg: string,
) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk)!
  if (cached[alg] === undefined) {
    const key = await importJWK<KeyLikeType>({ ...jwk, ext: true }, alg)

    if (key instanceof Uint8Array || key.type !== 'public') {
      throw new JWKSInvalid('JSON Web Key Set members must be public keys')
    }

    cached[alg] = key
  }

  return cached[alg]
}

/**
 * Returns a function that resolves a JWS JOSE Header to a public key object from a locally stored,
 * or otherwise available, JSON Web Key Set.
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
 * @param jwks JSON Web Key Set formatted object.
 */
export function createLocalJWKSet<KeyLikeType extends KeyLike = KeyLike>(jwks: JSONWebKeySet) {
  const set = new LocalJWKSet<KeyLikeType>(jwks)
  return async (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> => set.getKey(protectedHeader, token)
}
