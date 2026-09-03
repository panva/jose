/** Composable JWT signing. @module */

import type * as types from '../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  SelectedJWTHeaderParameters,
  ValidJWSAlgorithmSelection,
} from '../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../lib/jws_algorithm.js'
import { createSignJWTClass } from '../../lib/jwt_jws.js'

/** Interface implemented by a composed SignJWT instance. */
export interface SignJWTInstance<Algorithm extends string>
  extends
    types.ProduceJWT,
    types.SetProtectedHeader<SelectedJWTHeaderParameters<Algorithm>>,
    types.SignWith<JWSKeyInput<Algorithm>, string> {}

/** Constructor returned by {@link composeSignJWT}. */
export interface SignJWTConstructor<Algorithm extends string> extends types.JWTConstructor<
  SignJWTInstance<Algorithm>
> {}

/**
 * Composes a SignJWT constructor supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeSignJWT } from 'jose/composable/jwt/sign'
 *
 * const SignJWT = composeSignJWT(Ed25519, ES256)
 * const jwt = await new SignJWT({ sub: 'urn:example:subject' })
 *   .setProtectedHeader({ alg: 'Ed25519' })
 *   .sign(privateKey)
 * ```
 */
export function composeSignJWT<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): SignJWTConstructor<JWSAlgorithmOf<Factories>> {
  return createSignJWTClass(loadJWSAlgorithms(algorithms)) as SignJWTConstructor<
    JWSAlgorithmOf<Factories>
  >
}
