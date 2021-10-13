import { toSPKI as exportPublic } from '../runtime/asn1.js'
import { toPKCS8 as exportPrivate } from '../runtime/asn1.js'
import keyToJWK from '../runtime/key_to_jwk.js'

import type { JWK, KeyLike } from '../types.d'

/**
 * Exports a runtime-specific public key representation (KeyObject or CryptoKey) to an PEM-encoded SPKI string format.
 *
 * @param key Key representation to transform to an PEM-encoded SPKI string format.
 *
 * @example Usage
 * ```js
 * const spkiPem = await exportSPKI(publicKey)
 *
 * console.log(spkiPem)
 * ```
 *
 * @example ESM import
 * ```js
 * import { exportSPKI } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportSPKI } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportSPKI } from 'https://deno.land/x/jose@VERSION/index.ts'
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
 * const pkcs8Pem = await exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
 *
 * @example ESM import
 * ```js
 * import { exportPKCS8 } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportPKCS8 } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportPKCS8 } from 'https://deno.land/x/jose@VERSION/index.ts'
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
 * const privateJwk = await exportJWK(privateKey)
 * const publicJwk = await exportJWK(publicKey)
 *
 * console.log(privateJwk)
 * console.log(publicJwk)
 * ```
 *
 * @example ESM import
 * ```js
 * import { exportJWK } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportJWK } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportJWK } from 'https://deno.land/x/jose@VERSION/index.ts'
 * ```
 */
export async function exportJWK(key: KeyLike | Uint8Array): Promise<JWK> {
  return keyToJWK(key)
}
