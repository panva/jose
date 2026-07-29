import type * as types from '../types.d.ts'
import { concat, uint64be } from './buffer_utils.js'
import { checkEncCryptoKey } from './crypto_key.js'
import { invalidKeyInput } from './invalid_key_input.js'
import { JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import type { JWEEncryption } from './jwe_algorithms.js'
import { isCryptoKey } from './is_key_like.js'

// --- CEK ---

export const generateCek = (enc: JWEEncryption): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3))

function checkCekLength(cek: Uint8Array, expected: number) {
  const actual = cek.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}

// --- IV ---

export const generateIv = (enc: JWEEncryption): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(enc.ivBits >> 3))

export function checkIvLength(enc: JWEEncryption, iv: Uint8Array): void {
  if (iv.length << 3 !== enc.ivBits) {
    throw new JWEInvalid('Invalid Initialization Vector length')
  }
}

// --- CBC helpers ---

async function cbcKeySetup(
  enc: JWEEncryption,
  cek: Uint8Array | types.CryptoKey,
  usage: 'encrypt' | 'decrypt',
): Promise<{ encKey: CryptoKey; macKey: CryptoKey; keySize: number }> {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'Uint8Array'))
  }
  const keySize = enc.cekBits >> 1
  const encKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(keySize >> 3) as Uint8Array<ArrayBuffer>,
    'AES-CBC',
    false,
    [usage],
  )
  const macKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(0, keySize >> 3) as Uint8Array<ArrayBuffer>,
    {
      hash: `SHA-${keySize << 1}`,
      name: 'HMAC',
    },
    false,
    ['sign'],
  )
  return { encKey, macKey, keySize }
}

async function cbcHmacTag(
  macKey: CryptoKey,
  macData: Uint8Array,
  keySize: number,
): Promise<Uint8Array> {
  return new Uint8Array(
    (await crypto.subtle.sign('HMAC', macKey, macData as Uint8Array<ArrayBuffer>)).slice(
      0,
      keySize >> 3,
    ),
  )
}

// --- CBC encrypt/decrypt ---

async function cbcEncrypt(
  enc: JWEEncryption,
  plaintext: Uint8Array,
  cek: Uint8Array | types.CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
) {
  const { encKey, macKey, keySize } = await cbcKeySetup(enc, cek, 'encrypt')

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        iv: iv as Uint8Array<ArrayBuffer>,
        name: 'AES-CBC',
      },
      encKey,
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8))
  const tag = await cbcHmacTag(macKey, macData, keySize)

  return { ciphertext, tag, iv }
}

async function timingSafeEqual(a: Uint8Array, b: Uint8Array): Promise<boolean> {
  if (!(a instanceof Uint8Array)) {
    throw new TypeError('First argument must be a buffer')
  }
  if (!(b instanceof Uint8Array)) {
    throw new TypeError('Second argument must be a buffer')
  }

  const algorithm = { name: 'HMAC', hash: 'SHA-256' }
  const key = (await crypto.subtle.generateKey(algorithm, false, ['sign'])) as CryptoKey

  const aHmac = new Uint8Array(
    await crypto.subtle.sign(algorithm, key, a as Uint8Array<ArrayBuffer>),
  )
  const bHmac = new Uint8Array(
    await crypto.subtle.sign(algorithm, key, b as Uint8Array<ArrayBuffer>),
  )

  let out = 0
  let i = -1
  while (++i < 32) {
    out |= aHmac[i] ^ bHmac[i]
  }

  return out === 0
}

