/** Composable General JWS signing. @module */

import type * as types from '../../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  SelectedJWSHeaderParameters,
  ValidJWSAlgorithmSelection,
} from '../../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../../lib/jws_algorithm.js'
import { createGeneralSignClass } from '../../../lib/jws_serialization.js'

/** Used to build a General JWS object's individual signatures. */
export interface GeneralSignature<Algorithm extends string>
  extends
    types.SetProtectedHeader<SelectedJWSHeaderParameters<Algorithm>>,
    types.SetUnprotectedHeader<SelectedJWSHeaderParameters<Algorithm>> {
  /**
   * A shorthand for calling {@link GeneralSignInstance.addSignature addSignature()} on the enclosing
   * GeneralSign instance.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(
    key: JWSKeyInput<Algorithm>,
    options?: types.SignOptions,
  ): GeneralSignature<Algorithm>

  /**
   * A shorthand for calling `sign()` on the enclosing `GeneralSign` instance. Takes no arguments —
   * each signature's key is supplied to `addSignature()`.
   */
  sign(): Promise<types.GeneralJWS>

  /** Returns the enclosing GeneralSign instance. */
  done(): GeneralSignInstance<Algorithm>
}

/** Interface implemented by a composed GeneralSign instance. */
export interface GeneralSignInstance<Algorithm extends string> {
  /**
   * Adds an additional signature for the General JWS object.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(
    key: JWSKeyInput<Algorithm>,
    options?: types.SignOptions,
  ): GeneralSignature<Algorithm>

  /** Signs and resolves the value of the General JWS object. */
  sign(): Promise<types.GeneralJWS>
}

/** Constructor returned by {@link composeGeneralSign}. */
export interface GeneralSignConstructor<Algorithm extends string> extends types.SignConstructor<
  GeneralSignInstance<Algorithm>
> {}

/**
 * Composes a GeneralSign constructor supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeGeneralSign } from 'jose/composable/jws/general/sign'
 *
 * const GeneralSign = composeGeneralSign(Ed25519, ES256)
 * const payload = new TextEncoder().encode('It\u2019s a dangerous business, Frodo.')
 * const jws = await new GeneralSign(payload)
 *   .addSignature(ed25519PrivateKey)
 *   .setProtectedHeader({ alg: 'Ed25519' })
 *   .addSignature(es256PrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign()
 * ```
 */
export function composeGeneralSign<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): GeneralSignConstructor<JWSAlgorithmOf<Factories>> {
  return createGeneralSignClass(loadJWSAlgorithms(algorithms)) as GeneralSignConstructor<
    JWSAlgorithmOf<Factories>
  >
}
