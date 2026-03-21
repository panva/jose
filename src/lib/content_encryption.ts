import type * as types from '../types.d.ts'
import { concat, uint64be } from './buffer_utils.js'
import { checkEncCryptoKey } from './crypto_key.js'
import { invalidKeyInput } from './invalid_key_input.js'
import { JOSENotSupported, JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import { isCryptoKey } from './is_key_like.js'

// --- CEK ---

export function cekLength(alg: string) {
  switch (alg) {
    case 'A128GCM':
      return 128
    case 'A192GCM':
      return 192
    case 'A256GCM':
    case 'A128CBC-HS256':
      return 256
    case 'A192CBC-HS384':
      return 384
    case 'A256CBC-HS512':
      return 512
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }
}

export const generateCek = (alg: string): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(cekLength(alg) >> 3))

function checkCekLength(cek: Uint8Array, expected: number) {
  const actual = cek.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}

// --- IV ---

function ivBitLength(alg: string) {
  switch (alg) {
    case 'A128GCM':
    case 'A128GCMKW':
    case 'A192GCM':
    case 'A192GCMKW':
    case 'A256GCM':
    case 'A256GCMKW':
      return 96
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return 128
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }
}

export const generateIv = (alg: string): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(ivBitLength(alg) >> 3))

export function checkIvLength(enc: string, iv: Uint8Array) {
  if (iv.length << 3 !== ivBitLength(enc)) {
    throw new JWEInvalid('Invalid Initialization Vector length')
  }
}

// --- CBC helpers ---

async function cbcKeySetup(
  enc: string,
  cek: Uint8Array | types.CryptoKey,
  usage: 'encrypt' | 'decrypt',
): Promise<{ encKey: CryptoKey; macKey: CryptoKey; keySize: number }> {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'Uint8Array'))
  }
  const keySize = parseInt(enc.slice(1, 4), 10)
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
  enc: string,
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

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3))
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
  enc: string,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const { encKey, macKey, keySize } = await cbcKeySetup(enc, cek, 'decrypt')

  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3))
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

// --- AEAD encrypt/decrypt ---

export async function aeadEncrypt(
  algorithm: string,
  key: CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
  plaintext: Uint8Array,
) {
  return new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: algorithm,
        iv: iv as Uint8Array<ArrayBuffer>,
        additionalData: aad as Uint8Array<ArrayBuffer>,
      },
      key,
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )
}

export async function aeadDecrypt(
  algorithm: string,
  key: CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
  ciphertext: Uint8Array,
) {
  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: algorithm,
        iv: iv as Uint8Array<ArrayBuffer>,
        additionalData: aad as Uint8Array<ArrayBuffer>,
      },
      key,
      ciphertext as Uint8Array<ArrayBuffer>,
    ),
  )
}

// --- GCM encrypt/decrypt ---

async function gcmEncrypt(
  enc: string,
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
    checkEncCryptoKey(cek, enc, 'encrypt')
    encKey = cek
  }

  const encrypted = await aeadEncrypt('AES-GCM', encKey, iv, aad, plaintext)

  const tag = encrypted.slice(-16)
  const ciphertext = encrypted.slice(0, -16)

  return { ciphertext, tag, iv }
}

async function gcmDecrypt(
  enc: string,
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
    checkEncCryptoKey(cek, enc, 'decrypt')
    encKey = cek
  }

  try {
    return await aeadDecrypt('AES-GCM', encKey, iv, aad, concat(ciphertext, tag))
  } catch {
    throw new JWEDecryptionFailed()
  }
}

// --- Public API ---

const unsupportedEnc = 'Unsupported JWE Content Encryption Algorithm'

export async function encrypt(
  enc: string,
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

  switch (enc) {
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      if (cek instanceof Uint8Array) {
        checkCekLength(cek, parseInt(enc.slice(-3), 10))
      }
      return cbcEncrypt(enc, plaintext, cek, iv, aad)
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      if (cek instanceof Uint8Array) {
        checkCekLength(cek, parseInt(enc.slice(1, 4), 10))
      }
      return gcmEncrypt(enc, plaintext, cek, iv, aad)
    default:
      throw new JOSENotSupported(unsupportedEnc)
  }
}

export async function decrypt(
  enc: string,
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

  switch (enc) {
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      if (cek instanceof Uint8Array) checkCekLength(cek, parseInt(enc.slice(-3), 10))
      return cbcDecrypt(enc, cek, ciphertext, iv, tag, aad)
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      if (cek instanceof Uint8Array) checkCekLength(cek, parseInt(enc.slice(1, 4), 10))
      return gcmDecrypt(enc, cek, ciphertext, iv, tag, aad)
    default:
      throw new JOSENotSupported(unsupportedEnc)
  }
}
