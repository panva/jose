import type { CryptoKey } from '../types.d.ts'
import subtleAlgorithm from './subtle_rsaes.js'
import { checkEncCryptoKey } from '../lib/crypto_key.js'
import checkKeyLength from './check_key_length.js'

export async function encrypt(alg: string, key: CryptoKey, cek: Uint8Array) {
  checkEncCryptoKey(key, alg, 'encrypt')
  checkKeyLength(alg, key)

  return new Uint8Array(await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek))
}

export async function decrypt(alg: string, key: CryptoKey, encryptedKey: Uint8Array) {
  checkEncCryptoKey(key, alg, 'decrypt')
  checkKeyLength(alg, key)

  return new Uint8Array(await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey))
}
