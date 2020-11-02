import type { AesKwUnwrapFunction, AesKwWrapFunction } from '../interfaces.d'
import bogusWebCrypto from './bogus.js'
import crypto, { ensureSecureContext } from './webcrypto.js'

function checkKeySize(key: CryptoKey, alg: string) {
  if ((key.algorithm as AesKeyAlgorithm).length !== parseInt(alg.substr(1, 3), 10)) {
    throw new TypeError(`invalid key size for alg: ${alg}`)
  }
}

export const wrap: AesKwWrapFunction = async (
  alg: string,
  key: CryptoKey | Uint8Array,
  cek: Uint8Array,
) => {
  ensureSecureContext()
  let cryptoKey: CryptoKey

  if (key instanceof Uint8Array) {
    cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-KW', true, ['wrapKey'])
  } else {
    cryptoKey = key
  }

  checkKeySize(cryptoKey, alg)

  // we're importing the cek to end up with CryptoKey instance that can be wrapped, the algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, ...bogusWebCrypto)

  return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'))
}

export const unwrap: AesKwUnwrapFunction = async (
  alg: string,
  key: CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
) => {
  ensureSecureContext()
  let cryptoKey: CryptoKey

  if (key instanceof Uint8Array) {
    cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-KW', true, ['unwrapKey'])
  } else {
    cryptoKey = key
  }

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
