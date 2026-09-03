/** Composable General JWE decryption. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createGeneralDecryptFunction } from '../../../lib/jwe_serialization.js'
import type {
  ComposedDecryptOptions,
  ComposedGeneralDecryptResult,
  ComposedJWEHeader,
} from '../types.js'

export type {
  ComposedDecryptOptions,
  ComposedGeneralDecryptResult,
  ComposedJWEHeader,
} from '../types.js'

/** A General JWE decryptor restricted to the selected algorithms. */
export interface ComposedGeneralDecryptFunction<
  Factories extends JWEAlgorithmSelection,
> extends types.ConsumeFunction<
  types.GeneralJWE,
  types.KeyInput,
  types.CryptoKey | Uint8Array,
  ComposedJWEHeader<Factories> | undefined,
  types.FlattenedJWE,
  ComposedDecryptOptions<Factories>,
  ComposedGeneralDecryptResult<Factories>
> {}

/**
 * Composes a General JWE decryptor from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeGeneralDecrypt } from 'jose/composable/jwe/general/decrypt'
 *
 * const generalDecrypt = composeGeneralDecrypt(dir, A256GCM, A256CBC_HS512)
 * const { plaintext, protectedHeader } = await generalDecrypt(jwe, secret)
 * ```
 */
export function composeGeneralDecrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedGeneralDecryptFunction<Factories> {
  return createGeneralDecryptFunction(
    loadJWEAlgorithms(factories),
  ) as ComposedGeneralDecryptFunction<Factories>
}
