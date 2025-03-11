import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.ts'
import * as aeskw from './aeskw.ts'
import { checkEncCryptoKey } from './crypto_key.ts'
import { concat, encoder } from './buffer_utils.ts'
import { JWEInvalid } from '../util/errors.ts'

function getCryptoKey(key: types.CryptoKey | Uint8Array, alg: string) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits'])
  }

  checkEncCryptoKey(key, alg, 'deriveBits')
  return key
}

const concatSalt = (alg: string, p2sInput: Uint8Array) =>
  concat(encoder.encode(alg), new Uint8Array([0]), p2sInput)

async function deriveKey(
  p2s: Uint8Array,
  alg: string,
  p2c: number,
  key: types.CryptoKey | Uint8Array,
) {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
    throw new JWEInvalid('PBES2 Salt Input must be 8 or more octets')
  }

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

export async function wrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  p2c = 2048,
  p2s: Uint8Array = crypto.getRandomValues(new Uint8Array(16)),
) {
  const derived = await deriveKey(p2s, alg, p2c, key)

  const encryptedKey = await aeskw.wrap(alg.slice(-6), derived, cek)

  return { encryptedKey, p2c, p2s: b64u(p2s) }
}

export async function unwrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
) {
  const derived = await deriveKey(p2s, alg, p2c, key)

  return aeskw.unwrap(alg.slice(-6), derived, encryptedKey)
}
