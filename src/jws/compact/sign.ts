/**
 * Signing JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { createCompactSignature } from '../../lib/jws_sign.js'
import { assertNotSet } from '../../lib/helpers.js'

/**
 * Builds and signs Compact JWS strings.
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
   * {@link CompactSign} constructor
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
   * Sets the JWS Protected Header on the CompactSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.CompactJWSHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Signs and resolves the value of the Compact JWS string.
   *
   * @param key Private Key or Secret to sign the JWS with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  async sign(key: types.KeyInput, options?: types.SignOptions): Promise<string> {
    return createCompactSignature(this.#payload, this.#protectedHeader, options?.crit, key, () => {
      throw new TypeError('use the flattened module for creating JWS with b64: false')
    })
  }
}
