import type { CryptoKey } from '../types.d.ts'
import { checkEncCryptoKey } from '../lib/crypto_key.js'

function checkKeySize(key: CryptoKey, alg: string) {
  if ((key.algorithm as AesKeyAlgorithm).length !== parseInt(alg.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg}`)
  }
}

function getCryptoKey(key: CryptoKey | Uint8Array, alg: string, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'AES-KW', true, [usage])
  }
  checkEncCryptoKey(key, alg, usage)
  return key
}

export async function wrap(alg: string, key: CryptoKey | Uint8Array, cek: Uint8Array) {
  const cryptoKey = await getCryptoKey(key, alg, 'wrapKey')

  checkKeySize(cryptoKey, alg)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.importKey(
    'raw',
    cek,
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'))
}

export async function unwrap(alg: string, key: CryptoKey | Uint8Array, encryptedKey: Uint8Array) {
  const cryptoKey = await getCryptoKey(key, alg, 'unwrapKey')

  checkKeySize(cryptoKey, alg)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.unwrapKey(
    'raw',
    encryptedKey,
    cryptoKey,
    'AES-KW',
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek))
}
