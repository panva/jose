import { toSPKI as exportPublic } from '../runtime/asn1.js'
import { toPKCS8 as exportPrivate } from '../runtime/asn1.js'

import { fromKeyLike } from '../jwk/from_key_like.js'
import type { KeyLike } from '../types.d'

/**
 * Exports a runtime-specific public key representation (KeyObject or CryptoKey) to an PEM-encoded SPKI string format.
 *
 * @param key Key representation to transform to an PEM-encoded SPKI string format.
 *
 * @example ESM import
 * ```js
 * import { exportSPKI } from 'jose/key/export'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportSPKI } = require('jose/key/export')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportSPKI } from 'https://deno.land/x/jose@VERSION/key/export.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const spkiPem = await exportSPKI(publicKey)
 *
 * console.log(spkiPem)
 * ```
 */
export async function exportSPKI(key: Exclude<KeyLike, Uint8Array>): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a runtime-specific private key representation (KeyObject or CryptoKey) to an PEM-encoded PKCS8 string format.
 *
 * @param key Key representation to transform to an PEM-encoded PKCS8 string format.
 *
 * @example ESM import
 * ```js
 * import { exportPKCS8 } from 'jose/key/export'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportPKCS8 } = require('jose/key/export')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportPKCS8 } from 'https://deno.land/x/jose@VERSION/key/export.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const pkcs8Pem = await exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
 */
export async function exportPKCS8(key: Exclude<KeyLike, Uint8Array>): Promise<string> {
  return exportPrivate(key)
}

/**
 * Exports a runtime-specific key representation (KeyLike) to a JWK.
 *
 * @param key Key representation to export as JWK.
 *
 * @example ESM import
 * ```js
 * import { exportJWK } from 'jose/key/export'
 * ```
 *
 * @example CJS import
 * ```js
 * const { exportJWK } = require('jose/key/export')
 * ```
 *
 * @example Deno import
 * ```js
 * import { exportJWK } from 'https://deno.land/x/jose@VERSION/key/export.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const privateJwk = await exportJWK(privateKey)
 * const publicJwk = await exportJWK(publicKey)
 *
 * console.log(privateJwk)
 * console.log(publicJwk)
 * ```
 */
export const exportJWK: typeof fromKeyLike = (...args) => fromKeyLike(...args)

export type { KeyLike }
