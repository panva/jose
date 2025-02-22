import { toSPKI as exportPublic, toPKCS8 as exportPrivate } from '../lib/asn1.ts'
import keyToJWK from '../lib/key_to_jwk.ts'

import type * as types from '../types.d.ts'

/**
 * Exports a public {@link !CryptoKey} or {@link !KeyObject} to a PEM-encoded SPKI string format.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @param key Key to export to a PEM-encoded SPKI string format.
 */
export async function exportSPKI(key: types.CryptoKey | types.KeyObject): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a private {@link !CryptoKey} or {@link !KeyObject} to a PEM-encoded PKCS8 string format.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @param key Key to export to a PEM-encoded PKCS8 string format.
 */
export async function exportPKCS8(key: types.CryptoKey | types.KeyObject): Promise<string> {
  return exportPrivate(key)
}

/**
 * Exports a {@link !CryptoKey}, {@link !KeyObject}, or {@link !Uint8Array} to a JWK.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/export'`.
 *
 * @param key Key to export as JWK.
 */
export async function exportJWK(
  key: types.CryptoKey | types.KeyObject | Uint8Array,
): Promise<types.JWK> {
  return keyToJWK(key)
}
