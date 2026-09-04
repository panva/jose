/**
 * Base64URL encoding and decoding utilities
 *
 * @module
 */

import { encoder, decoder } from '../lib/buffer_utils.js'
import { encodeBase64, decodeBase64 } from '../lib/base64.js'

const invalid = 'The input to be decoded is not correctly encoded.'

/**
 * Decodes a base64url-encoded input.
 *
 * These functions are exported (as the `base64url` namespace) from the main `'jose'` module entry
 * point as well as from its subpath export `'jose/base64url'`.
 *
 * @example
 *
 * ```js
 * const decoded = jose.base64url.decode('SGVsbG8gV29ybGQh')
 * ```
 *
 * @param input Base64URL encoded input, as a string or its UTF-8 bytes.
 *
 * @returns The decoded bytes.
 *
 * @throws {!TypeError} When the input is not correctly Base64URL encoded. Standard Base64 input
 *   (i.e. containing `+` or `/`) is rejected.
 */
export function decode(input: Uint8Array | string): Uint8Array {
  // @ts-ignore
  if (Uint8Array.fromBase64) {
    try {
      // @ts-ignore
      return Uint8Array.fromBase64(typeof input === 'string' ? input : decoder.decode(input), {
        alphabet: 'base64url',
      })
    } catch (cause) {
      throw new TypeError(invalid, { cause })
    }
  }

  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  // Aligns the fallback path with the Uint8Array base64 methods.
  if (encoded.includes('+') || encoded.includes('/')) {
    throw new TypeError(invalid)
  }
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  try {
    return decodeBase64(encoded)
  } catch {
    throw new TypeError(invalid)
  }
}

/**
 * Encodes input using unpadded base64url.
 *
 * These functions are exported (as the `base64url` namespace) from the main `'jose'` module entry
 * point as well as from its subpath export `'jose/base64url'`.
 *
 * @example
 *
 * ```js
 * const encoded = jose.base64url.encode('Hello World!')
 * ```
 *
 * @param input Input to encode, as a string or as bytes. Strings are encoded as UTF-8 first.
 *
 * @returns The Base64URL encoded, unpadded, representation of the input.
 */
export function encode(input: Uint8Array | string): string {
  let unencoded = input
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded)
  }

  // @ts-ignore
  if (Uint8Array.prototype.toBase64) {
    // @ts-ignore
    return unencoded.toBase64({ alphabet: 'base64url', omitPadding: true })
  }

  return encodeBase64(unencoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
