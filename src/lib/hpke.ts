import type * as types from '../types.d.ts'
import type { JWEAlgorithm } from './jwe_algorithms.js'
import { JOSENotSupported, JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import { checkCryptoKey } from './crypto_key.js'
import { concat, encode } from './buffer_utils.js'

interface ModernSubtleCrypto extends SubtleCrypto {
  encapsulateBits: (
    encapsulationAlgorithm: AlgorithmIdentifier,
    encapsulationKey: CryptoKey,
  ) => Promise<{ sharedKey: ArrayBuffer; ciphertext: ArrayBuffer }>
  decapsulateBits: (
    decapsulationAlgorithm: AlgorithmIdentifier,
    decapsulationKey: CryptoKey,
    ciphertext: BufferSource,
  ) => Promise<ArrayBuffer>
}

const L_HPKE = encode('HPKE')
const L_HPKE_V1 = encode('HPKE-v1')
const L_SECRET = encode('secret')

const EMPTY = new Uint8Array()

/** Nk, Nn, and Nh: an AES-256-GCM key and nonce, and the SHAKE256 output every suite derives. */
const N_K = 32
const N_N = 12
const N_H = 64

function i2osp(n: number, w: number): Uint8Array {
  const ret = new Uint8Array(w)
  for (let i = 0; i < w; i++) {
    ret[w - (i + 1)] = n & 0xff
    n >>>= 8
  }
  return ret
}

function lengthPrefixed(input: Uint8Array): Uint8Array {
  return concat(i2osp(input.byteLength, 2), input)
}

function suiteId(entry: JWEAlgorithm): Uint8Array {
  const [kemId, kdfId, aeadId] = entry.hpke!
  return concat(L_HPKE, i2osp(kemId, 2), i2osp(kdfId, 2), i2osp(aeadId, 2))
}

async function labeledDerive(
  suiteId: Uint8Array,
  ikm: Uint8Array,
  label: Uint8Array,
  context: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  const bits = length << 3
  return new Uint8Array(
    await crypto.subtle.digest(
      { name: 'cSHAKE256', outputLength: bits } as AlgorithmIdentifier,
      concat(
        ikm,
        L_HPKE_V1,
        suiteId,
        lengthPrefixed(label),
        i2osp(length, 2),
        context,
      ) as Uint8Array<ArrayBuffer>,
    ),
  )
}

async function keySchedule(
  suiteId: Uint8Array,
  sharedSecret: Uint8Array,
): Promise<[key: Uint8Array, baseNonce: Uint8Array]> {
  const secret = await labeledDerive(
    suiteId,
    concat(lengthPrefixed(EMPTY), lengthPrefixed(sharedSecret)),
    L_SECRET,
    concat(i2osp(0, 1), lengthPrefixed(EMPTY), lengthPrefixed(EMPTY)),
    N_K + N_N + N_H,
  )

  return [secret.slice(0, N_K), secret.slice(N_K, N_K + N_N)]
}

async function aeadKey(key: Uint8Array) {
  return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ])
}

function aeadParams(nonce: Uint8Array, aad: Uint8Array): AesGcmParams {
  return {
    name: 'AES-GCM',
    iv: nonce as Uint8Array<ArrayBuffer>,
    additionalData: aad as Uint8Array<ArrayBuffer>,
  }
}

/**
 * Header rules an integrated JWE must satisfy in either direction. The "alg" fixes the whole suite,
 * so none of it may be left unprotected and no separate content encryption is named.
 */
export function checkHPKEHeaders(
  alg: string,
  protectedAlg: unknown,
  joseHeader: types.JWEHeaderParameters,
): void {
  if (protectedAlg !== alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.')
  }

  if (joseHeader.enc !== undefined) {
    throw new JWEInvalid(
      'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    )
  }

  if (joseHeader.ek !== undefined) {
    throw new JWEInvalid('JWE "ek" Header Parameter must not be present')
  }

  if (joseHeader.psk_id !== undefined) {
    throw new JOSENotSupported('JWE HPKE PSK mode is not supported')
  }
}

export async function seal(
  entry: JWEAlgorithm,
  publicKey: types.CryptoKey,
  plaintext: Uint8Array,
  aad: Uint8Array,
): Promise<[encryptedKey: Uint8Array, ciphertext: Uint8Array]> {
  checkCryptoKey(publicKey, entry.subtle, entry.usages[0][0])

  const { sharedKey, ciphertext: enc } = await (
    crypto.subtle as ModernSubtleCrypto
  ).encapsulateBits(entry.subtle, publicKey)
  const [key, baseNonce] = await keySchedule(suiteId(entry), new Uint8Array(sharedKey))

  const ciphertext = await crypto.subtle.encrypt(
    aeadParams(baseNonce, aad),
    await aeadKey(key),
    plaintext as Uint8Array<ArrayBuffer>,
  )

  return [new Uint8Array(enc), new Uint8Array(ciphertext)]
}

export async function open(
  entry: JWEAlgorithm,
  privateKey: types.CryptoKey,
  encryptedKey: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  checkCryptoKey(privateKey, entry.subtle, entry.usages[1][0])

  if (encryptedKey.byteLength !== entry.hpke![3]) {
    throw new JWEDecryptionFailed()
  }

  let sharedSecret: Uint8Array
  try {
    sharedSecret = new Uint8Array(
      await (crypto.subtle as ModernSubtleCrypto).decapsulateBits(
        entry.subtle,
        privateKey,
        encryptedKey as Uint8Array<ArrayBuffer>,
      ),
    )
  } catch (cause) {
    if (cause instanceof TypeError) {
      throw cause
    }
    throw new JWEDecryptionFailed(undefined, { cause })
  }

  const [key, baseNonce] = await keySchedule(suiteId(entry), sharedSecret)

  try {
    const plaintext = await crypto.subtle.decrypt(
      aeadParams(baseNonce, aad),
      await aeadKey(key),
      ciphertext as Uint8Array<ArrayBuffer>,
    )
    return new Uint8Array(plaintext)
  } catch (cause) {
    throw new JWEDecryptionFailed(undefined, { cause })
  }
}
