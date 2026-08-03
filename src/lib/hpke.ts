import type * as types from '../types.d.ts'
import type { JWEIntegratedEncryptionAlgorithm } from './jwe_algorithms.js'
import { JOSENotSupported, JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import { checkCryptoKey } from './crypto_key.js'
import { concat, encode } from './buffer_utils.js'

type HPKEKem = 'MLKEM768-X25519' | 'ML-KEM-768' | 'ML-KEM-1024'
type HPKESuite = readonly [kemId: number, kdfId: number, aeadId: number, nEnc: number]

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

function suiteId(suite: HPKESuite): Uint8Array {
  const [kemId, kdfId, aeadId] = suite
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
function checkHPKEHeaders(
  alg: string,
  protectedHeader: types.JWEHeaderParameters | undefined,
  joseHeader: types.JWEHeaderParameters,
): void {
  if (protectedHeader?.alg !== alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.')
  }

  if (joseHeader.ek !== undefined) {
    throw new JWEInvalid('JWE "ek" Header Parameter must not be present')
  }

  if (joseHeader.psk_id !== undefined) {
    throw new JOSENotSupported('JWE HPKE PSK mode is not supported')
  }
}

async function seal(
  subtle: Algorithm,
  suite: HPKESuite,
  publicKey: types.CryptoKey,
  plaintext: Uint8Array,
  aad: Uint8Array,
): Promise<[encryptedKey: Uint8Array, ciphertext: Uint8Array]> {
  checkCryptoKey(publicKey, subtle, 'encapsulateBits' as KeyUsage)

  const { sharedKey, ciphertext: enc } = await (
    crypto.subtle as ModernSubtleCrypto
  ).encapsulateBits(subtle, publicKey)
  const [key, baseNonce] = await keySchedule(suiteId(suite), new Uint8Array(sharedKey))

  const ciphertext = await crypto.subtle.encrypt(
    aeadParams(baseNonce, aad),
    await aeadKey(key),
    plaintext as Uint8Array<ArrayBuffer>,
  )

  return [new Uint8Array(enc), new Uint8Array(ciphertext)]
}

async function open(
  subtle: Algorithm,
  suite: HPKESuite,
  privateKey: types.CryptoKey,
  encryptedKey: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  checkCryptoKey(privateKey, subtle, 'decapsulateBits' as KeyUsage)

  if (encryptedKey.byteLength !== suite[3]) {
    throw new JWEDecryptionFailed()
  }

  try {
    const sharedSecret = new Uint8Array(
      await (crypto.subtle as ModernSubtleCrypto).decapsulateBits(
        subtle,
        privateKey,
        encryptedKey as Uint8Array<ArrayBuffer>,
      ),
    )
    const [key, baseNonce] = await keySchedule(suiteId(suite), sharedSecret)

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

const usages: [KeyUsage[], KeyUsage[]] = [
  ['encapsulateBits' as KeyUsage],
  ['decapsulateBits' as KeyUsage],
]

/** Creates one concrete post-quantum HPKE Integrated Encryption algorithm entry. */
export function hpke(
  alg: string,
  name: HPKEKem,
  suite: HPKESuite,
): JWEIntegratedEncryptionAlgorithm {
  const subtle = { name }
  return {
    alg,
    kty: ['AKP'],
    mode: 'integrated-encryption',
    subtle,
    jwkAlg: name,
    usages,
    ops: ['encapsulateBits', 'decapsulateBits'],
    async encrypt(key, plaintext, aad, protectedHeader, joseHeader) {
      checkHPKEHeaders(alg, protectedHeader, joseHeader)
      if (key instanceof Uint8Array) {
        throw new TypeError('HPKE requires a CryptoKey')
      }
      return seal(subtle, suite, key, plaintext, aad)
    },
    async decrypt(key, encryptedKey, ciphertext, aad, protectedHeader, joseHeader) {
      checkHPKEHeaders(alg, protectedHeader, joseHeader)
      if (key instanceof Uint8Array) {
        throw new TypeError('HPKE requires a CryptoKey')
      }
      if (encryptedKey === undefined) {
        throw new JWEDecryptionFailed()
      }
      return open(subtle, suite, key, encryptedKey, ciphertext, aad)
    },
  }
}
