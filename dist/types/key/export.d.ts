import type { JWK, KeyLike } from '../types';
/**
 * Exports a runtime-specific public key representation (KeyObject or CryptoKey) to a PEM-encoded
 * SPKI string format.
 *
 * @example Usage
 *
 * ```js
 * const spkiPem = await jose.exportSPKI(publicKey)
 *
 * console.log(spkiPem)
 * ```
 *
 * @param key Key representation to transform to a PEM-encoded SPKI string format.
 */
export declare function exportSPKI(key: KeyLike): Promise<string>;
/**
 * Exports a runtime-specific private key representation (KeyObject or CryptoKey) to a PEM-encoded
 * PKCS8 string format.
 *
 * @example Usage
 *
 * ```js
 * const pkcs8Pem = await jose.exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
 *
 * @param key Key representation to transform to a PEM-encoded PKCS8 string format.
 */
export declare function exportPKCS8(key: KeyLike): Promise<string>;
/**
 * Exports a runtime-specific key representation (KeyLike) to a JWK.
 *
 * @example Usage
 *
 * ```js
 * const privateJwk = await jose.exportJWK(privateKey)
 * const publicJwk = await jose.exportJWK(publicKey)
 *
 * console.log(privateJwk)
 * console.log(publicJwk)
 * ```
 *
 * @param key Key representation to export as JWK.
 */
export declare function exportJWK(key: KeyLike | Uint8Array): Promise<JWK>;
