/**
 * Signing JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 *
 * @see {@link https://www.rfc-editor.org/info/rfc7515/#section-7.2.2 RFC 7515, Section 7.2.2}
 */

import type * as types from '../../types.d.ts'
import { createSignature } from '../../lib/jws_sign.js'
import type { SignInput } from '../../lib/jws_sign.js'
import { assertNotSet, assertUint8Array } from '../../lib/validate.js'

/**
 * Produces flattened JWS JSON Serialization using a digital signature or MAC.
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
   * Creates a signer for flattened JWS JSON Serialization.
   *
   * @param payload JWS Payload bytes to sign or MAC.
   */
  constructor(payload: Uint8Array) {
    assertUint8Array(payload, 'payload')
    this.#input = [payload]
  }

  /**
   * Sets the JWS Protected Header. May only be called once.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#input[1], 'setProtectedHeader')
    this.#input[1] = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header. May only be called once.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#input[2], 'setUnprotectedHeader')
    this.#input[2] = unprotectedHeader
    return this
  }

  /**
   * Computes the JWS Signature (digital signature or MAC) and returns the flattened JWS JSON
   * Serialization.
   *
   * @param key Private key or shared secret. See
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
