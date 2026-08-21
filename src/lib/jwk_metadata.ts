import type * as types from '../types.d.ts'

/** Snapshots a JWK into data properties. */
export function snapshotJwk(jwk: types.JWK): types.JWK {
  return { __proto__: null, ...jwk } as unknown as types.JWK
}

/** Snapshots a JWK and validates the metadata Web Crypto consumes. */
export function normalizeJwk(jwk: types.JWK): types.JWK {
  const normalized = snapshotJwk(jwk)

  if (normalized.ext !== undefined && typeof normalized.ext !== 'boolean') {
    throw new TypeError('"ext" (Extractable) Parameter must be a boolean')
  }

  if (normalized.key_ops !== undefined) {
    const value = normalized.key_ops
    const keyOps = Array.isArray(value) ? [...value] : undefined
    if (
      !keyOps ||
      keyOps.some((operation) => typeof operation !== 'string') ||
      new Set(keyOps).size !== keyOps.length
    ) {
      throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings')
    }
    normalized.key_ops = keyOps
  }

  return normalized
}
