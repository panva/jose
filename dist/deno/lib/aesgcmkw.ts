import encrypt from './encrypt.ts'
import decrypt from './decrypt.ts'
import { encode as base64url } from '../lib/base64url.ts'

export async function wrap(alg: string, key: unknown, cek: Uint8Array, iv?: Uint8Array) {
  const jweAlgorithm = alg.slice(0, 7)

  const wrapped = await encrypt(jweAlgorithm, cek, key, iv, new Uint8Array(0))

  return {
    encryptedKey: wrapped.ciphertext,
    iv: base64url(wrapped.iv!),
    tag: base64url(wrapped.tag!),
  }
}

export async function unwrap(
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
) {
  const jweAlgorithm = alg.slice(0, 7)
  return decrypt(jweAlgorithm, key, encryptedKey, iv, tag, new Uint8Array(0))
}
