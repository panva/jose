/** Composable Flattened JWS signing. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  SelectedJWSHeaderParameters,
  ValidJWSAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../../lib/jws_algorithm.js'
import { createFlattenedSignClass } from '../../../lib/jws_serialization.js'

/** Interface implemented by a composed FlattenedSign instance. */
export interface FlattenedSignInstance<Algorithm extends string>
  extends
    types.SetProtectedHeader<SelectedJWSHeaderParameters<Algorithm>>,
    types.SetUnprotectedHeader<SelectedJWSHeaderParameters<Algorithm>>,
    types.SignWith<JWSKeyInput<Algorithm>, types.FlattenedJWS> {}

/** Constructor returned by {@link composeFlattenedSign}. */
export interface FlattenedSignConstructor<Algorithm extends string> extends types.SignConstructor<
  FlattenedSignInstance<Algorithm>
> {}

/**
 * Composes a FlattenedSign constructor supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeFlattenedSign } from 'jose/composable/jws/flattened/sign'
 *
 * const FlattenedSign = composeFlattenedSign(Ed25519, ES256)
 * const payload = new TextEncoder().encode('It\u2019s a dangerous business, Frodo.')
 * const jws = await new FlattenedSign(payload)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 * ```
 */
export function composeFlattenedSign<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): FlattenedSignConstructor<JWSAlgorithmOf<Factories>> {
  return createFlattenedSignClass(loadJWSAlgorithms(algorithms)) as FlattenedSignConstructor<
    JWSAlgorithmOf<Factories>
  >
}
