/**
 * JWE and JWS Protected Header Decoding (JWE, JWS, all serialization syntaxes)
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
  let encodedProtectedHeader!: unknown

  if (typeof token === 'string') {
    const parts = token.split('.')
    if (parts.length === 3 || parts.length === 5) {
      ;[encodedProtectedHeader] = parts
    }
  } else if (typeof token === 'object' && token) {
    if ('protected' in token) {
      encodedProtectedHeader = token.protected
    } else {
      throw new TypeError('Token does not contain a Protected Header')
    }
  }

  const invalid = 'Invalid Token or Protected Header formatting'

  if (typeof encodedProtectedHeader !== 'string' || !encodedProtectedHeader) {
    throw new TypeError(invalid)
  }

  // Decoding only: RFC 7515, Section 5.2, steps 2-3;
  // draft-ietf-jose-hpke-encrypt-22, Section 7.2, steps 2-3.
  return parseJoseHeader<ProtectedHeaderParameters>(encodedProtectedHeader, TypeError, invalid)
}
