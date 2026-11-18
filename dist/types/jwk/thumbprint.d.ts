import type * as t from '../types.d.ts';
/**
 * Calculates a base64url-encoded JWK Thumbprint. CryptoKey inputs must be extractable.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest algorithm. Defaults to "sha256".
 */
export declare function calculateJwkThumbprint(key: t.JWK | t.CryptoKey | t.KeyObject, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
/**
 * Calculates a JWK Thumbprint URI. CryptoKey inputs must be extractable.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest algorithm. Defaults to "sha256".
 */
export declare function calculateJwkThumbprintUri(key: t.CryptoKey | t.KeyObject | t.JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
