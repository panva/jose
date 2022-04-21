import { toSPKI as exportPublic } from '../runtime/asn1.ts'
import { toPKCS8 as exportPrivate } from '../runtime/asn1.ts'
import keyToJWK from '../runtime/key_to_jwk.ts'

import type { JWK, KeyLike } from '../types.d.ts'

/**
 * Exports a runtime-specific public key representation (KeyObject or CryptoKey) to an PEM-encoded SPKI string format.
 *
 * @param key Key representation to transform to an PEM-encoded SPKI string format.
 *
 * @example Usage
 * ```js
 * const spkiPem = await jose.exportSPKI(publicKey)
 *
 * console.log(spkiPem)
 * ```
 */
export async function exportSPKI(key: KeyLike): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a runtime-specific private key representation (KeyObject or CryptoKey) to an PEM-encoded PKCS8 string format.
 *
 * @param key Key representation to transform to an PEM-encoded PKCS8 string format.
 *
 * @example Usage
 * ```js
 * const pkcs8Pem = await jose.exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
 */
export async function exportPKCS8(key: KeyLike): Promise<string> {
  return exportPrivate(key)
}

/**
 * Exports a runtime-specific key representation (KeyLike) to a JWK.
 *
 * @param key Key representation to export as JWK.
 *
 * @example Usage
 * ```js
 * const privateJwk = await jose.exportJWK(privateKey)
 * const publicJwk = await jose.exportJWK(publicKey)
 *
 * console.log(privateJwk)
 * console.log(publicJwk)
 * ```
 */
export async function exportJWK(key: KeyLike | Uint8Array): Promise<JWK> {
  return keyToJWK(key)
}
