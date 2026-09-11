import type * as types from '../types.d.ts'
import { concat, uint64be } from './buffer_utils.js'
import { rawKey, invalidKeyInput, isCryptoKey } from './key.js'
import { JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import type { JWEEncryption } from './jwe_algorithms.js'

// --- CEK ---

// draft-ietf-jose-hpke-encrypt-22, Section 7.1, step 2: random CEK of the required length.
export const generateCek = (enc: JWEEncryption): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3))

export function checkCekLength(cek: Uint8Array, expected: number): void {
  const actual = cek.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}

// --- IV ---

// draft-ietf-jose-hpke-encrypt-22, Section 7.1, step 10: random IV of the required length.
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
): Promise<[encKey: CryptoKey, macKey: CryptoKey, keyLengthBits: number]> {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'Uint8Array'))
  }
  // RFC 7518, Section 5.2.2.1, step 1: MAC_KEY precedes ENC_KEY in the CEK.
  const keyLengthBits = enc.cekBits >> 1
  const encKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(keyLengthBits >> 3) as Uint8Array<ArrayBuffer>,
    'AES-CBC',
    false,
    [usage],
  )
  const macKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(0, keyLengthBits >> 3) as Uint8Array<ArrayBuffer>,
    {
      hash: `SHA-${keyLengthBits << 1}`,
      name: 'HMAC',
    },
    false,
    ['sign'],
  )
  return [encKey, macKey, keyLengthBits]
}

async function cbcHmacTag(
  macKey: CryptoKey,
  macData: Uint8Array,
  keyLengthBits: number,
): Promise<Uint8Array> {
  // RFC 7518, Section 5.2.2.1, step 5: truncate the HMAC output to T_LEN octets.
  return new Uint8Array(
    (await crypto.subtle.sign('HMAC', macKey, macData as Uint8Array<ArrayBuffer>)).slice(
      0,
      keyLengthBits >> 3,
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
  const [encKey, macKey, keyLengthBits] = await cbcKeySetup(enc, cek, 'encrypt')

  // RFC 7518, Section 5.2.2.1, step 3: AES-CBC encryption with PKCS #7 padding.
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

  // RFC 7518, Section 5.2.2.1, steps 4-5: AL encodes the bit length of AAD.
  const al = uint64be(aad.length * 8)
  const macData = concat(aad, iv, ciphertext, al)
  const tag = await cbcHmacTag(macKey, macData, keyLengthBits)

  return { ciphertext, tag, iv }
}

async function timingSafeEqual(a: Uint8Array, b: Uint8Array): Promise<boolean> {
  const algorithm = { name: 'HMAC', hash: 'SHA-256' }
  const key = (await crypto.subtle.generateKey(algorithm, false, ['sign', 'verify'])) as CryptoKey

  const aHmac = await crypto.subtle.sign(algorithm, key, a as Uint8Array<ArrayBuffer>)
  return crypto.subtle.verify(algorithm, key, aHmac, b as Uint8Array<ArrayBuffer>)
}

async function cbcDecrypt(
  enc: JWEEncryption,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const [encKey, macKey, keyLengthBits] = await cbcKeySetup(enc, cek, 'decrypt')

  // RFC 7518, Section 5.2.2.1, steps 4-5: AL encodes the bit length of AAD.
  const al = uint64be(aad.length * 8)
  const macData = concat(aad, iv, ciphertext, al)
  const expectedTag = await cbcHmacTag(macKey, macData, keyLengthBits)

  try {
    // RFC 7518, Section 5.2.2.2, steps 2-3: validate T before decrypting E.
    if (await timingSafeEqual(tag, expectedTag)) {
      return new Uint8Array(
        await crypto.subtle.decrypt(
          { iv: iv as Uint8Array<ArrayBuffer>, name: 'AES-CBC' },
          encKey,
          ciphertext as Uint8Array<ArrayBuffer>,
        ),
      )
    }
  } catch {
    //
  }
  throw new JWEDecryptionFailed()
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

  if (enc.cbc) return cbcEncrypt(enc, plaintext, cek, iv, aad)

  // RFC 7518, Section 5.3: 96-bit IV and 128-bit Authentication Tag.
  // Web Crypto returns ciphertext || tag; JWE serializes them separately.
  const encKey = await rawKey(cek, enc.subtle, 'encrypt')
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
  return { ciphertext: encrypted.subarray(0, -16), tag: encrypted.subarray(-16), iv }
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
  if (!enc.cbc && tag.length !== 16) {
    throw new JWEInvalid('Invalid Authentication Tag length')
  }

  checkIvLength(enc, iv)

  if (cek instanceof Uint8Array) {
    checkCekLength(cek, enc.cekBits)
  }

  if (enc.cbc) return cbcDecrypt(enc, cek, ciphertext, iv, tag, aad)

  // RFC 7518, Section 5.3: authenticated AES-GCM decryption.
  // Concatenate ciphertext || tag for the Web Crypto representation.
  const encKey = await rawKey(cek, enc.subtle, 'decrypt')
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
