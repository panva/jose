/**
 * Verification using a JSON Web Key Set (JWKS) available locally
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { jwkToKey } from '../lib/jwk_to_key.js'
import { maybeJWSAlgorithm } from '../lib/jws_algorithms.js'
import type { JWSAlgorithm } from '../lib/jws_algorithms.js'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.js'
import { isObject } from '../lib/type_checks.js'

/**
 * A JWKS resolves public keys for verifying signatures, so only JWS algorithms are meaningful here
 *
 * - And among those, only the asymmetric ones.
 */
function signatureAlgorithm(alg: unknown): JWSAlgorithm {
  const entry = typeof alg === 'string' ? maybeJWSAlgorithm(alg) : undefined
  if (!entry || entry.symmetric) {
    throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set')
  }
  return entry
}

interface Cache {
  [alg: string]: types.CryptoKey
}

function isJWKSLike(jwks: unknown): jwks is types.JSONWebKeySet {
  if (!jwks || typeof jwks !== 'object') {
    return false
  }
  const { keys } = jwks as { keys?: unknown }
  return Array.isArray(keys) && keys.every(isJWKLike)
}

function isJWKLike(key: unknown) {
  return isObject<types.JWK>(key)
}

class LocalJWKSetImpl {
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
    const entry = signatureAlgorithm(alg)

    const candidates = this.#jwks!.keys.filter((jwk) => {
      // filter keys based on the mapping of signature algorithms to Key Type
      let candidate = entry.kty.includes(jwk.kty!)

      // filter keys based on the JWK Key ID in the header
      if (candidate && typeof kid === 'string') {
        candidate = kid === jwk.kid
      }

      // filter keys based on the key's declared Algorithm
      if (candidate && (typeof jwk.alg === 'string' || jwk.kty === 'AKP')) {
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
      if (candidate && entry.crv) {
        candidate = jwk.crv === entry.crv
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
            yield await importWithAlgCache(_cached, jwk, entry)
          } catch {}
        }
      }

      throw error
    }

    return importWithAlgCache(this.#cached, jwk, entry)
  }
}

async function importWithAlgCache(
  cache: WeakMap<types.JWK, Cache>,
  jwk: types.JWK,
  entry: JWSAlgorithm,
) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk)!
  if (cached[entry.alg] === undefined) {
    const key = await jwkToKey(entry, { ...jwk, alg: entry.alg, ext: true })

    if (key.type !== 'public') {
      throw new JWKSInvalid('JSON Web Key Set members must be public keys')
    }

    cached[entry.alg] = key
  }

  return cached[entry.alg]
}

/**
 * The key resolution function returned by {@link createLocalJWKSet}.
 *
 * @see {@link jwt/verify.jwtVerify jwtVerify} and the other consuming functions, all of which accept
 *   this directly.
 */
export interface LocalJWKSet {
  (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey>

  /** Returns a structured clone of the JSON Web Key Set this resolver was created with. */
  jwks: () => types.JSONWebKeySet
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
 *     if (error instanceof jose.errors.JWKSMultipleMatchingKeys) {
 *       for await (const publicKey of error) {
 *         try {
 *           return await jose.jwtVerify(jwt, publicKey, options)
 *         } catch (innerError) {
 *           if (innerError instanceof jose.errors.JWSSignatureVerificationFailed) {
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
export function createLocalJWKSet(jwks: types.JSONWebKeySet): LocalJWKSet {
  const set = new LocalJWKSetImpl(jwks)

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

  // Object.defineProperties is used for the property attributes it affords and returns the
  // un-augmented type; LocalJWKSet describes exactly what the block above installs.
  return localJWKSet as LocalJWKSet
}
