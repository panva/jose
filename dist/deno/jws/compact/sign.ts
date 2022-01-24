import { FlattenedSign } from '../flattened/sign.ts'
import type { CompactJWSHeaderParameters, KeyLike, SignOptions } from '../../types.d.ts'

/**
 * The CompactSign class is a utility for creating Compact JWS strings.
 *
 * @example Usage
 * ```js
 * const jws = await new jose.CompactSign(
 *   new TextEncoder().encode(
 *     'It’s a dangerous business, Frodo, going out your door.'
 *   )
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export class CompactSign {
  private _flattened: FlattenedSign

  /**
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    this._flattened = new FlattenedSign(payload)
  }

  /**
   * Sets the JWS Protected Header on the Sign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: CompactJWSHeaderParameters) {
    this._flattened.setProtectedHeader(protectedHeader)
    return this
  }

  /**
   * Signs and resolves the value of the Compact JWS string.
   *
   * @param key Private Key or Secret to sign the JWS with.
   * @param options JWS Sign options.
   */
  async sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string> {
    const jws = await this._flattened.sign(key, options)

    if (jws.payload === undefined) {
      throw new TypeError('use the flattened module for creating JWS with b64: false')
    }

    return `${jws.protected}.${jws.payload}.${jws.signature}`
  }
}
