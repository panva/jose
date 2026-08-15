/**
 * Decodes a Base64URL encoded input.
 *
 * @param input Base64URL encoded input, as a string or its UTF-8 bytes.
 * @returns The decoded bytes.
 * @throws {!TypeError} When the input is not correctly Base64URL encoded. Standard Base64 input
 *   (i.e. containing `+` or `/`) is rejected.
 */
export declare function decode(input: Uint8Array | string): Uint8Array;
/**
 * Encodes an input using Base64URL with no padding.
 *
 * @param input Input to encode, as a string or as bytes. Strings are encoded as UTF-8 first.
 * @returns The Base64URL encoded, unpadded, representation of the input.
 */
export declare function encode(input: Uint8Array | string): string;
