/**
 * JSON Web Token (JWT) Claims Set Decoding (no signature, MAC, or claims validation)
 *
 * @module
 */

import { decode as b64u } from './base64url.js'
import { strictDecoder } from '../lib/buffer_utils.js'
import { isObject } from '../lib/validate.js'
import { JWTInvalid } from './errors.js'
import type * as types from '../types.d.ts'

/**
 * Decodes the Claims Set of a JWT in JWS Compact Serialization without validating its JWS Signature
 * (digital signature or MAC) or claim types and values.
 *
 * Use {@link "jwt/verify".jwtVerify jwtVerify} to verify signed JWTs or
 * {@link "jwt/decrypt".jwtDecrypt jwtDecrypt} to decrypt and validate encrypted JWTs.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwt/decode'`.
 *
 * @example
 *
 * ```js
 * const claims = jose.decodeJwt(token)
 * console.log(claims)
 * ```
 *
 * @typeParam PayloadType Type definition of the JWT Claims Set the token is expected to carry.
 *
 * @param jwt JWT token in JWS Compact Serialization.
 *
 * @returns The parsed JWT Claims Set.
 */
export function decodeJwt<PayloadType = types.JWTPayload>(
  jwt: string,
): PayloadType &
  types.JWTPayload &
  ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never) {
  if (typeof jwt !== 'string')
    throw new JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string')

  const { 1: encodedPayload, length } = jwt.split('.')

  if (length === 5) throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded')
  if (length !== 3) throw new JWTInvalid('Invalid JWT')
  if (!encodedPayload) throw new JWTInvalid('JWTs must contain a payload')

  let claimsSetBytes: Uint8Array
  try {
    claimsSetBytes = b64u(encodedPayload)
  } catch {
    throw new JWTInvalid('Failed to base64url decode the payload')
  }

  // RFC 7519, Section 7.2, step 10 only: UTF-8 and JSON Claims Set parsing.
  let claimsSet: unknown
  try {
    claimsSet = JSON.parse(strictDecoder.decode(claimsSetBytes))
  } catch {
    throw new JWTInvalid('Failed to parse the decoded payload as JSON')
  }

  if (!isObject<types.JWTPayload>(claimsSet)) throw new JWTInvalid('Invalid JWT Claims Set')

  return claimsSet as PayloadType &
    types.JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)
}
