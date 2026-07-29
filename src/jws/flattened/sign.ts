/**
 * Signing JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { JWSInvalid } from '../../util/errors.js'
import { createSignature } from '../../lib/jws_sign.js'
import { assertNotSet } from '../../lib/helpers.js'

/**
 * The FlattenedSign class is used to build and sign Flattened JWS objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/flattened/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.FlattenedSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export class FlattenedSign {
  #payload: Uint8Array

  #protectedHeader!: types.JWSHeaderParameters

  #unprotectedHeader!: types.JWSHeaderParameters

  /**
   * {@link FlattenedSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError('payload must be an instance of Uint8Array')
    }
    this.#payload = payload
  }

  /**
   * Sets the JWS Protected Header on the FlattenedSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header on the FlattenedSign object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#unprotectedHeader, 'setUnprotectedHeader')
    this.#unprotectedHeader = unprotectedHeader
    return this
  }

  /**
   * Signs and resolves the value of the Flattened JWS object.
   *
   * @param key Private Key or Secret to sign the JWS with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  async sign(key: types.KeyInput, options?: types.SignOptions): Promise<types.FlattenedJWS> {
    if (!this.#protectedHeader && !this.#unprotectedHeader) {
      throw new JWSInvalid(
        'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
      )
    }

    const jws: types.FlattenedJWS = await createSignature(
      {
        payload: this.#payload,
        protectedHeader: this.#protectedHeader,
        unprotectedHeader: this.#unprotectedHeader,
        crit: options?.crit,
      },
      key,
    )

    if (this.#unprotectedHeader) {
      jws.header = this.#unprotectedHeader
    }

    return jws
  }
}
