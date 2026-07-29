import { encrypt, decrypt } from './content_encryption.js'
import type { JWEEncryption } from './jwe_algorithms.js'
import { encode as b64u } from '../util/base64url.js'

export async function wrap(
  gcm: JWEEncryption,
  key: unknown,
  cek: Uint8Array,
  iv?: Uint8Array,
): Promise<{ encryptedKey: Uint8Array; iv: string; tag: string }> {
  const wrapped = await encrypt(gcm, cek, key, iv, new Uint8Array())

  return {
    encryptedKey: wrapped.ciphertext,
    iv: b64u(wrapped.iv!),
    tag: b64u(wrapped.tag!),
  }
}

export async function unwrap(
  gcm: JWEEncryption,
  key: unknown,
  encryptedKey: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
): Promise<Uint8Array> {
  return decrypt(gcm, key, encryptedKey, iv, tag, new Uint8Array())
}
