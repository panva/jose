import * as base64url from '../lib/base64url.ts'

/**
 * Utility function to encode a string or {@link !Uint8Array} as a base64url string.
 *
 * @param input Value that will be base64url-encoded.
 */
interface Base64UrlEncode {
  (input: Uint8Array | string): string
}
/**
 * Utility function to decode a base64url encoded string.
 *
 * @param input Value that will be base64url-decoded.
 */
interface Base64UrlDecode {
  (input: Uint8Array | string): Uint8Array
}

export const encode: Base64UrlEncode = base64url.encode
export const decode: Base64UrlDecode = base64url.decode
