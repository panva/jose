import type { AesKwUnwrapFunction, AesKwWrapFunction } from './interfaces.d.ts'
import bogusWebCrypto from './bogus.ts'
import crypto, { isCryptoKey } from './webcrypto.ts'
import { checkEncCryptoKey } from '../lib/crypto_key.ts'
import invalidKeyInput from '../lib/invalid_key_input.ts'
import { types } from './is_key_like.ts'

function checkKeySize(key: CryptoKey, alg: string) {
  if ((<AesKeyAlgorithm>key.algorithm).length !== parseInt(alg.slice(1, 4), 10)) {
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

  // we're importing the cek to end up with CryptoKey instance that can be wrapped, the algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, ...bogusWebCrypto)

  return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'))
}

export const unwrap: AesKwUnwrapFunction = async (
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
) => {
  const cryptoKey = await getCryptoKey(key, alg, 'unwrapKey')

  checkKeySize(cryptoKey, alg)

  const cryptoKeyCek = await crypto.subtle.unwrapKey(
    'raw',
    encryptedKey,
    cryptoKey,
    'AES-KW',
    ...bogusWebCrypto,
  )

  return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek))
}
