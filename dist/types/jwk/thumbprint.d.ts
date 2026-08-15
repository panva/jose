import type * as types from '../types.d.ts';
/**
 * Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 */
export declare function calculateJwkThumbprint(key: types.JWK | types.CryptoKey | types.KeyObject, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
/**
 * Calculates a JSON Web Key (JWK) Thumbprint URI
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 */
export declare function calculateJwkThumbprintUri(key: types.CryptoKey | types.KeyObject | types.JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
