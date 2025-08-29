import type * as types from '../types.d.ts'
import { checkEncCryptoKey } from './crypto_key.js'

function checkKeySize(key: types.CryptoKey, alg: string) {
  if ((key.algorithm as AesKeyAlgorithm).length !== parseInt(alg.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg}`)
  }
}

function getCryptoKey(key: types.CryptoKey | Uint8Array, alg: string, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'AES-KW', true, [usage])
  }
  checkEncCryptoKey(key, alg, usage)
  return key
}

export async function wrap(alg: string, key: types.CryptoKey | Uint8Array, cek: Uint8Array) {
  const cryptoKey = await getCryptoKey(key, alg, 'wrapKey')

  checkKeySize(cryptoKey, alg)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.importKey(
    'raw',
    cek as Uint8Array<ArrayBuffer>,
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'))
}

export async function unwrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
) {
  const cryptoKey = await getCryptoKey(key, alg, 'unwrapKey')

  checkKeySize(cryptoKey, alg)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.unwrapKey(
    'raw',
    encryptedKey as Uint8Array<ArrayBuffer>,
    cryptoKey,
    'AES-KW',
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek))
}
