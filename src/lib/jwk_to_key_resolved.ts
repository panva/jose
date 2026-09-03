import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'
import { jwkToKey } from './jwk_to_key.js'

/** Imports a JWK after resolving key-dependent WebCrypto parameters. */
export function resolvedJwkToKey(entry: KeyDescriptor, jwk: types.JWK): Promise<types.CryptoKey> {
  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle
  return jwkToKey(entry, jwk, algorithm)
}
