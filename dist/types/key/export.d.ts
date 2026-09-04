import type * as t from '../types.d.ts';
/**
 * Exports a public {@link !CryptoKey} or {@link !KeyObject} to a PEM-encoded SPKI string format.
 *
 * @param key Key to export to a PEM-encoded SPKI string format.
 */
export declare function exportSPKI(key: t.CryptoKey | t.KeyObject): Promise<string>;
/**
 * Exports a private {@link !CryptoKey} or {@link !KeyObject} to a PEM-encoded PKCS8 string format.
 *
 * @param key Key to export to a PEM-encoded PKCS8 string format.
 */
export declare function exportPKCS8(key: t.CryptoKey | t.KeyObject): Promise<string>;
/**
 * Exports a {@link !CryptoKey}, {@link !KeyObject}, or {@link !Uint8Array} to a JWK.
 *
 * @param key Key to export as JWK.
 */
export declare function exportJWK(key: t.CryptoKey | t.KeyObject | Uint8Array): Promise<t.JWK>;
