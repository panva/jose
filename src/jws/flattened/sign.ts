/* eslint-disable no-underscore-dangle */

import isDisjoint from '../../lib/is_disjoint.js'
import { JWSInvalid } from '../../util/errors.js'
import { encoder, decoder, concat } from '../../lib/buffer_utils.js'

import { encode as base64url } from '../../runtime/base64url.js'
import sign from '../../runtime/sign.js'
import type { KeyLike, FlattenedJWS, JWSHeaderParameters } from '../../types.d'
import checkKeyType from '../../lib/check_key_type.js'
import validateCrit from '../../lib/validate_crit.js'

const checkExtensions = validateCrit.bind(undefined, JWSInvalid, new Map([['b64', true]]))

/**
 * The FlattenedSign class is a utility for creating Flattened JWS objects.
 *
 * @example
 * ```
 * // ESM import
 * import FlattenedSign from 'jose/jws/flattened/sign'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: FlattenedSign } = require('jose/jws/flattened/sign')
 * ```
 *
 * @example
 * ```
 * // usage
 * import parseJwk from 'jose/jwk/parse'
 *
 * const encoder = new TextEncoder()
 * const privateKey = await parseJwk({
 *   alg: 'ES256',
 *   crv: 'P-256',
 *   kty: 'EC',
 *   d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * })
 *
 * const jws = await new FlattenedSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 * console.log(jws)
 * ```
 */
export default class FlattenedSign {
  private _payload: Uint8Array

  private _protectedHeader!: JWSHeaderParameters

  private _unprotectedHeader!: JWSHeaderParameters

  /**
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    this._payload = payload
  }

  /**
   * Sets the JWS Protected Header on the FlattenedSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: JWSHeaderParameters) {
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
  setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters) {
    if (this._unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    this._unprotectedHeader = unprotectedHeader
    return this
  }

  /**
   * Signs and resolves the value of the Flattened JWS object.
   *
   * @param key Private Key or Secret to sign the JWS with.
   */
  async sign(key: KeyLike): Promise<FlattenedJWS> {
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

    const joseHeader: JWSHeaderParameters = {
      ...this._protectedHeader,
      ...this._unprotectedHeader,
    }

    const extensions = checkExtensions(this._protectedHeader, joseHeader)

    let b64: boolean = true
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

    checkKeyType(alg, key)

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

    const signature = await sign(alg, key, data)

    const jws: FlattenedJWS = {
      signature: base64url(signature),
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

export type { KeyLike, FlattenedJWS, JWSHeaderParameters }
