import type { Pbes2KWDecryptFunction, Pbes2KWEncryptFunction } from '../interfaces.d'
import random from './random.js'
import { p2s as concatSalt } from '../../lib/buffer_utils.js'
import { encode as base64url } from './base64url.js'
import { wrap, unwrap } from './aeskw.js'
import checkP2s from '../../lib/check_p2s.js'
import crypto, { ensureSecureContext } from './webcrypto.js'

export const encrypt: Pbes2KWEncryptFunction = async (
  alg: string,
  key: CryptoKey | Uint8Array,
  cek: Uint8Array,
  p2c: number = Math.floor(Math.random() * 2049) + 2048,
  p2s: Uint8Array = random(new Uint8Array(16)),
) => {
  ensureSecureContext()
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.substr(13, 3), 10)
  const subtleAlg = {
    hash: `SHA-${alg.substr(8, 3)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }
  const wrapAlg = {
    length: keylen,
    name: 'AES-KW',
  }

  let cryptoKey: CryptoKey
  if (key instanceof Uint8Array) {
    cryptoKey = await crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  } else {
    cryptoKey = key
  }

  let derived: CryptoKey | Uint8Array
  if (cryptoKey.usages.includes('deriveBits')) {
    derived = new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
  } else if (cryptoKey.usages.includes('deriveKey')) {
    derived = await crypto.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['wrapKey'])
  } else {
    throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
  }

  const encryptedKey = await wrap(alg.substr(-6), derived, cek)

  return { encryptedKey, p2c, p2s: base64url(p2s) }
}

export const decrypt: Pbes2KWDecryptFunction = async (
  alg: string,
  key: CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
) => {
  ensureSecureContext()
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.substr(13, 3), 10)
  const subtleAlg = {
    hash: `SHA-${alg.substr(8, 3)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }
  const wrapAlg = {
    length: keylen,
    name: 'AES-KW',
  }

  let cryptoKey: CryptoKey
  if (key instanceof Uint8Array) {
    cryptoKey = await crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  } else {
    cryptoKey = key
  }

  let derived: CryptoKey | Uint8Array
  if (cryptoKey.usages.includes('deriveBits')) {
    derived = new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
  } else if (cryptoKey.usages.includes('deriveKey')) {
    derived = await crypto.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['unwrapKey'])
  } else {
    throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
  }

  return unwrap(alg.substr(-6), derived, encryptedKey)
}
