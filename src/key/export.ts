/**
 * Cryptographic key export functions
 *
 * @module
 */

import { toSPKI as exportPublic, toPKCS8 as exportPrivate } from '../lib/asn1.js'

import type * as types from '../types.d.ts'
import { invalidKeyInput } from '../lib/invalid_key_input.js'
import { encode as b64u } from '../util/base64url.js'
import { isCryptoKey, isKeyObject } from '../lib/is_key_like.js'

interface ExportOptions {
  format: 'jwk'
}

interface ExtractableKeyObject extends types.KeyObject {
  export(arg: ExportOptions): types.JWK
  export(): Uint8Array
}

function omitUndefinedProperties(jwk: JsonWebKey): JsonWebKey {
  return Object.fromEntries(Object.entries(jwk).filter(([, value]) => value !== undefined))
}

async function keyToJWK(key: unknown): Promise<types.JWK> {
  if (isKeyObject(key)) {
    if (key.type === 'secret') {
      key = (key as ExtractableKeyObject).export()
    } else {
      return (key as ExtractableKeyObject).export({ format: 'jwk' })
    }
  }
  if (key instanceof Uint8Array) {
    return {
      kty: 'oct',
      k: b64u(key),
    }
  }
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'Uint8Array'))
  }
  if (!key.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }
  const { ext, key_ops, alg, use, ...jwk } = omitUndefinedProperties(
    await crypto.subtle.exportKey('jwk', key),
  )

  if (jwk.kty === 'AKP') {
    ;(jwk as types.JWK).alg = alg
  }

  return jwk as types.JWK
}

/**
 * Exports a public {@link !CryptoKey} or {@link !KeyObject} to a PEM-encoded SPKI string format.
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
 * @example
 *
 * ```js
 * const pkcs8Pem = await jose.exportPKCS8(privateKey)
 *
 * console.log(pkcs8Pem)
 * ```
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
 * @param key Key to export as JWK.
 */
export async function exportJWK(
  key: types.CryptoKey | types.KeyObject | Uint8Array,
): Promise<types.JWK> {
  return keyToJWK(key)
}
