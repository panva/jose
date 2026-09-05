import type * as t from '../types.d.ts';
/**
 * Exports a public key to PEM-encoded SPKI. CryptoKey inputs must be extractable.
 *
 * @param key Key to export.
 */
export declare function exportSPKI(key: t.CryptoKey | t.KeyObject): Promise<string>;
/**
 * Exports a private key to PEM-encoded PKCS#8. CryptoKey inputs must be extractable.
 *
 * @param key Key to export.
 */
export declare function exportPKCS8(key: t.CryptoKey | t.KeyObject): Promise<string>;
/**
 * Exports a key to JWK. CryptoKey inputs must be extractable.
 *
 * @param key Key to export.
 */
export declare function exportJWK(key: t.CryptoKey | t.KeyObject | Uint8Array): Promise<t.JWK>;
