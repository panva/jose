import { decode as base64url } from './base64url.js'
import { decoder } from '../lib/buffer_utils.js'
import isObject from '../lib/is_object.js'
import type { JWSHeaderParameters, JWEHeaderParameters } from '../types.d'

export type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters

/**
 * Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.
 *
 * @example ESM import
 * ```js
 * import { decodeProtectedHeader } from 'jose/util/decode_protected_header'
 * ```
 *
 * @example CJS import
 * ```js
 * const { decodeProtectedHeader } = require('jose/util/decode_protected_header')
 * ```
 *
 * @example Usage
 * ```js
 * const protectedHeader = decodeProtectedHeader(token)
 * console.log(protectedHeader)
 * ```
 *
 * @param token JWE/JWS/JWT token in any JOSE serialization.
 */
function decodeProtectedHeader(token: string | object) {
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
  } catch (err) {
    throw new TypeError('Invalid Token or Protected Header formatting')
  }
}

export { decodeProtectedHeader }
export default decodeProtectedHeader
export type { ProtectedHeaderParameters }
