/** Composable Compact JWE encryption. @module */

import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createCompactEncryptClass } from '../../../lib/jwe_serialization.js'
import type { ComposedCompactEncryptConstructor, ComposedCompactJWEHeader } from '../types.js'

export type {
  ComposedCompactEncrypt,
  ComposedCompactEncryptConstructor,
  ComposedCompactJWEHeader,
} from '../types.js'

/**
 * Composes a Compact JWE encryptor class from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeCompactEncrypt } from 'jose/composable/jwe/compact/encrypt'
 *
 * const CompactEncrypt = composeCompactEncrypt(dir, A256GCM, A256CBC_HS512)
 * const plaintext = new TextEncoder().encode("It's a secret")
 * const secret = crypto.getRandomValues(new Uint8Array(32))
 *
 * const jwe = await new CompactEncrypt(plaintext)
 *   .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
 *   .encrypt(secret)
 * ```
 */
export function composeCompactEncrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedCompactEncryptConstructor<ComposedCompactJWEHeader<Factories>> {
  return createCompactEncryptClass(
    loadJWEAlgorithms(factories),
  ) as unknown as ComposedCompactEncryptConstructor<ComposedCompactJWEHeader<Factories>>
}
