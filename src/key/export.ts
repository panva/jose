/**
 * Cryptographic key export functions
 *
 * @module
 */

import { toSPKI as exportPublic, toPKCS8 as exportPrivate } from '../lib/asn1.js'
import { invalidKeyInput, isCryptoKey, isKeyObject } from '../lib/key.js'
import { encode as b64u } from '../util/base64url.js'

import type * as types from '../types.d.ts'

interface ExtractableKeyObject extends types.KeyObject {
  export(arg: { format: 'jwk' }): types.JWK
  export(): Uint8Array
}

/**
 * Exports a public key to PEM-encoded SPKI. CryptoKey inputs must be extractable.
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
 * @param key Key to export.
 */
export function exportSPKI(key: types.CryptoKey | types.KeyObject): Promise<string> {
  return exportPublic(key)
}

/**
 * Exports a private key to PEM-encoded PKCS#8. CryptoKey inputs must be extractable.
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
 * @param key Key to export.
 */
export function exportPKCS8(key: types.CryptoKey | types.KeyObject): Promise<string> {
  return exportPrivate(key)
}

/**
 * Exports a key to JWK. CryptoKey inputs must be extractable.
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
 * @param key Key to export.
 */
export async function exportJWK(
  key: types.CryptoKey | types.KeyObject | Uint8Array,
): Promise<types.JWK> {
  if (isKeyObject<ExtractableKeyObject>(key)) {
    if (key.type === 'secret') {
      key = key.export()
    } else {
      return key.export({ format: 'jwk' })
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
  const jwk = (await crypto.subtle.exportKey('jwk', key)) as types.JWK
  delete jwk.ext
  delete jwk.key_ops
  delete jwk.use
  if (jwk.kty !== 'AKP') delete jwk.alg
  for (const parameter of Object.keys(jwk) as (keyof types.JWK)[]) {
    if (jwk[parameter] === undefined) delete jwk[parameter]
  }
  return jwk
}
