import { decode as base64url } from './base64url.ts'
import { decoder } from '../lib/buffer_utils.ts'
import isObject from '../lib/is_object.ts'
import type { JWSHeaderParameters, JWEHeaderParameters } from '../types.d.ts'

export type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters

/**
 * Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.
 *
 * @param token JWE/JWS/JWT token in any JOSE serialization.
 *
 * @example Usage
 * ```js
 * const protectedHeader = jose.decodeProtectedHeader(token)
 * console.log(protectedHeader)
 * ```
 */
export function decodeProtectedHeader(token: string | object) {
  let protectedB64u!: string

  if (typeof token === 'string') {
    const parts = token.split('.')
    if (parts.length === 3 || parts.length === 5) {
      ;[protectedB64u] = parts
    }
  } else if (typeof token === 'object' && token) {
    if ('protected' in token) {
      protectedB64u = (<{ protected: string }>token).protected
    } else {
      throw new TypeError('Token does not contain a Protected Header')
    }
  }

  try {
    if (typeof protectedB64u !== 'string' || !protectedB64u) {
      throw new Error()
    }
    const result = JSON.parse(decoder.decode(base64url(protectedB64u!)))
    if (!isObject(result)) {
      throw new Error()
    }
    return <ProtectedHeaderParameters>result
  } catch {
    throw new TypeError('Invalid Token or Protected Header formatting')
  }
}
