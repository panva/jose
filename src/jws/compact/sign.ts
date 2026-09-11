/**
 * Signing JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 *
 * @see {@link https://www.rfc-editor.org/info/rfc7515/#section-7.1 RFC 7515, Section 7.1}
 */

import type * as types from '../../types.d.ts'
import { createCompactSignature } from '../../lib/jws_sign.js'
import { assertNotSet, assertUint8Array } from '../../lib/validate.js'

/**
 * Produces JWS Compact Serialization using a digital signature or MAC.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/compact/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.CompactSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export class CompactSign {
  #payload: Uint8Array

  #protectedHeader!: types.CompactJWSHeaderParameters

  /**
   * Creates a signer for JWS Compact Serialization.
   *
   * @param payload JWS Payload bytes to sign or MAC.
   */
  constructor(payload: Uint8Array) {
    assertUint8Array(payload, 'payload')
    this.#payload = payload
  }

  /**
   * Sets the JWS Protected Header. May only be called once.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.CompactJWSHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Computes the JWS Signature (digital signature or MAC) and returns the JWS Compact
   * Serialization.
   *
   * @param key Private key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  async sign(key: types.KeyInput, options?: types.SignOptions): Promise<string> {
    return createCompactSignature(this.#payload, this.#protectedHeader, options?.crit, key, () => {
      throw new TypeError('use the flattened module for creating JWS with b64: false')
    })
  }
}
