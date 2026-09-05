/**
 * Unsecured (unsigned & unencrypted) JSON Web Tokens (JWT)
 *
 * @module
 */

import * as b64u from '../util/base64url.js'

import type * as types from '../types.d.ts'
import {
  decodeBase64url,
  parseJoseHeader,
  JWS_RECOGNIZED,
  validateB64,
  validateCrit,
} from '../lib/validate.js'
import { JWSInvalid, JWTInvalid } from '../util/errors.js'
import { validateClaimsSet, JWTClaimsBuilder, jwtData } from '../lib/jwt_claims_set.js'

/**
 * Decoded Unsecured JWT.
 *
 * @typeParam PayloadType Type definition of the JWT Claims Set the token is expected to carry.
 */
export interface UnsecuredResult<PayloadType = types.JWTPayload> {
  /** JWT Claims Set. */
  payload: PayloadType &
    types.JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)

  /** The decoded JOSE Header; always `{ "alg": "none" }` for an Unsecured JWT. */
  header: types.JWSHeaderParameters
}

/**
 * UnsecuredJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
const UnsecuredJWT_base: new (payload?: types.JWTPayload) => types.ProduceJWT = JWTClaimsBuilder

/**
 * Encodes and decodes `{ "alg": "none" }` Unsecured JWTs.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/unsecured'`.
 *
 * @example
 *
 * Encoding
 *
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
 * @example
 *
 * Decoding
 *
 * ```js
 * const { payload, header } = jose.UnsecuredJWT.decode(unsecuredJwt, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 *
 * console.log(header)
 * console.log(payload)
 * ```
 */
export class UnsecuredJWT extends UnsecuredJWT_base {
  declare private jwt: never

  /** Encodes the Unsecured JWT. */
  encode(): string {
    const header = b64u.encode(JSON.stringify({ alg: 'none' }))
    const payload = b64u.encode(jwtData(this))

    return `${header}.${payload}.`
  }

  /**
   * Decodes an unsecured JWT.
   *
   * @param jwt Unsecured JWT to decode the payload of.
   * @param options JWT Claims Set validation options.
   */
  static decode<PayloadType = types.JWTPayload>(
    jwt: string,
    options?: types.JWTClaimVerificationOptions,
  ): UnsecuredResult<PayloadType> {
    if (typeof jwt !== 'string') {
      throw new JWTInvalid('Unsecured JWT must be a string')
    }
    const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split('.')

    if (length !== 3 || signature !== '') {
      throw new JWTInvalid('Invalid Unsecured JWT')
    }

    let header: types.JWSHeaderParameters
    let b64: boolean
    try {
      header = parseJoseHeader(encodedHeader, JWSInvalid, 'JWS Protected Header is invalid')
      const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, undefined, header, header)
      b64 = validateB64(header, extensions)
    } catch (cause) {
      if (!(cause instanceof JWSInvalid)) {
        throw cause
      }
      throw new JWTInvalid('Invalid Unsecured JWT', { cause })
    }

    if (header.alg !== 'none') {
      throw new JWTInvalid('Invalid Unsecured JWT')
    }
    if (!b64) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }

    const payload = validateClaimsSet(
      header,
      decodeBase64url(encodedPayload, 'payload', JWTInvalid),
      options,
    ) as UnsecuredResult<PayloadType>['payload']

    return { payload, header }
  }
}
