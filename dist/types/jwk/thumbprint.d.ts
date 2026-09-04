import type * as t from '../types.d.ts';
/**
 * Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 */
export declare function calculateJwkThumbprint(key: t.JWK | t.CryptoKey | t.KeyObject, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
/**
 * Calculates a JSON Web Key (JWK) Thumbprint URI.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 */
export declare function calculateJwkThumbprintUri(key: t.CryptoKey | t.KeyObject | t.JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
