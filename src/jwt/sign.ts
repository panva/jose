import CompactSign from '../jws/compact/sign.js'
import { JWTInvalid } from '../util/errors.js'
import type { JWSHeaderParameters, JWTPayload, KeyLike, SignOptions } from '../types.d'
import { encoder } from '../lib/buffer_utils.js'
import { ProduceJWT } from './produce.js'

/**
 * The SignJWT class is a utility for creating Compact JWS formatted JWT strings.
 *
 * @example ESM import
 * ```js
 * import { SignJWT } from 'jose/jwt/sign'
 * ```
 *
 * @example CJS import
 * ```js
 * const { SignJWT } = require('jose/jwt/sign')
 * ```
 *
 * @example Deno import
 * ```js
 * import { SignJWT } from 'https://deno.land/x/jose@VERSION/jwt/sign.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const jwt = await new SignJWT({ 'urn:example:claim': true })
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
class SignJWT extends ProduceJWT {
  private _protectedHeader!: JWSHeaderParameters

  /**
   * Sets the JWS Protected Header on the SignJWT object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: JWSHeaderParameters) {
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
      this._protectedHeader.b64 === false
    ) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }
    return sig.sign(key, options)
  }
}

export { SignJWT }
export default SignJWT
export type { JWSHeaderParameters, JWTPayload, KeyLike }
