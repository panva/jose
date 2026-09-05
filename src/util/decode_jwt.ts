/**
 * JSON Web Token (JWT) Claims Set Decoding (no validation, no signature checking)
 *
 * @module
 */

import { decode as b64u } from './base64url.js'
import { strictDecoder } from '../lib/buffer_utils.js'
import { isObject } from '../lib/validate.js'
import { JWTInvalid } from './errors.js'
import type * as types from '../types.d.ts'

/**
 * Decodes the Claims Set of a JWT in Compact JWS serialization without checking its signature or
 * validating claim types and values.
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
 * @param jwt JWT token in compact JWS serialization.
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

  const { 1: payload, length } = jwt.split('.')

  if (length === 5) throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded')
  if (length !== 3) throw new JWTInvalid('Invalid JWT')
  if (!payload) throw new JWTInvalid('JWTs must contain a payload')

  let decoded: Uint8Array
  try {
    decoded = b64u(payload)
  } catch {
    throw new JWTInvalid('Failed to base64url decode the payload')
  }

  let result: unknown
  try {
    result = JSON.parse(strictDecoder.decode(decoded))
  } catch {
    throw new JWTInvalid('Failed to parse the decoded payload as JSON')
  }

  if (!isObject<types.JWTPayload>(result)) throw new JWTInvalid('Invalid JWT Claims Set')

  return result as PayloadType &
    types.JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)
}
