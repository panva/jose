import type { AesKwUnwrapFunction, AesKwWrapFunction } from './interfaces.d.ts'
import crypto, { isCryptoKey } from './webcrypto.js'
import { checkEncCryptoKey } from '../lib/crypto_key.js'
import invalidKeyInput from '../lib/invalid_key_input.js'
import { types } from './is_key_like.js'

function checkKeySize(key: CryptoKey, alg: string) {
  if ((key.algorithm as AesKeyAlgorithm).length !== parseInt(alg.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg}`)
  }
}

function getCryptoKey(key: unknown, alg: string, usage: KeyUsage) {
  if (isCryptoKey(key)) {
    checkEncCryptoKey(key, alg, usage)
    return key
  }

  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'AES-KW', true, [usage])
  }

  throw new TypeError(invalidKeyInput(key, ...types, 'Uint8Array'))
}

export const wrap: AesKwWrapFunction = async (alg: string, key: unknown, cek: Uint8Array) => {
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

export const unwrap: AesKwUnwrapFunction = async (
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
) => {
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
