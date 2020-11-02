/* eslint-disable no-underscore-dangle */

import { JWSHeaderParameters, JWTClaimVerificationOptions, JWTPayload } from '../types.d'
import { decoder } from '../lib/buffer_utils.js'
import * as base64url from '../runtime/base64url.js'
import { JWTInvalid } from '../util/errors.js'
import jwtPayload from '../lib/jwt_claims_set.js'
import ProduceJWT from '../lib/jwt_producer.js'

/**
 * The UnsecuredJWT class is a utility for creating `{ "alg": "none" }` Unsecured JWTs.
 *
 * @example
 * ```
 * // ESM import
 * import UnsecuredJWT from 'jose/jwt/unsecured'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: UnsecuredJWT } = require('jose/jwt/unsecured')
 * ```
 *
 * @example
 * ```
 * // encoding
 *
 * const unsecuredJwt = new UnsecuredJWT({ 'urn:example:claim': true })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encode()
 *
 * console.log(unsecuredJwt)
 * ```
 *
 * @example
 * ```
 * // decoding
 *
 * const payload = new UnsecuredJWT.decode(jwt, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(payload)
 * ```
 */
export default class UnsecuredJWT extends ProduceJWT {
  /**
   * Encodes the Unsecured JWT.
   */
  encode(): string {
    const header = base64url.encode(JSON.stringify({ alg: 'none' }))
    const payload = base64url.encode(JSON.stringify(this._payload))

    return `${header}.${payload}.`
  }

  /**
   * Decodes an unsecured JWT.
   *
   * @param jwt Unsecured JWT to decode the payload of.
   * @param options JWT Claims Set validation options.
   *
   * @example
   * ```
   * // decoding
   * const { payload, header } = UnsecuredJWT.decode(unsecuredJwt)
   *
   * console.log(header)
   * console.log(payload)
   * ```
   */
  static decode(
    jwt: string,
    options?: JWTClaimVerificationOptions,
  ): { payload: JWTPayload; header: JWSHeaderParameters } {
    if (typeof jwt !== 'string') {
      throw new JWTInvalid('Unsecured JWT must be a string')
    }
    const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split('.')

    if (length !== 3 || signature !== '') {
      throw new JWTInvalid('Invalid Unsecured JWT')
    }

    let header: JWSHeaderParameters
    try {
      header = JSON.parse(decoder.decode(base64url.decode(encodedHeader)))
      if (header.alg !== 'none') throw new Error()
    } catch {
      throw new JWTInvalid('Invalid Unsecured JWT')
    }

    const payload = jwtPayload(header, base64url.decode(encodedPayload), options)

    return { payload, header }
  }
}

export type { JWSHeaderParameters, JWTPayload }
