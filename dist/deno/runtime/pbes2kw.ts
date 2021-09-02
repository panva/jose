import type { Pbes2KWDecryptFunction, Pbes2KWEncryptFunction } from './interfaces.d.ts'
import random from './random.ts'
import { p2s as concatSalt } from '../lib/buffer_utils.ts'
import { encode as base64url } from './base64url.ts'
import { wrap, unwrap } from './aeskw.ts'
import checkP2s from '../lib/check_p2s.ts'
import crypto, { isCryptoKey } from './webcrypto.ts'
import invalidKeyInput from './invalid_key_input.ts'

function getCryptoKey(key: unknown) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  }

  if (isCryptoKey(key)) {
    return key
  }

  throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'Uint8Array'))
}

export const encrypt: Pbes2KWEncryptFunction = async (
  alg: string,
  key: unknown,
  cek: Uint8Array,
  p2c: number = Math.floor(Math.random() * 2049) + 2048,
  p2s: Uint8Array = random(new Uint8Array(16)),
) => {
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.substr(13, 3), 10)
  const subtleAlg = {
    hash: { name: `SHA-${alg.substr(8, 3)}` },
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }
  const wrapAlg = {
    length: keylen,
    name: 'AES-KW',
  }

  const cryptoKey = await getCryptoKey(key)

  let derived: CryptoKey | Uint8Array
  if (cryptoKey.usages.includes('deriveBits')) {
    // @ts-ignore
    derived = new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
  } else if (cryptoKey.usages.includes('deriveKey')) {
    // @ts-ignore
    derived = await crypto.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['wrapKey'])
  } else {
    throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
  }

  const encryptedKey = await wrap(alg.substr(-6), derived, cek)

  return { encryptedKey, p2c, p2s: base64url(p2s) }
}

export const decrypt: Pbes2KWDecryptFunction = async (
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
) => {
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.substr(13, 3), 10)
  const subtleAlg = {
    hash: { name: `SHA-${alg.substr(8, 3)}` },
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }
  const wrapAlg = {
    length: keylen,
    name: 'AES-KW',
  }

  const cryptoKey = await getCryptoKey(key)

  let derived: CryptoKey | Uint8Array
  if (cryptoKey.usages.includes('deriveBits')) {
    // @ts-ignore
    derived = new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
  } else if (cryptoKey.usages.includes('deriveKey')) {
    // @ts-ignore
    derived = await crypto.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['unwrapKey'])
  } else {
    throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
  }

  return unwrap(alg.substr(-6), derived, encryptedKey)
}
