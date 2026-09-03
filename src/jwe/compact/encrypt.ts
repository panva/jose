/**
 * Encrypting JSON Web Encryption (JWE) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  ComposedCompactEncrypt,
  ComposedCompactEncryptConstructor,
} from '../../composable/jwe/types.js'
import { allJWEAlgorithms } from '../../lib/jwe_algorithms.js'
import { createCompactEncryptClass } from '../../lib/jwe_serialization.js'

export interface CompactEncrypt extends ComposedCompactEncrypt<types.CompactJWEHeaderParameters> {}

const CompactEncryptBase: ComposedCompactEncryptConstructor<types.CompactJWEHeaderParameters> =
  createCompactEncryptClass(allJWEAlgorithms)

/**
 * The CompactEncrypt class is used to build and encrypt Compact JWE strings.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwe/compact/encrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = await new jose.CompactEncrypt(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export class CompactEncrypt extends CompactEncryptBase {
  declare private compactEncryptBrand: never

  /**
   * {@link CompactEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    super(plaintext)
  }
}
