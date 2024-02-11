import encrypt from '../runtime/encrypt.ts'
import decrypt from '../runtime/decrypt.ts'
import generateIv from './iv.ts'
import { encode as base64url } from '../runtime/base64url.ts'

export async function wrap(alg: string, key: unknown, cek: Uint8Array, iv?: Uint8Array) {
  const jweAlgorithm = alg.slice(0, 7)
  iv ||= generateIv(jweAlgorithm)

  const { ciphertext: encryptedKey, tag } = await encrypt(
    jweAlgorithm,
    cek,
    key,
    iv,
    new Uint8Array(0),
  )

  return { encryptedKey, iv: base64url(iv), tag: base64url(tag) }
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
