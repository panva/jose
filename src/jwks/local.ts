/**
 * Verification using a JSON Web Key Set (JWKS) available locally
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { importJWK } from '../key/import.js'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.js'
import isObject from '../lib/is_object.js'

function getKtyFromAlg(alg: unknown) {
  switch (typeof alg === 'string' && alg.slice(0, 2)) {
    case 'RS':
    case 'PS':
      return 'RSA'
    case 'ES':
      return 'EC'
    case 'Ed':
      return 'OKP'
    case 'ML':
      return 'AKP'
    default:
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set')
  }
}

interface Cache {
  [alg: string]: types.CryptoKey
}

function isJWKSLike(jwks: unknown): jwks is types.JSONWebKeySet {
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
  return isObject<types.JWK>(key)
}

class LocalJWKSet {
  #jwks: types.JSONWebKeySet

  #cached: WeakMap<types.JWK, Cache> = new WeakMap()

  constructor(jwks: unknown) {
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid('JSON Web Key Set malformed')
    }

    this.#jwks = structuredClone<types.JSONWebKeySet>(jwks)
  }

  jwks(): types.JSONWebKeySet {
    return this.#jwks
  }

  async getKey(
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> {
    const { alg, kid } = { ...protectedHeader, ...token?.header }
    const kty = getKtyFromAlg(alg)

    const candidates = this.#jwks!.keys.filter((jwk) => {
      // filter keys based on the mapping of signature algorithms to Key Type
      let candidate = kty === jwk.kty

      // filter keys based on the JWK Key ID in the header
      if (candidate && typeof kid === 'string') {
        candidate = kid === jwk.kid
      }

      // filter keys based on the key's declared Algorithm
      if (candidate && (typeof jwk.alg === 'string' || kty === 'AKP')) {
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

      // filter out non-applicable curves / sub types
      if (candidate) {
        switch (alg) {
          case 'ES256':
            candidate = jwk.crv === 'P-256'
            break
          case 'ES384':
            candidate = jwk.crv === 'P-384'
            break
          case 'ES512':
            candidate = jwk.crv === 'P-521'
            break
          case 'Ed25519': // Fall through
          case 'EdDSA':
            candidate = jwk.crv === 'Ed25519'
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

      const _cached = this.#cached
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk of candidates) {
          try {
            yield await importWithAlgCache(_cached, jwk, alg!)
          } catch {}
        }
      }

      throw error
    }

    return importWithAlgCache(this.#cached, jwk, alg!)
  }
}

async function importWithAlgCache(cache: WeakMap<types.JWK, Cache>, jwk: types.JWK, alg: string) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk)!
  if (cached[alg] === undefined) {
    const key = await importJWK({ ...jwk, ext: true }, alg)

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
 * > [!NOTE]\
 * > The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwks/local'`.
 *
 * @example
 *
 * ```js
 * const JWKS = jose.createLocalJWKSet({
 *   keys: [
 *     {
 *       kty: 'RSA',
 *       e: 'AQAB',
 *       n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
 *       alg: 'PS256',
 *     },
 *     {
 *       crv: 'P-256',
 *       kty: 'EC',
 *       x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *       y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
 *       alg: 'ES256',
 *     },
 *   ],
 * })
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
 * Opting-in to multiple JWKS matches using `createLocalJWKSet`
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
 * @param jwks JSON Web Key Set formatted object.
 */
export function createLocalJWKSet(
  jwks: types.JSONWebKeySet,
): (
  protectedHeader?: types.JWSHeaderParameters,
  token?: types.FlattenedJWSInput,
) => Promise<types.CryptoKey> {
  const set = new LocalJWKSet(jwks)

  const localJWKSet = async (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> => set.getKey(protectedHeader, token)

  Object.defineProperties(localJWKSet, {
    jwks: {
      value: () => structuredClone(set.jwks()),
      enumerable: false,
      configurable: false,
      writable: false,
    },
  })

  return localJWKSet
}
