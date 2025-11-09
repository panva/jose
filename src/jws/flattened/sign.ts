/**
 * Signing JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { encode as b64u } from '../../util/base64url.js'
import { sign } from '../../lib/sign.js'

import { isDisjoint } from '../../lib/is_disjoint.js'
import { JWSInvalid } from '../../util/errors.js'
import { concat, encode } from '../../lib/buffer_utils.js'
import { checkKeyType } from '../../lib/check_key_type.js'
import { validateCrit } from '../../lib/validate_crit.js'
import { normalizeKey } from '../../lib/normalize_key.js'

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
    if (this.#protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header on the FlattenedSign object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    if (this.#unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
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
  async sign(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.SignOptions,
  ): Promise<types.FlattenedJWS> {
    if (!this.#protectedHeader && !this.#unprotectedHeader) {
      throw new JWSInvalid(
        'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
      )
    }

    if (!isDisjoint(this.#protectedHeader, this.#unprotectedHeader)) {
      throw new JWSInvalid(
        'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      )
    }

    const joseHeader: types.JWSHeaderParameters = {
      ...this.#protectedHeader,
      ...this.#unprotectedHeader,
    }

    const extensions = validateCrit(
      JWSInvalid,
      new Map([['b64', true]]),
      options?.crit,
      this.#protectedHeader,
      joseHeader,
    )

    let b64 = true
    if (extensions.has('b64')) {
      b64 = this.#protectedHeader.b64!
      if (typeof b64 !== 'boolean') {
        throw new JWSInvalid(
          'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
        )
      }
    }

    const { alg } = joseHeader

    if (typeof alg !== 'string' || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
    }

    checkKeyType(alg, key, 'sign')

    let payloadS: string
    let payloadB: Uint8Array
    if (b64) {
      payloadS = b64u(this.#payload)
      payloadB = encode(payloadS)
    } else {
      payloadB = this.#payload
      payloadS = ''
    }

    let protectedHeaderString: string
    let protectedHeaderBytes: Uint8Array
    if (this.#protectedHeader) {
      protectedHeaderString = b64u(JSON.stringify(this.#protectedHeader))
      protectedHeaderBytes = encode(protectedHeaderString)
    } else {
      protectedHeaderString = ''
      protectedHeaderBytes = new Uint8Array()
    }

    const data = concat(protectedHeaderBytes, encode('.'), payloadB)

    const k = await normalizeKey(key, alg)
    const signature = await sign(alg, k, data)

    const jws: types.FlattenedJWS = {
      signature: b64u(signature),
      payload: payloadS,
    }

    if (this.#unprotectedHeader) {
      jws.header = this.#unprotectedHeader
    }

    if (this.#protectedHeader) {
      jws.protected = protectedHeaderString
    }

    return jws
  }
}
