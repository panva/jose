/** Composable General JWS verification. @module */

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
import { createGeneralVerifyFunction } from '../../../lib/jws_serialization.js'

/** General JWS verification result with header suggestions from the selected algorithms. */
export type GeneralVerifyResult<Algorithm extends string> = Omit<
  types.GeneralVerifyResult,
  'protectedHeader' | 'unprotectedHeader'
> & {
  protectedHeader?: SelectedJWSHeaderParameters<Algorithm>
  unprotectedHeader?: SelectedJWSHeaderParameters<Algorithm>
}

/** Callable General JWS verifier restricted at runtime to the selected algorithms. */
export interface GeneralVerifyFunction<Algorithm extends string> extends types.ConsumeFunction<
  types.GeneralJWSInput,
  JWSKeyInput<Algorithm>,
  JWSResolvedKey<Algorithm>,
  SelectedJWSHeaderParameters<Algorithm>,
  types.FlattenedJWSInput,
  SelectedJWSVerifyOptions<Algorithm>,
  GeneralVerifyResult<Algorithm>
> {}

/**
 * Composes a General JWS verifier supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeGeneralVerify } from 'jose/composable/jws/general/verify'
 *
 * const generalVerify = composeGeneralVerify(Ed25519, ES256)
 * const { payload, protectedHeader } = await generalVerify(jws, (header) =>
 *   header.alg === 'Ed25519' ? ed25519PublicKey : es256PublicKey,
 * )
 * ```
 */
export function composeGeneralVerify<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): GeneralVerifyFunction<JWSAlgorithmOf<Factories>> {
  return createGeneralVerifyFunction(loadJWSAlgorithms(algorithms)) as GeneralVerifyFunction<
    JWSAlgorithmOf<Factories>
  >
}
