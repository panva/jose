import type * as types from '../../types.d.ts'
import { FlattenedSign } from '../flattened/sign.js'

/**
 * The CompactSign class is used to build and sign Compact JWS strings.
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
  private _flattened: FlattenedSign

  /** @param payload Binary representation of the payload to sign. */
  constructor(payload: Uint8Array) {
    this._flattened = new FlattenedSign(payload)
  }

  /**
   * Sets the JWS Protected Header on the CompactSign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.CompactJWSHeaderParameters): this {
    this._flattened.setProtectedHeader(protectedHeader)
    return this
  }

  /**
   * Signs and resolves the value of the Compact JWS string.
   *
   * @param key Private Key or Secret to sign the JWS with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWS Sign options.
   */
  async sign(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.SignOptions,
  ): Promise<string> {
    const jws = await this._flattened.sign(key, options)

    if (jws.payload === undefined) {
      throw new TypeError('use the flattened module for creating JWS with b64: false')
    }

    return `${jws.protected}.${jws.payload}.${jws.signature}`
  }
}
