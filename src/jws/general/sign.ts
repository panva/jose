/**
 * Signing JSON Web Signature (JWS) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { createSignature } from '../../lib/jws_sign.js'
import type { SignInput } from '../../lib/jws_sign.js'
import { JWSInvalid } from '../../util/errors.js'
import { assertNotSet } from '../../lib/helpers.js'

/** Used to build General JWS object's individual signatures. */
export interface Signature {
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

  /**
   * A shorthand for calling {@link GeneralSign.sign sign()} on the enclosing {@link GeneralSign}
   * instance. Takes no arguments — each signature's key is supplied to {@link addSignature}.
   */
  sign(): Promise<types.GeneralJWS>

  /** Returns the enclosing {@link GeneralSign} instance */
  done(): GeneralSign
}

type SignatureState = [
  protectedHeader: types.JWSHeaderParameters | undefined,
  unprotectedHeader: types.JWSHeaderParameters | undefined,
  key: types.KeyInput,
  crit: types.SignOptions['crit'],
]

class IndividualSignature implements Signature {
  #parent: GeneralSign

  state: SignatureState

  constructor(sig: GeneralSign, key: types.KeyInput, options?: types.SignOptions) {
    this.#parent = sig
    this.state = [undefined, undefined, key, options?.crit]
  }

  setProtectedHeader(protectedHeader: types.JWSHeaderParameters) {
    assertNotSet(this.state[0], 'setProtectedHeader')
    this.state[0] = protectedHeader
    return this
  }

  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters) {
    assertNotSet(this.state[1], 'setUnprotectedHeader')
    this.state[1] = unprotectedHeader
    return this
  }

  addSignature(...args: Parameters<GeneralSign['addSignature']>) {
    return this.#parent.addSignature(...args)
  }

  sign(...args: Parameters<GeneralSign['sign']>) {
    return this.#parent.sign(...args)
  }

  done() {
    return this.#parent
  }
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
export class GeneralSign {
  #payload: Uint8Array

  #signatures: IndividualSignature[] = []

  /**
   * {@link GeneralSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    this.#payload = payload
  }

  /**
   * Adds an additional signature for the General JWS object.
   *
   * @param key Private Key or Secret to sign the individual JWS signature with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  addSignature(key: types.KeyInput, options?: types.SignOptions): Signature {
    const signature = new IndividualSignature(this, key, options)
    this.#signatures.push(signature)
    return signature
  }

  /** Signs and resolves the value of the General JWS object. */
  async sign(): Promise<types.GeneralJWS> {
    if (!this.#signatures.length) {
      throw new JWSInvalid('at least one signature must be added')
    }

    if (!(this.#payload instanceof Uint8Array)) {
      throw new TypeError('payload must be an instance of Uint8Array')
    }

    const jws: types.GeneralJWS = {
      signatures: [],
      payload: '',
    }

    const encoded: NonNullable<SignInput['encoded']> = []

    for (let i = 0; i < this.#signatures.length; i++) {
      const signature = this.#signatures[i]
      const [protectedHeader, unprotectedHeader, key, crit] = signature.state

      const { payload, ...rest } = await createSignature(
        {
          payload: this.#payload,
          protectedHeader,
          unprotectedHeader,
          crit,
          encoded,
        },
        key,
      )

      if (i === 0) {
        jws.payload = payload
      } else if (jws.payload !== payload) {
        throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
      }
      jws.signatures.push(rest)
    }

    return jws
  }
}
