import { CompactSign } from '../jws/compact/sign.ts'
import { JWTInvalid } from '../util/errors.ts'
import type { JWTHeaderParameters, KeyLike, SignOptions } from '../types.d.ts'
import { encoder } from '../lib/buffer_utils.ts'
import { ProduceJWT } from './produce.ts'

/**
 * The SignJWT class is a utility for creating Compact JWS formatted JWT strings.
 *
 * @example Usage
 * ```js
 * const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .sign(privateKey)
 *
 * console.log(jwt)
 * ```
 */
export class SignJWT extends ProduceJWT {
  private _protectedHeader!: JWTHeaderParameters

  /**
   * Sets the JWS Protected Header on the SignJWT object.
   *
   * @param protectedHeader JWS Protected Header.
   * Must contain an "alg" (JWS Algorithm) property.
   */
  setProtectedHeader(protectedHeader: JWTHeaderParameters) {
    this._protectedHeader = protectedHeader
    return this
  }

  /**
   * Signs and returns the JWT.
   *
   * @param key Private Key or Secret to sign the JWT with.
   * @param options JWT Sign options.
   */
  async sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string> {
    const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)))
    sig.setProtectedHeader(this._protectedHeader)
    if (
      Array.isArray(this._protectedHeader?.crit) &&
      this._protectedHeader.crit.includes('b64') &&
      // @ts-expect-error
      this._protectedHeader.b64 === false
    ) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }
    return sig.sign(key, options)
  }
}
