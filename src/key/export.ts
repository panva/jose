import { toSPKI as exportPublic } from '../runtime/asn1.js'
import { toPKCS8 as exportPrivate } from '../runtime/asn1.js'
import keyToJWK from '../runtime/key_to_jwk.js'

import type { JWK, KeyLike } from '../types.d'

/**
 * Exports a runtime-specific public key representation (KeyObject or CryptoKey) to a PEM-encoded
 * SPKI string format.
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
export async function exportSPKI(key: KeyLike): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a runtime-specific private key representation (KeyObject or CryptoKey) to a PEM-encoded
 * PKCS8 string format.
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
export async function exportPKCS8(key: KeyLike): Promise<string> {
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
export async function exportJWK(key: KeyLike | Uint8Array): Promise<JWK> {
  return keyToJWK(key)
}
