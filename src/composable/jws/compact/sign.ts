/** Composable Compact JWS signing. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  SelectedCompactJWSHeaderParameters,
  ValidJWSAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../../lib/jws_algorithm.js'
import { createCompactSignClass } from '../../../lib/jws_serialization.js'

/** Interface implemented by a composed CompactSign instance. */
export interface CompactSignInstance<Algorithm extends string>
  extends
    types.SetProtectedHeader<SelectedCompactJWSHeaderParameters<Algorithm>>,
    types.SignWith<JWSKeyInput<Algorithm>, string> {}

/** Constructor returned by {@link composeCompactSign}. */
export interface CompactSignConstructor<Algorithm extends string> extends types.SignConstructor<
  CompactSignInstance<Algorithm>
> {}

/**
 * Composes a CompactSign constructor supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeCompactSign } from 'jose/composable/jws/compact/sign'
 *
 * const CompactSign = composeCompactSign(Ed25519, ES256)
 * const payload = new TextEncoder().encode('It\u2019s a dangerous business, Frodo.')
 * const jws = await new CompactSign(payload)
 *   .setProtectedHeader({ alg: 'Ed25519' })
 *   .sign(privateKey)
 * ```
 */
export function composeCompactSign<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): CompactSignConstructor<JWSAlgorithmOf<Factories>> {
  return createCompactSignClass(loadJWSAlgorithms(algorithms)) as CompactSignConstructor<
    JWSAlgorithmOf<Factories>
  >
}
