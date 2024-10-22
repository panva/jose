import { toSPKI as exportPublic, toPKCS8 as exportPrivate } from '../lib/asn1.js'
import keyToJWK from '../lib/key_to_jwk.js'

import type * as types from '../types.d.ts'

/**
 * Exports a runtime-specific public key representation ({@link !KeyObject} or {@link !CryptoKey}) to
 * a PEM-encoded SPKI string format.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @example
 *
 * ```js
 * const spkiPem = await jose.exportSPKI(publicKey)
 *
 * console.log(spkiPem)
 * ```
 *
 * @param key Key representation to transform to a PEM-encoded SPKI string format.
 */
export async function exportSPKI(key: types.CryptoKey): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a runtime-specific private key representation ({@link !KeyObject} or {@link !CryptoKey}) to
 * a PEM-encoded PKCS8 string format.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @example
 *
 * ```js
 * const pkcs8Pem = await jose.exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
 *
 * @param key Key representation to transform to a PEM-encoded PKCS8 string format.
 */
export async function exportPKCS8(key: types.CryptoKey): Promise<string> {
  return exportPrivate(key)
}

/**
 * Exports a runtime-specific key representation (KeyLike) to a JWK.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @example
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
export async function exportJWK(key: types.CryptoKey | Uint8Array): Promise<types.JWK> {
  return keyToJWK(key)
}
