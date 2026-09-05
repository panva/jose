/**
 * Base64URL encoding and decoding utilities
 *
 * @module
 */

import { encoder, decoder, encodeBase64, decodeBase64 } from '../lib/buffer_utils.js'

const invalid = 'The input to be decoded is not correctly encoded.'

/**
 * Decodes base64url text or its UTF-8 bytes.
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
 * @param input Base64url-encoded string or its UTF-8 bytes.
 *
 * @returns The decoded bytes.
 *
 * @throws {TypeError} If the input is not valid base64url. Standard Base64 `+` and `/` are
 *   rejected.
 */
export function decode(input: Uint8Array | string): Uint8Array {
  try {
    return decodeBase64(typeof input === 'string' ? input : decoder.decode(input), true)
  } catch (cause) {
    throw new TypeError(invalid, { cause })
  }
}

/**
 * Encodes unpadded base64url; strings are first encoded as UTF-8.
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
 * @param input Bytes or a string to encode. Strings are first encoded as UTF-8.
 *
 * @returns The unpadded base64url representation of the input.
 */
export function encode(input: Uint8Array | string): string {
  return encodeBase64(typeof input === 'string' ? encoder.encode(input) : input, true)
}
