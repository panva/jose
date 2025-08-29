import type * as types from '../types.d.ts'
import { checkEncCryptoKey } from './crypto_key.js'
import { checkKeyLength } from './check_key_length.js'
import { JOSENotSupported } from '../util/errors.js'

const subtleAlgorithm = (alg: string) => {
  switch (alg) {
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      return 'RSA-OAEP'
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}

export async function encrypt(alg: string, key: types.CryptoKey, cek: Uint8Array) {
  checkEncCryptoKey(key, alg, 'encrypt')
  checkKeyLength(alg, key)

  return new Uint8Array(await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek))
}

export async function decrypt(alg: string, key: types.CryptoKey, encryptedKey: Uint8Array) {
  checkEncCryptoKey(key, alg, 'decrypt')
  checkKeyLength(alg, key)

  return new Uint8Array(await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey))
}