async function cbcDecrypt(
  enc: JWEEncryption,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const { encKey, macKey, keySize } = await cbcKeySetup(enc, cek, 'decrypt')

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8))
  const expectedTag = await cbcHmacTag(macKey, macData, keySize)

  let macCheckPassed!: boolean
  try {
    macCheckPassed = await timingSafeEqual(tag, expectedTag)
  } catch {
    //
  }
  if (!macCheckPassed) {
    throw new JWEDecryptionFailed()
  }

  let plaintext!: Uint8Array
  try {
    plaintext = new Uint8Array(
      await crypto.subtle.decrypt(
        { iv: iv as Uint8Array<ArrayBuffer>, name: 'AES-CBC' },
        encKey,
        ciphertext as Uint8Array<ArrayBuffer>,
      ),
    )
  } catch {
    //
  }
  if (!plaintext) {
    throw new JWEDecryptionFailed()
  }

  return plaintext
}

// --- GCM encrypt/decrypt ---

async function gcmEncrypt(
  enc: JWEEncryption,
  plaintext: Uint8Array,
  cek: Uint8Array | types.CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
) {
  let encKey: types.CryptoKey
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey(
      'raw',
      cek as Uint8Array<ArrayBuffer>,
      'AES-GCM',
      false,
      ['encrypt'],
    )
  } else {
    checkEncCryptoKey(cek, enc.enc, 'encrypt')
    encKey = cek
  }

  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: aad as Uint8Array<ArrayBuffer>,
        iv: iv as Uint8Array<ArrayBuffer>,
        name: 'AES-GCM',
        tagLength: 128,
      },
      encKey,
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )

  const tag = encrypted.slice(-16)
  const ciphertext = encrypted.slice(0, -16)

  return { ciphertext, tag, iv }
}

async function gcmDecrypt(
  enc: JWEEncryption,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  let encKey: types.CryptoKey
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey(
      'raw',
      cek as Uint8Array<ArrayBuffer>,
      'AES-GCM',
      false,
      ['decrypt'],
    )
  } else {
    checkEncCryptoKey(cek, enc.enc, 'decrypt')
    encKey = cek
  }

  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          additionalData: aad as Uint8Array<ArrayBuffer>,
          iv: iv as Uint8Array<ArrayBuffer>,
          name: 'AES-GCM',
          tagLength: 128,
        },
        encKey,
        concat(ciphertext, tag) as Uint8Array<ArrayBuffer>,
      ),
    )
  } catch {
    throw new JWEDecryptionFailed()
  }
}

// --- Public API ---

export async function encrypt(
  enc: JWEEncryption,
  plaintext: Uint8Array,
  cek: unknown,
  iv: Uint8Array | undefined,
  aad: Uint8Array,
): Promise<{
  ciphertext: Uint8Array
  tag: Uint8Array | undefined
  iv: Uint8Array | undefined
}> {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(
      invalidKeyInput(cek, 'CryptoKey', 'KeyObject', 'Uint8Array', 'JSON Web Key'),
    )
  }

  if (iv) {
    checkIvLength(enc, iv)
  } else {
    iv = generateIv(enc)
  }

  if (cek instanceof Uint8Array) {
    checkCekLength(cek, enc.cekBits)
  }

  return enc.cbc
    ? cbcEncrypt(enc, plaintext, cek, iv, aad)
    : gcmEncrypt(enc, plaintext, cek, iv, aad)
}

export async function decrypt(
  enc: JWEEncryption,
  cek: unknown,
  ciphertext: Uint8Array,
  iv: Uint8Array | undefined,
  tag: Uint8Array | undefined,
  aad: Uint8Array,
): Promise<Uint8Array> {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(
      invalidKeyInput(cek, 'CryptoKey', 'KeyObject', 'Uint8Array', 'JSON Web Key'),
    )
  }

  if (!iv) {
    throw new JWEInvalid('JWE Initialization Vector missing')
  }
  if (!tag) {
    throw new JWEInvalid('JWE Authentication Tag missing')
  }

  checkIvLength(enc, iv)

  if (cek instanceof Uint8Array) {
    checkCekLength(cek, enc.cekBits)
  }

  return enc.cbc
    ? cbcDecrypt(enc, cek, ciphertext, iv, tag, aad)
    : gcmDecrypt(enc, cek, ciphertext, iv, tag, aad)
}
