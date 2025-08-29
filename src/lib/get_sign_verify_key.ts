import type * as types from '../types.d.ts'
import { checkSigCryptoKey } from './crypto_key.js'
import { invalidKeyInput } from './invalid_key_input.js'

export async function getSigKey(alg: string, key: types.CryptoKey | Uint8Array, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'JSON Web Key'))
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: `SHA-${alg.slice(-3)}`, name: 'HMAC' },
      false,
      [usage],
    )
  }

  checkSigCryptoKey(key, alg, usage)
  return key
}
