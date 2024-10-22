import type * as types from '../../types.d.ts'
import { encode as base64url } from '../../lib/base64url.js'
import sign from '../../lib/sign.js'

import isDisjoint from '../../lib/is_disjoint.js'
import { JWSInvalid } from '../../util/errors.js'
import { encoder, decoder, concat } from '../../lib/buffer_utils.js'
import checkKeyType from '../../lib/check_key_type.js'
import validateCrit from '../../lib/validate_crit.js'
import normalizeKey from '../../lib/normalize_key.js'

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
  private _payload: Uint8Array

  private _protectedHeader!: types.JWSHeaderParameters

  private _unprotectedHeader!: types.JWSHeaderParameters

  /** @param payload Binary representation of the payload to sign. */
  constructor(payload: Uint8Array) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError('payload must be an instance of Uint8Array')
    }
    this._payload = payload
  }

  /**
   * Sets the JWS Protected Header on the FlattenedSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    if (this._protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this._protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header on the FlattenedSign object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    if (this._unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    this._unprotectedHeader = unprotectedHeader
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
    if (!this._protectedHeader && !this._unprotectedHeader) {
      throw new JWSInvalid(
        'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
      )
    }

    if (!isDisjoint(this._protectedHeader, this._unprotectedHeader)) {
      throw new JWSInvalid(
        'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      )
    }

    const joseHeader: types.JWSHeaderParameters = {
      ...this._protectedHeader,
      ...this._unprotectedHeader,
    }

    const extensions = validateCrit(
      JWSInvalid,
      new Map([['b64', true]]),
      options?.crit,
      this._protectedHeader,
      joseHeader,
    )

    let b64 = true
    if (extensions.has('b64')) {
      b64 = this._protectedHeader.b64!
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

    let payload = this._payload
    if (b64) {
      payload = encoder.encode(base64url(payload))
    }

    let protectedHeader: Uint8Array
    if (this._protectedHeader) {
      protectedHeader = encoder.encode(base64url(JSON.stringify(this._protectedHeader)))
    } else {
      protectedHeader = encoder.encode('')
    }

    const data = concat(protectedHeader, encoder.encode('.'), payload)

    const k = await normalizeKey(key, alg)
    const signature = await sign(alg, k, data)

    const jws: types.FlattenedJWS = {
      signature: base64url(signature),
      payload: '',
    }

    if (b64) {
      jws.payload = decoder.decode(payload)
    }

    if (this._unprotectedHeader) {
      jws.header = this._unprotectedHeader
    }

    if (this._protectedHeader) {
      jws.protected = decoder.decode(protectedHeader)
    }

    return jws
  }
}
