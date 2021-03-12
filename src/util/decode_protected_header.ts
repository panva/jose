import { ok as assert } from 'assert'

import { decode as base64url } from './base64url.js'
import { decoder } from '../lib/buffer_utils.js'
import isObject from '../lib/is_object.js'
import type { JWSHeaderParameters, JWEHeaderParameters } from '../types.d'

export type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters

/**
 * Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.
 *
 * @example
 * ```js
 * // ESM import
 * import decodeProtectedHeader from 'jose/util/decode_protected_header'
 * ```
 *
 * @example
 * ```js
 * // CJS import
 * const { default: decodeProtectedHeader } = require('jose/util/decode_protected_header')
 * ```
 *
 * @example
 * ```js
 * // usage
 * const protectedHeader = decodeProtectedHeader(token)
 * console.log(protectedHeader)
 * ```
 *
 * @param token JWE/JWS/JWT token in any JOSE serialization.
 */
export default function decodeProtectedHeader(token: string | object) {
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
    assert(typeof protectedB64u === 'string' && protectedB64u)
    const result = JSON.parse(decoder.decode(base64url(protectedB64u!)))
    assert(isObject(result))
    return <ProtectedHeaderParameters>result
  } catch (err) {
    throw new TypeError('Invalid Token or Protected Header formatting')
  }
}
