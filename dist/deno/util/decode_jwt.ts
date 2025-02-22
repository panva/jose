import { decode as base64url } from './base64url.ts'
import { decoder } from '../lib/buffer_utils.ts'
import isObject from '../lib/is_object.ts'
import type * as types from '../types.d.ts'
import { JWTInvalid } from './errors.ts'

/**
 * Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
 * values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
 * and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
 * and JWE decryption use `jose.jwtDecrypt()`.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwt/decode'`.
 *
 * @param jwt JWT token in compact JWS serialization.
 */
export function decodeJwt<PayloadType = types.JWTPayload>(
  jwt: string,
): PayloadType & types.JWTPayload {
  if (typeof jwt !== 'string')
    throw new JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string')

  const { 1: payload, length } = jwt.split('.')

  if (length === 5) throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded')
  if (length !== 3) throw new JWTInvalid('Invalid JWT')
  if (!payload) throw new JWTInvalid('JWTs must contain a payload')

  let decoded: Uint8Array
  try {
    decoded = base64url(payload)
  } catch {
    throw new JWTInvalid('Failed to base64url decode the payload')
  }

  let result: unknown
  try {
    result = JSON.parse(decoder.decode(decoded))
  } catch {
    throw new JWTInvalid('Failed to parse the decoded payload as JSON')
  }

  if (!isObject<PayloadType & types.JWTPayload>(result))
    throw new JWTInvalid('Invalid JWT Claims Set')

  return result
}
