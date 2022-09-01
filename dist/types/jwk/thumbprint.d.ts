import type { JWK } from '../types';
/**
 * Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint as per
 * [RFC7638](https://www.rfc-editor.org/rfc/rfc7638).
 *
 * @example Usage
 *
 * ```js
 * const thumbprint = await jose.calculateJwkThumbprint({
 *   kty: 'EC',
 *   crv: 'P-256',
 *   x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
 *   y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
 * })
 *
 * console.log(thumbprint)
 * // 'w9eYdC6_s_tLQ8lH6PUpc0mddazaqtPgeC2IgWDiqY8'
 * ```
 *
 * @param jwk JSON Web Key.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is "sha256".
 */
export declare function calculateJwkThumbprint(jwk: JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
/**
 * Calculates a JSON Web Key (JWK) Thumbprint URI as per [RFC9278](https://www.rfc-editor.org/rfc/rfc9278).
 *
 * @example Usage
 *
 * ```js
 * const thumbprintUri = await jose.calculateJwkThumbprintUri({
 *   kty: 'EC',
 *   crv: 'P-256',
 *   x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
 *   y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
 * })
 *
 * console.log(thumbprint)
 * // 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:w9eYdC6_s_tLQ8lH6PUpc0mddazaqtPgeC2IgWDiqY8'
 * ```
 *
 * @param jwk JSON Web Key.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is "sha256".
 */
export declare function calculateJwkThumbprintUri(jwk: JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
