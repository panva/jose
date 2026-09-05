/**
 * Signing JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { createSignature } from '../../lib/jws_sign.js'
import type { SignInput } from '../../lib/jws_sign.js'
import { assertNotSet, assertUint8Array } from '../../lib/validate.js'

/**
 * Builds and signs Flattened JWS objects.
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
  #input: SignInput

  /**
   * {@link FlattenedSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    assertUint8Array(payload, 'payload')
    this.#input = [payload]
  }

  /**
   * Sets the JWS Protected Header on the FlattenedSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#input[1], 'setProtectedHeader')
    this.#input[1] = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header on the FlattenedSign object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#input[2], 'setUnprotectedHeader')
    this.#input[2] = unprotectedHeader
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
    const input: SignInput = [...this.#input]
    input[3] = options?.crit
    const [jws] = await createSignature(input, key)
    return jws
  }
}
