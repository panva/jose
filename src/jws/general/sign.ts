/**
 * Signing JSON Web Signature (JWS) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  GeneralSignConstructor,
  GeneralSignature,
  GeneralSignInstance,
} from '../../composable/jws/general/sign.js'
import { jwsAlgorithm } from '../../lib/jws_algorithms.js'
import { createGeneralSignClass } from '../../lib/jws_serialization.js'

/** Used to build General JWS object's individual signatures. */
export interface Signature extends Omit<
  GeneralSignature<types.JWSAlgorithm>,
  'setProtectedHeader' | 'setUnprotectedHeader' | 'addSignature' | 'done'
> {
  /**
   * Sets the JWS Protected Header on the Signature object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): Signature

  /**
   * Sets the JWS Unprotected Header on the Signature object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): Signature

  /**
   * A shorthand for calling {@link GeneralSign.addSignature addSignature()} on the enclosing
   * {@link GeneralSign} instance.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(key: types.KeyInput, options?: types.SignOptions): Signature

  /** Returns the enclosing {@link GeneralSign} instance */
  done(): GeneralSign
}

const GeneralSignBase: GeneralSignConstructor<types.JWSAlgorithm> =
  createGeneralSignClass(jwsAlgorithm)

export interface GeneralSign extends GeneralSignInstance<types.JWSAlgorithm> {
  /**
   * Adds an additional signature for the General JWS object.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(key: types.KeyInput, options?: types.SignOptions): Signature
}

/**
 * The GeneralSign class is used to build and sign General JWS objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/general/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.GeneralSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .addSignature(ecPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .addSignature(rsaPrivateKey)
 *   .setProtectedHeader({ alg: 'PS256' })
 *   .sign()
 *
 * console.log(jws)
 * ```
 */
export class GeneralSign extends GeneralSignBase {
  declare private generalSignBrand: never

  /**
   * {@link GeneralSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    super(payload)
  }
}
