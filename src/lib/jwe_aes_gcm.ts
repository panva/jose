import type * as types from '../types.d.ts'
import { JWEDecryptionFailed } from '../util/errors.js'
import { concat } from './buffer_utils.js'
import { checkCryptoKey } from './crypto_key.js'
import type { KeyDescriptor } from './key_descriptor.js'

export async function encryptGCM(
  descriptor: KeyDescriptor,
  plaintext: Uint8Array,
  cek: Uint8Array | types.CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
): Promise<{ ciphertext: Uint8Array; tag: Uint8Array; iv: Uint8Array }> {
  const key =
    cek instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', cek as Uint8Array<ArrayBuffer>, 'AES-GCM', false, [
          'encrypt',
        ])
      : (checkCryptoKey(cek, descriptor.subtle, 'encrypt'), cek)

  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: aad as Uint8Array<ArrayBuffer>,
        iv: iv as Uint8Array<ArrayBuffer>,
        name: 'AES-GCM',
        tagLength: 128,
      },
      key,
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )
  return { ciphertext: encrypted.slice(0, -16), tag: encrypted.slice(-16), iv }
}

export async function decryptGCM(
  descriptor: KeyDescriptor,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  const key =
    cek instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', cek as Uint8Array<ArrayBuffer>, 'AES-GCM', false, [
          'decrypt',
        ])
      : (checkCryptoKey(cek, descriptor.subtle, 'decrypt'), cek)

  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          additionalData: aad as Uint8Array<ArrayBuffer>,
          iv: iv as Uint8Array<ArrayBuffer>,
          name: 'AES-GCM',
          tagLength: 128,
        },
        key,
        concat(ciphertext, tag) as Uint8Array<ArrayBuffer>,
      ),
    )
  } catch {
    throw new JWEDecryptionFailed()
  }
}
