/** Composable Compact JWS verification. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  JWSResolvedKey,
  SelectedCompactJWSHeaderParameters,
  SelectedJWSVerifyOptions,
  ValidJWSAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../../lib/jws_algorithm.js'
import { createCompactVerifyFunction } from '../../../lib/jws_serialization.js'

/** Compact JWS verification result with header suggestions from the selected algorithms. */
export type CompactVerifyResult<Algorithm extends string> = Omit<
  types.CompactVerifyResult,
  'protectedHeader'
> & {
  protectedHeader: SelectedCompactJWSHeaderParameters<Algorithm>
}

/** Callable Compact JWS verifier restricted at runtime to the selected algorithms. */
export interface CompactVerifyFunction<Algorithm extends string> extends types.ConsumeFunction<
  string | Uint8Array,
  JWSKeyInput<Algorithm>,
  JWSResolvedKey<Algorithm>,
  SelectedCompactJWSHeaderParameters<Algorithm>,
  types.FlattenedJWSInput,
  SelectedJWSVerifyOptions<Algorithm>,
  CompactVerifyResult<Algorithm>
> {}

/**
 * Composes a Compact JWS verifier supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeCompactVerify } from 'jose/composable/jws/compact/verify'
 *
 * const compactVerify = composeCompactVerify(Ed25519, ES256)
 * const { payload, protectedHeader } = await compactVerify(jws, publicKey)
 * ```
 */
export function composeCompactVerify<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): CompactVerifyFunction<JWSAlgorithmOf<Factories>> {
  return createCompactVerifyFunction(loadJWSAlgorithms(algorithms)) as CompactVerifyFunction<
    JWSAlgorithmOf<Factories>
  >
}
