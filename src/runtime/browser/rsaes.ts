import type { RsaEsDecryptFunction, RsaEsEncryptFunction } from '../interfaces.d'
import subtleAlgorithm from './subtle_rsaes.js'
import bogusWebCrypto from './bogus.js'
import crypto, { ensureSecureContext } from './webcrypto.js'
import checkKeyLength from './check_key_length.js'

export const encrypt: RsaEsEncryptFunction = async (
  alg: string,
  key: CryptoKey,
  cek: Uint8Array,
) => {
  ensureSecureContext()
  checkKeyLength(alg, key)

  if (key.usages.includes('encrypt')) {
    return new Uint8Array(await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek))
  }

  if (key.usages.includes('wrapKey')) {
    // we're importing the cek to end up with CryptoKey instance that can be wrapped, the algorithm used is irrelevant
    const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, ...bogusWebCrypto)
    return new Uint8Array(
      await crypto.subtle.wrapKey('raw', cryptoKeyCek, key, subtleAlgorithm(alg)),
    )
  }

  throw new TypeError(
    'RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation',
  )
}

export const decrypt: RsaEsDecryptFunction = async (
  alg: string,
  key: CryptoKey,
  encryptedKey: Uint8Array,
) => {
  ensureSecureContext()
  checkKeyLength(alg, key)

  if (key.usages.includes('decrypt')) {
    return new Uint8Array(await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey))
  }

  if (key.usages.includes('unwrapKey')) {
    const cryptoKeyCek = await crypto.subtle.unwrapKey(
      'raw',
      encryptedKey,
      key,
      subtleAlgorithm(alg),
      ...bogusWebCrypto,
    )

    return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek))
  }

  throw new TypeError(
    'RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation',
  )
}
