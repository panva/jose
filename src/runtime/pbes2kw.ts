import random from './random.js'
import { p2s as concatSalt } from '../lib/buffer_utils.js'
import { encode as base64url } from './base64url.js'
import { wrap, unwrap } from './aeskw.js'
import checkP2s from '../lib/check_p2s.js'
import { checkEncCryptoKey } from '../lib/crypto_key.js'

function getCryptoKey(key: CryptoKey | Uint8Array, alg: string) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  }

  checkEncCryptoKey(key, alg, 'deriveBits')
  return key
}

async function deriveKey(p2s: Uint8Array, alg: string, p2c: number, key: CryptoKey | Uint8Array) {
  checkP2s(p2s)

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.slice(13, 16), 10)
  const subtleAlg = {
    hash: `SHA-${alg.slice(8, 11)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }

  const cryptoKey = await getCryptoKey(key, alg)

  return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
}

export async function encrypt(
  alg: string,
  key: CryptoKey | Uint8Array,
  cek: Uint8Array,
  p2c = 2048,
  p2s: Uint8Array = random(new Uint8Array(16)),
) {
  const derived = await deriveKey(p2s, alg, p2c, key)

  const encryptedKey = await wrap(alg.slice(-6), derived, cek)

  return { encryptedKey, p2c, p2s: base64url(p2s) }
}

export async function decrypt(
  alg: string,
  key: CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
) {
  const derived = await deriveKey(p2s, alg, p2c, key)

  return unwrap(alg.slice(-6), derived, encryptedKey)
}
