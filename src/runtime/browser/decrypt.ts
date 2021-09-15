import { concat, uint64be } from '../../lib/buffer_utils.js'

import type { DecryptFunction } from '../interfaces.d'
import checkIvLength from '../../lib/check_iv_length.js'
import checkCekLength from './check_cek_length.js'
import timingSafeEqual from './timing_safe_equal.js'
import { JOSENotSupported, JWEDecryptionFailed } from '../../util/errors.js'
import crypto, { isCryptoKey } from './webcrypto.js'
import invalidKeyInput from './invalid_key_input.js'

async function cbcDecrypt(
  enc: string,
  cek: Uint8Array,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const keySize = parseInt(enc.substr(1, 3), 10)
  const encKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(keySize >> 3),
    'AES-CBC',
    false,
    ['decrypt'],
  )
  const macKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(0, keySize >> 3),
    {
      hash: { name: `SHA-${keySize << 1}` },
      name: 'HMAC',
    },
    false,
    ['sign'],
  )

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3))
  const expectedTag = new Uint8Array(
    (await crypto.subtle.sign('HMAC', macKey, macData)).slice(0, keySize >> 3),
  )

  let macCheckPassed!: boolean
  try {
    macCheckPassed = timingSafeEqual(tag, expectedTag)
  } catch {
    //
  }
  if (!macCheckPassed) {
    throw new JWEDecryptionFailed()
  }

  let plaintext!: Uint8Array
  try {
    plaintext = new Uint8Array(
      // @deno-expect-error
      await crypto.subtle.decrypt({ iv, name: 'AES-CBC' }, encKey, ciphertext),
    )
  } catch {
    //
  }
  if (!plaintext) {
    throw new JWEDecryptionFailed()
  }

  return plaintext
}

async function gcmDecrypt(
  cek: Uint8Array | CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const encKey =
    cek instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt'])
      : cek

  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          // @deno-expect-error
          additionalData: aad,
          iv,
          name: 'AES-GCM',
          tagLength: 128,
        },
        encKey,
        concat(ciphertext, tag),
      ),
    )
  } catch {
    throw new JWEDecryptionFailed()
  }
}

const decrypt: DecryptFunction = async (
  enc: string,
  cek: unknown,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) => {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'CryptoKey', 'Uint8Array'))
  }

  checkCekLength(enc, cek)
  checkIvLength(enc, iv)

  switch (enc) {
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return cbcDecrypt(enc, <Uint8Array>cek, ciphertext, iv, tag, aad)
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      return gcmDecrypt(cek, ciphertext, iv, tag, aad)
    default:
      throw new JOSENotSupported('Unsupported JWE Content Encryption Algorithm')
  }
}

export default decrypt
