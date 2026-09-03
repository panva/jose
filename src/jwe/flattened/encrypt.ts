/**
 * Encrypting JSON Web Encryption (JWE) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  ComposedFlattenedEncrypt,
  ComposedFlattenedEncryptConstructor,
} from '../../composable/jwe/types.js'
import { allJWEAlgorithms } from '../../lib/jwe_algorithms.js'
import { createFlattenedEncryptClass } from '../../lib/jwe_serialization.js'

export interface FlattenedEncrypt extends ComposedFlattenedEncrypt<types.JWEHeaderParameters> {}

const FlattenedEncryptBase: ComposedFlattenedEncryptConstructor<types.JWEHeaderParameters> =
  createFlattenedEncryptClass(allJWEAlgorithms)

/**
 * The FlattenedEncrypt class is used to build and encrypt Flattened JWE objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwe/flattened/encrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = await new jose.FlattenedEncrypt(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .setAdditionalAuthenticatedData(new TextEncoder().encode('The Fellowship of the Ring'))
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export class FlattenedEncrypt extends FlattenedEncryptBase {
  declare private flattenedEncryptBrand: never

  /**
   * {@link FlattenedEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    super(plaintext)
  }
}
