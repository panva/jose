import type * as types from '../types.d.ts'
import { invalidKeyInput } from './invalid_key_input.js'
import { JWEInvalid } from '../util/errors.js'
import type { JWEContentEncryptionCapability } from './jwe_algorithm.js'
import { isCryptoKey } from './is_key_like.js'

export const generateCek = (enc: JWEContentEncryptionCapability): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3))

export function checkCekLength(cek: Uint8Array, expected: number): void {
  const actual = cek.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}

export const generateIv = (enc: JWEContentEncryptionCapability): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(enc.ivBits >> 3))

export function checkIvLength(enc: JWEContentEncryptionCapability, iv: Uint8Array): void {
  if (iv.length << 3 !== enc.ivBits) {
    throw new JWEInvalid('Invalid Initialization Vector length')
  }
}

function checkKey(cek: unknown): asserts cek is Uint8Array | types.CryptoKey {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(
      invalidKeyInput(cek, 'CryptoKey', 'KeyObject', 'Uint8Array', 'JSON Web Key'),
    )
  }
}

export async function encrypt(
  enc: JWEContentEncryptionCapability,
  plaintext: Uint8Array,
  cek: unknown,
  iv: Uint8Array | undefined,
  aad: Uint8Array,
): Promise<{ ciphertext: Uint8Array; tag: Uint8Array; iv: Uint8Array }> {
  checkKey(cek)

  if (iv) {
    checkIvLength(enc, iv)
  } else {
    iv = generateIv(enc)
  }

  if (cek instanceof Uint8Array) checkCekLength(cek, enc.cekBits)
  return enc.encrypt(plaintext, cek, iv, aad)
}

export async function decrypt(
  enc: JWEContentEncryptionCapability,
  cek: unknown,
  ciphertext: Uint8Array,
  iv: Uint8Array | undefined,
  tag: Uint8Array | undefined,
  aad: Uint8Array,
): Promise<Uint8Array> {
  checkKey(cek)
  if (!iv) throw new JWEInvalid('JWE Initialization Vector missing')
  if (!tag) throw new JWEInvalid('JWE Authentication Tag missing')
  if (enc.tagBits !== undefined && tag.length << 3 !== enc.tagBits) {
    throw new JWEInvalid('Invalid Authentication Tag length')
  }

  checkIvLength(enc, iv)
  if (cek instanceof Uint8Array) checkCekLength(cek, enc.cekBits)
  return enc.decrypt(cek, ciphertext, iv, tag, aad)
}
