/** Composable Flattened JWE decryption. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createFlattenedDecryptFunction } from '../../../lib/jwe_serialization.js'
import type {
  ComposedDecryptOptions,
  ComposedFlattenedDecryptResult,
  ComposedJWEHeader,
} from '../types.js'

export type {
  ComposedDecryptOptions,
  ComposedFlattenedDecryptResult,
  ComposedJWEHeader,
} from '../types.js'

/** A Flattened JWE decryptor restricted to the selected algorithms. */
export interface ComposedFlattenedDecryptFunction<
  Factories extends JWEAlgorithmSelection,
> extends types.ConsumeFunction<
  types.FlattenedJWE,
  types.KeyInput,
  types.CryptoKey | Uint8Array,
  ComposedJWEHeader<Factories> | undefined,
  types.FlattenedJWE,
  ComposedDecryptOptions<Factories>,
  ComposedFlattenedDecryptResult<Factories>
> {}

/**
 * Composes a Flattened JWE decryptor from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeFlattenedDecrypt } from 'jose/composable/jwe/flattened/decrypt'
 *
 * const flattenedDecrypt = composeFlattenedDecrypt(dir, A256GCM, A256CBC_HS512)
 * const { plaintext, protectedHeader } = await flattenedDecrypt(jwe, secret)
 * ```
 */
export function composeFlattenedDecrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedFlattenedDecryptFunction<Factories> {
  return createFlattenedDecryptFunction(
    loadJWEAlgorithms(factories),
  ) as ComposedFlattenedDecryptFunction<Factories>
}
