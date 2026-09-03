/** Composable Flattened JWE encryption. @module */

import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createFlattenedEncryptClass } from '../../../lib/jwe_serialization.js'
import type { ComposedFlattenedEncryptConstructor, ComposedJWEHeader } from '../types.js'

export type {
  ComposedFlattenedEncrypt,
  ComposedFlattenedEncryptConstructor,
  ComposedJWEHeader,
} from '../types.js'

/**
 * Composes a Flattened JWE encryptor class from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeFlattenedEncrypt } from 'jose/composable/jwe/flattened/encrypt'
 *
 * const FlattenedEncrypt = composeFlattenedEncrypt(dir, A256GCM, A256CBC_HS512)
 * const plaintext = new TextEncoder().encode("It's a secret")
 * const secret = crypto.getRandomValues(new Uint8Array(32))
 *
 * const jwe = await new FlattenedEncrypt(plaintext)
 *   .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
 *   .encrypt(secret)
 * ```
 */
export function composeFlattenedEncrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedFlattenedEncryptConstructor<ComposedJWEHeader<Factories>> {
  return createFlattenedEncryptClass(loadJWEAlgorithms(factories))
}
