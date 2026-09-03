/** Composable General JWE encryption. @module */

import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createGeneralEncryptClass } from '../../../lib/jwe_serialization.js'
import type { ComposedGeneralEncryptConstructor, ComposedJWEHeader } from '../types.js'

export type {
  ComposedGeneralEncrypt,
  ComposedGeneralEncryptConstructor,
  ComposedGeneralEncryptRecipient,
  ComposedJWEHeader,
} from '../types.js'

/**
 * Composes a General JWE encryptor class from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeGeneralEncrypt } from 'jose/composable/jwe/general/encrypt'
 *
 * const GeneralEncrypt = composeGeneralEncrypt(dir, A256GCM, A256CBC_HS512)
 * const plaintext = new TextEncoder().encode("It's a secret")
 * const secret = crypto.getRandomValues(new Uint8Array(32))
 *
 * const jwe = await new GeneralEncrypt(plaintext)
 *   .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
 *   .addRecipient(secret)
 *   .encrypt()
 * ```
 */
export function composeGeneralEncrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedGeneralEncryptConstructor<ComposedJWEHeader<Factories>> {
  return createGeneralEncryptClass(loadJWEAlgorithms(factories))
}
