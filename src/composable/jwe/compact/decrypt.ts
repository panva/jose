/** Composable Compact JWE decryption. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWEAlgorithmSelection,
  ValidJWEAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../../lib/jwe_algorithm.js'
import { createCompactDecryptFunction } from '../../../lib/jwe_serialization.js'
import type {
  ComposedCompactDecryptResult,
  ComposedCompactJWEHeader,
  ComposedDecryptOptions,
} from '../types.js'

export type {
  ComposedCompactDecryptResult,
  ComposedCompactJWEHeader,
  ComposedDecryptOptions,
} from '../types.js'

/** A Compact JWE decryptor restricted to the selected algorithms. */
export interface ComposedCompactDecryptFunction<
  Factories extends JWEAlgorithmSelection,
> extends types.ConsumeFunction<
  string | Uint8Array,
  types.KeyInput,
  types.CryptoKey | Uint8Array,
  ComposedCompactJWEHeader<Factories>,
  types.FlattenedJWE,
  ComposedDecryptOptions<Factories>,
  ComposedCompactDecryptResult<Factories>
> {}

/**
 * Composes a Compact JWE decryptor from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeCompactDecrypt } from 'jose/composable/jwe/compact/decrypt'
 *
 * const compactDecrypt = composeCompactDecrypt(dir, A256GCM, A256CBC_HS512)
 * const { plaintext, protectedHeader } = await compactDecrypt(jwe, secret)
 * ```
 */
export function composeCompactDecrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedCompactDecryptFunction<Factories> {
  return createCompactDecryptFunction(
    loadJWEAlgorithms(factories),
  ) as unknown as ComposedCompactDecryptFunction<Factories>
}
