import { concat, uint64be } from '../lib/buffer_utils.ts'
import type { EncryptFunction } from './interfaces.d.ts'
import checkIvLength from '../lib/check_iv_length.ts'
import checkCekLength from './check_cek_length.ts'
import crypto, { isCryptoKey } from './webcrypto.ts'
import { checkEncCryptoKey } from '../lib/crypto_key.ts'
import invalidKeyInput from '../lib/invalid_key_input.ts'
import { JOSENotSupported } from '../util/errors.ts'
import { types } from './is_key_like.ts'

async function cbcEncrypt(
  enc: string,
  plaintext: Uint8Array,
  cek: Uint8Array | CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
) {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'Uint8Array'))
  }
  const keySize = parseInt(enc.slice(1, 4), 10)
  const encKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(keySize >> 3),
    'AES-CBC',
    false,
    ['encrypt'],
  )
  const macKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(0, keySize >> 3),
    {
      hash: `SHA-${keySize << 1}`,
      name: 'HMAC',
    },
    false,
    ['sign'],
  )

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        iv,
        name: 'AES-CBC',
      },
      encKey,
      plaintext,
    ),
  )

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3))
  const tag = new Uint8Array(
    (await crypto.subtle.sign('HMAC', macKey, macData)).slice(0, keySize >> 3),
  )

  return { ciphertext, tag }
}

async function gcmEncrypt(
  enc: string,
  plaintext: Uint8Array,
  cek: Uint8Array | CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
) {
  let encKey: CryptoKey
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt'])
  } else {
    checkEncCryptoKey(cek, enc, 'encrypt')
    encKey = cek
  }

  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: aad,
        iv,
        name: 'AES-GCM',
        tagLength: 128,
      },
      encKey,
      plaintext,
    ),
  )

  const tag = encrypted.slice(-16)
  const ciphertext = encrypted.slice(0, -16)

  return { ciphertext, tag }
}

const encrypt: EncryptFunction = async (
  enc: string,
  plaintext: Uint8Array,
  cek: unknown,
  iv: Uint8Array,
  aad: Uint8Array,
) => {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, ...types, 'Uint8Array'))
  }

  checkIvLength(enc, iv)

  switch (enc) {
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      if (cek instanceof Uint8Array) checkCekLength(cek, parseInt(enc.slice(-3), 10))
      return cbcEncrypt(enc, plaintext, cek, iv, aad)
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      if (cek instanceof Uint8Array) checkCekLength(cek, parseInt(enc.slice(1, 4), 10))
      return gcmEncrypt(enc, plaintext, cek, iv, aad)
    default:
      throw new JOSENotSupported('Unsupported JWE Content Encryption Algorithm')
  }
}

export default encrypt
