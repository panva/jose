import type { JWK, KeyLike } from '../types.d'
import { encode as base64url } from '../runtime/base64url.js'
import asJWK from '../runtime/key_to_jwk.js'

/**
 * Converts a runtime-specific key representation (KeyLike) to a JWK.
 *
 * @param key Key representation to transform to a JWK.
 *
 * @example
 * ```
 * // ESM import
 * import fromKeyLike from 'jose/jwk/from_key_like'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: fromKeyLike } = require('jose/jwk/from_key_like')
 * ```
 *
 * @example
 * ```
 * // usage
 * const privateJwk = fromKeyLike(privateKey)
 * const publicJwk = fromKeyLike(publicKey)
 *
 * console.log(privateJwk)
 * console.log(publicJwk)
 * ```
 */
export default async function fromKeyLike(key: KeyLike): Promise<JWK> {
  if (key instanceof Uint8Array) {
    return {
      kty: 'oct',
      k: base64url(key),
    }
  }

  return asJWK(key)
}

export type { KeyLike, JWK }
