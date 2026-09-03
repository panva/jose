/** Composable Flattened JWS verification. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  JWSResolvedKey,
  SelectedJWSHeaderParameters,
  SelectedJWSVerifyOptions,
  ValidJWSAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../../lib/jws_algorithm.js'
import { createFlattenedVerifyFunction } from '../../../lib/jws_serialization.js'

/** Flattened JWS verification result with header suggestions from the selected algorithms. */
export type FlattenedVerifyResult<Algorithm extends string> = Omit<
  types.FlattenedVerifyResult,
  'protectedHeader' | 'unprotectedHeader'
> & {
  protectedHeader?: SelectedJWSHeaderParameters<Algorithm>
  unprotectedHeader?: SelectedJWSHeaderParameters<Algorithm>
}

/** Callable Flattened JWS verifier restricted at runtime to the selected algorithms. */
export interface FlattenedVerifyFunction<Algorithm extends string> extends types.ConsumeFunction<
  types.FlattenedJWSInput,
  JWSKeyInput<Algorithm>,
  JWSResolvedKey<Algorithm>,
  SelectedJWSHeaderParameters<Algorithm>,
  types.FlattenedJWSInput,
  SelectedJWSVerifyOptions<Algorithm>,
  FlattenedVerifyResult<Algorithm>
> {}

/**
 * Composes a Flattened JWS verifier supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeFlattenedVerify } from 'jose/composable/jws/flattened/verify'
 *
 * const flattenedVerify = composeFlattenedVerify(Ed25519, ES256)
 * const { payload, protectedHeader } = await flattenedVerify(jws, publicKey)
 * ```
 */
export function composeFlattenedVerify<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): FlattenedVerifyFunction<JWSAlgorithmOf<Factories>> {
  return createFlattenedVerifyFunction(loadJWSAlgorithms(algorithms)) as FlattenedVerifyFunction<
    JWSAlgorithmOf<Factories>
  >
}
