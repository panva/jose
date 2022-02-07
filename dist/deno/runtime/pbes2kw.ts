import type { Pbes2KWDecryptFunction, Pbes2KWEncryptFunction } from './interfaces.d.ts'
import random from './random.ts'
import { p2s as concatSalt } from '../lib/buffer_utils.ts'
import { encode as base64url } from './base64url.ts'
import { wrap, unwrap } from './aeskw.ts'
import checkP2s from '../lib/check_p2s.ts'
import crypto, { isCryptoKey } from './webcrypto.ts'
import { checkEncCryptoKey } from '../lib/crypto_key.ts'
import invalidKeyInput from '../lib/invalid_key_input.ts'
import { types } from './is_key_like.ts'

function getCryptoKey(key: unknown, alg: string) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  }

  if (isCryptoKey(key)) {
    checkEncCryptoKey(key, alg, 'deriveBits', 'deriveKey')
    return key
  }

  throw new TypeError(invalidKeyInput(key, ...types, 'Uint8Array'))
}

async function deriveKey(p2s: Uint8Array, alg: string, p2c: number, key: unknown) {
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.slice(13, 16), 10)
  const subtleAlg = {
    hash: `SHA-${alg.slice(8, 11)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }
  const wrapAlg = {
    length: keylen,
    name: 'AES-KW',
  }

  const cryptoKey = await getCryptoKey(key, alg)

  if (cryptoKey.usages.includes('deriveBits')) {
    return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
  }

  if (cryptoKey.usages.includes('deriveKey')) {
    return crypto.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['wrapKey', 'unwrapKey'])
  }

  throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
}

export const encrypt: Pbes2KWEncryptFunction = async (
  alg: string,
  key: unknown,
  cek: Uint8Array,
  p2c: number = Math.floor(Math.random() * 2049) + 2048,
  p2s: Uint8Array = random(new Uint8Array(16)),
) => {
  const derived = await deriveKey(p2s, alg, p2c, key)

  const encryptedKey = await wrap(alg.slice(-6), derived, cek)

  return { encryptedKey, p2c, p2s: base64url(p2s) }
}

export const decrypt: Pbes2KWDecryptFunction = async (
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
) => {
  const derived = await deriveKey(p2s, alg, p2c, key)

  return unwrap(alg.slice(-6), derived, encryptedKey)
}
