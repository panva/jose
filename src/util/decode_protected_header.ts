/**
 * JOSE Protected Header Decoding (JWE, JWS, all serialization syntaxes)
 *
 * @module
 */

import { parseJoseHeader } from '../lib/validate.js'
import type * as types from '../types.d.ts'

/** JWE and JWS Header Parameters returned by {@link decodeProtectedHeader}. */
export type ProtectedHeaderParameters = types.JWSHeaderParameters & types.JWEHeaderParameters

/**
 * Decodes the Protected Header of a JWE, JWS, or JWT without authenticating the token.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/decode/protected_header'`.
 *
 * @example
 *
 * ```js
 * const protectedHeader = jose.decodeProtectedHeader(token)
 * console.log(protectedHeader)
 * ```
 *
 * @param token Compact token or JSON serialization object with a `protected` member.
 *
 * @returns The parsed Protected Header.
 */
export function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters {
  let protectedB64u!: unknown

  if (typeof token === 'string') {
    const parts = token.split('.')
    if (parts.length === 3 || parts.length === 5) {
      ;[protectedB64u] = parts
    }
  } else if (typeof token === 'object' && token) {
    if ('protected' in token) {
      protectedB64u = token.protected
    } else {
      throw new TypeError('Token does not contain a Protected Header')
    }
  }

  const invalid = 'Invalid Token or Protected Header formatting'

  if (typeof protectedB64u !== 'string' || !protectedB64u) {
    throw new TypeError(invalid)
  }

  return parseJoseHeader<ProtectedHeaderParameters>(protectedB64u, TypeError, invalid)
}
