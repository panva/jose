import * as base64url from '../runtime/base64url.ts'

import type { JWSHeaderParameters, JWTClaimVerificationOptions, JWTPayload } from '../types.d.ts'
import { decoder } from '../lib/buffer_utils.ts'
import { JWTInvalid } from '../util/errors.ts'
import jwtPayload from '../lib/jwt_claims_set.ts'
import { ProduceJWT } from './produce.ts'

export interface UnsecuredResult {
  payload: JWTPayload
  header: JWSHeaderParameters
}

/**
 * The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.
 *
 * @example Encoding
 * ```js
 * const unsecuredJwt = new jose.UnsecuredJWT({ 'urn:example:claim': true })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encode()
 *
 * console.log(unsecuredJwt)
 * ```
 *
 * @example Decoding
 * ```js
 * const payload = jose.UnsecuredJWT.decode(jwt, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(payload)
 * ```
 */
export class UnsecuredJWT extends ProduceJWT {
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
   */
  static decode(jwt: string, options?: JWTClaimVerificationOptions): UnsecuredResult {
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
