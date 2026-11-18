/**
 * Decodes base64url text or its UTF-8 bytes.
 *
 * @param input Base64url-encoded string or its UTF-8 bytes.
 * @returns The decoded bytes.
 * @throws {TypeError} If the input is not valid base64url. Standard Base64 `+` and `/` are
 *   rejected.
 */
export declare function decode(input: Uint8Array | string): Uint8Array;
/**
 * Encodes unpadded base64url; strings are first encoded as UTF-8.
 *
 * @param input Bytes or a string to encode. Strings are first encoded as UTF-8.
 * @returns The unpadded base64url representation of the input.
 */
export declare function encode(input: Uint8Array | string): string;
