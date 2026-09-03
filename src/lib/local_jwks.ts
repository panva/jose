import type * as types from '../types.d.ts'
import {
  JWKSInvalid,
  JOSENotSupported,
  JWKSNoMatchingKey,
  JWKSMultipleMatchingKeys,
} from '../util/errors.js'
import type { LocalJWKSet } from '../jwks/local.js'
import { jwkToKey } from './jwk_to_key.js'
import type { JWSAlgorithm } from './jws_algorithm.js'
import { snapshotJwk } from './jwk_metadata.js'
import { isJwkSet } from './type_checks.js'

interface Cache {
  [alg: string]: types.CryptoKey
}

export type JWSAlgorithmLookup = (alg: string) => JWSAlgorithm | undefined

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
  const cached = cache.get(jwk) || cache.set(jwk, { __proto__: null } as unknown as Cache).get(jwk)!
  const { alg } = entry
  if (cached[alg] === undefined) {
    const key = await jwkToKey(entry, { ...jwk, alg, ext: true })

    if (key.type !== 'public') {
      throw new JWKSInvalid('JSON Web Key Set members must be public keys')
    }

    cached[alg] = key
  }

  return cached[alg]
}

export function createLocalJWKSetWithLookup(
  jwks: types.JSONWebKeySet,
  lookup: JWSAlgorithmLookup,
): LocalJWKSet {
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
    const entry = typeof alg === 'string' ? lookup(alg) : undefined
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
