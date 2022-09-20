import { decode as base64url } from './base64url.js'
import { decoder } from '../lib/buffer_utils.js'
import isObject from '../lib/is_object.js'
import type { JWTPayload } from '../types.d'
import { JWTInvalid } from './errors.js'

/**
 * Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
 * values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
 * and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
 * and JWE decryption use `jose.jwtDecrypt()`.
 *
 * @example Usage
 *
 * ```js
 * const claims = jose.decodeJwt(token)
 * console.log(claims)
 * ```
 *
 * @param jwt JWT token in compact JWS serialization.
 */
export function decodeJwt(jwt: string) {
  if (typeof jwt !== 'string')
    throw new JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string')

  const { 0: header, 1: payload, length } = jwt.split('.')

  if (length === 5) throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded')
  if (!header && !payload) throw new JWTInvalid('JWTs must contain a header and a payload')

  let decoded: Uint8Array
  try {
    decoded = base64url(payload)
  } catch {
    throw new JWTInvalid('Failed to parse the base64url encoded payload')
  }

  let result: unknown
  try {
    result = JSON.parse(decoder.decode(decoded))
  } catch {
    throw new JWTInvalid('Failed to parse the decoded payload as JSON')
  }

  if (!isObject<JWTPayload>(result)) throw new JWTInvalid('Invalid JWT Claims Set')

  return result
}
