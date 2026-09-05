/**
 * Verification using a JSON Web Key Set (JWKS) available locally
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { jwkToKey, snapshotJwk } from '../lib/key.js'
import { JWS } from '../lib/jws_algorithms.js'
import type { JWSAlgorithm } from '../lib/jws_algorithms.js'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.js'
import { isJwkSet } from '../lib/validate.js'

interface Cache {
  [alg: string]: types.CryptoKey
}

function isUsableJWK(jwk: types.JWK, entry: JWSAlgorithm, alg: string, kid: unknown): boolean {
  const { kty, key_ops, ext, kid: jwkKid, alg: jwkAlg, use, crv } = snapshotJwk(jwk)
  const keyOps = Array.isArray(key_ops) ? [...key_ops] : key_ops

  return (
    (ext === undefined || typeof ext === 'boolean') &&
    (keyOps === undefined ||
      (Array.isArray(keyOps) &&
        keyOps.every(
          (operation, index) =>
            typeof operation === 'string' && keyOps.indexOf(operation) === index,
        ) &&
        keyOps.includes('verify'))) &&
    entry.kty.includes(kty!) &&
    (kid === undefined || (typeof kid === 'string' && kid === jwkKid)) &&
    (jwkAlg === undefined ? kty !== 'AKP' : alg === jwkAlg) &&
    (use === undefined || use === 'sig') &&
    (!entry.crv || crv === entry.crv)
  )
}

async function importWithAlgCache(
  cache: WeakMap<types.JWK, Cache>,
  jwk: types.JWK,
  entry: JWSAlgorithm,
) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk)!
  const { alg } = entry
  if (cached[alg] === undefined) {
    const key = await jwkToKey(entry, jwk, true)

    if (key.type !== 'public') {
      throw new JWKSInvalid('JSON Web Key Set members must be public keys')
    }

    cached[alg] = key
  }

  return cached[alg]
}

/**
 * A key resolver created by {@link createLocalJWKSet}.
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
 * Creates a resolver for a locally available JSON Web Key Set.
 *
 * Selection uses the header's "alg" (Algorithm) and "kid" (Key ID), and respects the JWK's "use"
 * (Public Key Use) and "key_ops" (Key Operations). Exactly one key must match.
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
  let snapshot: unknown
  try {
    snapshot = structuredClone(jwks)
  } catch {}

  if (!isJwkSet(snapshot)) {
    throw new JWKSInvalid('JSON Web Key Set malformed')
  }

  const cached = new WeakMap<types.JWK, Cache>()

  const localJWKSet = async (
    protectedHeader?: types.JWSHeaderParameters,
    token?: types.FlattenedJWSInput,
  ): Promise<types.CryptoKey> => {
    const { alg, kid } = { ...protectedHeader, ...token?.header }
    const entry = typeof alg === 'string' ? JWS[alg] : undefined
    if (!entry || entry.secret) {
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set')
    }

    const candidates = snapshot.keys.filter((jwk) => isUsableJWK(jwk, entry, alg!, kid))
    const { 0: jwk, length } = candidates

    if (!length) {
      throw new JWKSNoMatchingKey()
    }
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys()
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk of candidates) {
          try {
            yield await importWithAlgCache(cached, jwk, entry)
          } catch {}
        }
      }
      throw error
    }

    return importWithAlgCache(cached, jwk, entry)
  }

  // Object.defineProperty is used for the property attributes it affords and returns the
  // un-augmented type; LocalJWKSet describes exactly what the block below installs.
  return Object.defineProperty(localJWKSet, 'jwks', {
    value: () => structuredClone(snapshot),
  }) as LocalJWKSet
}
