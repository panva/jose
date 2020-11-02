/* eslint-disable no-underscore-dangle */

import CompactSign from '../jws/compact/sign.js'
import { JWTInvalid } from '../util/errors.js'
import { JWSHeaderParameters, JWTPayload, KeyLike } from '../types.d'
import { encoder } from '../lib/buffer_utils.js'
import ProduceJWT from '../lib/jwt_producer.js'

/**
 * The SignJWT class is a utility for creating Compact JWS formatted JWT strings.
 *
 * @example
 * ```
 * // ESM import
 * import SignJWT from 'jose/jwt/sign'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: SignJWT } = require('jose/jwt/sign')
 * ```
 *
 * @example
 * ```
 * // usage
 * import parseJwk from 'jose/jwk/parse'
 *
 * const privateKey = await parseJwk({
 *   alg: 'ES256',
 *   crv: 'P-256',
 *   kty: 'EC',
 *   d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * })
 *
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
export default class SignJWT extends ProduceJWT {
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
   */
  async sign(key: KeyLike): Promise<string> {
    const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)))
    sig.setProtectedHeader(this._protectedHeader)
    if (this._protectedHeader.crit?.includes('b64') && this._protectedHeader.b64 === false) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }
    return sig.sign(key)
  }
}

export type { JWSHeaderParameters, JWTPayload, KeyLike }
