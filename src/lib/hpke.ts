import type * as types from '../types.d.ts'
import { JOSENotSupported, JWEDecryptionFailed } from '../util/errors.js'
import { concat, encode } from './buffer_utils.js'

type KDF = 'HKDF-SHA256' | 'HKDF-SHA384'
type AEAD = 'AES-128-GCM' | 'AES-256-GCM' | 'ChaCha20Poly1305'

interface Suite {
  kem: {
    id: number
    type: 'dh'
    algorithm: EcKeyAlgorithm | KeyAlgorithm
    nSecret: number
    nEnc: number
    nDh?: number
  }
  kdf: {
    id: number
    name: KDF
    nH: number
  }
  aead: {
    id: number
    name: AEAD
    algorithm: string
    keyFormat: KeyFormat
    nK: number
    nN: number
  }
  id: Uint8Array
  kemId: Uint8Array
}

interface ModernSubtleCrypto extends SubtleCrypto {
  getPublicKey?: (key: CryptoKey, keyUsages: KeyUsage[]) => Promise<CryptoKey>
}

const L_HPKE = encode('HPKE')
const L_HPKE_V1 = encode('HPKE-v1')
const L_KEM = encode('KEM')
const L_EAE_PRK = encode('eae_prk')
const L_SHARED_SECRET = encode('shared_secret')
const L_PSK_ID_HASH = encode('psk_id_hash')
const L_INFO_HASH = encode('info_hash')
const L_SECRET = encode('secret')
const L_KEY = encode('key')
const L_BASE_NONCE = encode('base_nonce')

const EMPTY = new Uint8Array()

const HPKE_ALGS = new Set(['HPKE-0', 'HPKE-1', 'HPKE-3', 'HPKE-4', 'HPKE-7'])

export function isIntegratedEncryption(alg: string): boolean {
  return HPKE_ALGS.has(alg)
}

export function keyAlgorithm(alg: string): EcKeyAlgorithm | KeyAlgorithm {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-7':
      return { name: 'ECDH', namedCurve: 'P-256' }
    case 'HPKE-1':
      return { name: 'ECDH', namedCurve: 'P-384' }
    case 'HPKE-3':
    case 'HPKE-4':
      return { name: 'X25519' }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }
}

export function publicKeyUsages(alg: string): KeyUsage[] {
  keyAlgorithm(alg)
  return []
}

export function privateKeyUsages(alg: string): KeyUsage[] {
  keyAlgorithm(alg)
  return ['deriveBits']
}

function i2osp(n: number, w: number): Uint8Array {
  const ret = new Uint8Array(w)
  for (let i = 0; i < w; i++) {
    ret[w - (i + 1)] = n & 0xff
    n >>>= 8
  }
  return ret
}

function suiteId(kemId: number, kdfId: number, aeadId: number): Uint8Array {
  return concat(L_HPKE, i2osp(kemId, 2), i2osp(kdfId, 2), i2osp(aeadId, 2))
}

function dhSuite(
  kemId: number,
  algorithm: EcKeyAlgorithm | KeyAlgorithm,
  nSecret: number,
  nEnc: number,
  nDh: number,
  kdf: KDF,
  aead: AEAD,
): Suite {
  const kdfId = kdf === 'HKDF-SHA384' ? 0x0002 : 0x0001
  const nH = kdf === 'HKDF-SHA384' ? 48 : 32
  const aeadId = aead === 'AES-128-GCM' ? 0x0001 : aead === 'AES-256-GCM' ? 0x0002 : 0x0003
  return {
    kem: { id: kemId, type: 'dh', algorithm, nSecret, nEnc, nDh },
    kdf: { id: kdfId, name: kdf, nH },
    aead: aeadParams(aeadId, aead),
    id: suiteId(kemId, kdfId, aeadId),
    kemId: concat(L_KEM, i2osp(kemId, 2)),
  }
}

function aeadParams(id: number, name: AEAD): Suite['aead'] {
  switch (name) {
    case 'AES-128-GCM':
      return { id, name, algorithm: 'AES-GCM', keyFormat: 'raw', nK: 16, nN: 12 }
    case 'AES-256-GCM':
      return { id, name, algorithm: 'AES-GCM', keyFormat: 'raw', nK: 32, nN: 12 }
    case 'ChaCha20Poly1305':
      return {
        id,
        name,
        algorithm: 'ChaCha20-Poly1305',
        keyFormat: 'raw-secret' as KeyFormat,
        nK: 32,
        nN: 12,
      }
  }
}

function suite(alg: string): Suite {
  switch (alg) {
    case 'HPKE-0':
      return dhSuite(
        0x0010,
        { name: 'ECDH', namedCurve: 'P-256' },
        32,
        65,
        32,
        'HKDF-SHA256',
        'AES-128-GCM',
      )
    case 'HPKE-1':
      return dhSuite(
        0x0011,
        { name: 'ECDH', namedCurve: 'P-384' },
        48,
        97,
        48,
        'HKDF-SHA384',
        'AES-256-GCM',
      )
    case 'HPKE-3':
      return dhSuite(0x0020, { name: 'X25519' }, 32, 32, 32, 'HKDF-SHA256', 'AES-128-GCM')
    case 'HPKE-4':
      return dhSuite(0x0020, { name: 'X25519' }, 32, 32, 32, 'HKDF-SHA256', 'ChaCha20Poly1305')
    case 'HPKE-7':
      return dhSuite(
        0x0010,
        { name: 'ECDH', namedCurve: 'P-256' },
        32,
        65,
        32,
        'HKDF-SHA256',
        'AES-256-GCM',
      )
    default:
      throw new JOSENotSupported(
        'Invalid or unsupported JWE "alg" (Algorithm) Header Parameter value',
      )
  }
}

function assertKeyAlgorithm(key: types.CryptoKey, expected: EcKeyAlgorithm | KeyAlgorithm) {
  if (key.algorithm.name !== expected.name) {
    throw new TypeError(
      `CryptoKey does not support this operation, its algorithm.name must be ${expected.name}`,
    )
  }
  if (
    'namedCurve' in expected &&
    (key.algorithm as EcKeyAlgorithm).namedCurve !== expected.namedCurve
  ) {
    throw new TypeError(
      `CryptoKey does not support this operation, its algorithm.namedCurve must be ${expected.namedCurve}`,
    )
  }
}

function checkUsage(key: types.CryptoKey, usage: KeyUsage) {
  if (!key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

export async function getPublicKey(
  _name: string,
  key: types.CryptoKey,
  usages: KeyUsage[],
): Promise<types.CryptoKey> {
  const subtle = crypto.subtle as ModernSubtleCrypto
  if (typeof subtle.getPublicKey === 'function') {
    return subtle.getPublicKey(key, usages)
  }

  if (!key.extractable) {
    throw new TypeError('"privateKey" must be extractable in this runtime')
  }

  const jwk = await crypto.subtle.exportKey('jwk', key)
  return crypto.subtle.importKey(
    'jwk',
    { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y },
    key.algorithm,
    true,
    usages,
  )
}

function notAllZeros(buffer: Uint8Array) {
  let or = 0
  for (let i = 0; i < buffer.length; i++) {
    or |= buffer[i]!
  }
  if (or === 0) {
    throw new Error('DH shared secret is an all-zero value')
  }
}

async function serializePublicKey(suite: Suite, key: types.CryptoKey): Promise<Uint8Array> {
  assertKeyAlgorithm(key, suite.kem.algorithm)
  return new Uint8Array(await crypto.subtle.exportKey('raw', key))
}

async function dhEncap(suite: Suite, publicKey: types.CryptoKey) {
  assertKeyAlgorithm(publicKey, suite.kem.algorithm)
  const ephemeral = (await crypto.subtle.generateKey(suite.kem.algorithm, false, [
    'deriveBits',
  ])) as CryptoKeyPair
  const dh = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: ephemeral.privateKey.algorithm.name, public: publicKey },
      ephemeral.privateKey,
      suite.kem.nDh! << 3,
    ),
  )
  notAllZeros(dh)

  const enc = await serializePublicKey(suite, ephemeral.publicKey)
  const pkRm = await serializePublicKey(suite, publicKey)
  const sharedSecret = await extractAndExpand(suite, dh, concat(enc, pkRm))
  return { enc, sharedSecret }
}

async function dhDecap(suite: Suite, encryptedKey: Uint8Array, privateKey: types.CryptoKey) {
  assertKeyAlgorithm(privateKey, suite.kem.algorithm)
  checkUsage(privateKey, 'deriveBits')

  if (encryptedKey.byteLength !== suite.kem.nEnc) {
    throw new JWEDecryptionFailed()
  }

  const publicKey = await crypto.subtle.importKey(
    'raw',
    encryptedKey as Uint8Array<ArrayBuffer>,
    suite.kem.algorithm,
    true,
    [],
  )
  const dh = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: privateKey.algorithm.name, public: publicKey },
      privateKey,
      suite.kem.nDh! << 3,
    ),
  )
  notAllZeros(dh)

  const pkR = await getPublicKey(suite.kem.algorithm.name, privateKey, [])
  const pkRm = await serializePublicKey(suite, pkR)
  return extractAndExpand(suite, dh, concat(encryptedKey, pkRm))
}

async function hmac(hash: string, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as Uint8Array<ArrayBuffer>,
    { name: 'HMAC', hash },
    false,
    ['sign'],
  )
  return new Uint8Array(
    await crypto.subtle.sign('HMAC', cryptoKey, data as Uint8Array<ArrayBuffer>),
  )
}

async function extract(suite: Suite, salt: Uint8Array, ikm: Uint8Array): Promise<Uint8Array> {
  const hash = suite.kdf.name === 'HKDF-SHA384' ? 'SHA-384' : 'SHA-256'
  return hmac(hash, salt.byteLength ? salt : new Uint8Array(suite.kdf.nH), ikm)
}

async function expand(suite: Suite, prk: Uint8Array, info: Uint8Array, length: number) {
  const hash = suite.kdf.name === 'HKDF-SHA384' ? 'SHA-384' : 'SHA-256'
  const blocks = Math.ceil(length / suite.kdf.nH)
  const output = new Uint8Array(blocks * suite.kdf.nH)
  let previous: Uint8Array = EMPTY

  for (let i = 0; i < blocks; i++) {
    previous = await hmac(hash, prk, concat(previous, info, Uint8Array.of(i + 1)))
    output.set(previous, i * suite.kdf.nH)
  }

  return output.slice(0, length)
}

async function labeledExtract(
  suite: Suite,
  suiteId: Uint8Array,
  salt: Uint8Array,
  label: Uint8Array,
  ikm: Uint8Array,
): Promise<Uint8Array> {
  return extract(suite, salt, concat(L_HPKE_V1, suiteId, label, ikm))
}

async function labeledExpand(
  suite: Suite,
  suiteId: Uint8Array,
  prk: Uint8Array,
  label: Uint8Array,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  return expand(suite, prk, concat(i2osp(length, 2), L_HPKE_V1, suiteId, label, info), length)
}

async function extractAndExpand(
  suite: Suite,
  dh: Uint8Array,
  kemContext: Uint8Array,
): Promise<Uint8Array> {
  const eaePrk = await labeledExtract(suite, suite.kemId, EMPTY, L_EAE_PRK, dh)
  return labeledExpand(suite, suite.kemId, eaePrk, L_SHARED_SECRET, kemContext, suite.kem.nSecret)
}

async function keySchedule(suite: Suite, sharedSecret: Uint8Array) {
  const [pskIdHash, infoHash] = await Promise.all([
    labeledExtract(suite, suite.id, EMPTY, L_PSK_ID_HASH, EMPTY),
    labeledExtract(suite, suite.id, EMPTY, L_INFO_HASH, EMPTY),
  ])
  const context = concat(i2osp(0, 1), pskIdHash, infoHash)
  const secret = await labeledExtract(suite, suite.id, sharedSecret, L_SECRET, EMPTY)

  const [key, baseNonce] = await Promise.all([
    labeledExpand(suite, suite.id, secret, L_KEY, context, suite.aead.nK),
    labeledExpand(suite, suite.id, secret, L_BASE_NONCE, context, suite.aead.nN),
  ])

  return { key, baseNonce }
}

async function aeadKey(suite: Suite, key: Uint8Array) {
  return crypto.subtle.importKey(
    suite.aead.keyFormat as 'raw',
    key as Uint8Array<ArrayBuffer>,
    suite.aead.algorithm,
    false,
    ['encrypt', 'decrypt'],
  )
}

async function aeadSeal(
  suite: Suite,
  key: Uint8Array,
  nonce: Uint8Array,
  aad: Uint8Array,
  plaintext: Uint8Array,
): Promise<Uint8Array> {
  return new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: suite.aead.algorithm,
        iv: nonce as Uint8Array<ArrayBuffer>,
        additionalData: aad as Uint8Array<ArrayBuffer>,
      },
      await aeadKey(suite, key),
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )
}

async function aeadOpen(
  suite: Suite,
  key: Uint8Array,
  nonce: Uint8Array,
  aad: Uint8Array,
  ciphertext: Uint8Array,
): Promise<Uint8Array> {
  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: suite.aead.algorithm,
          iv: nonce as Uint8Array<ArrayBuffer>,
          additionalData: aad as Uint8Array<ArrayBuffer>,
        },
        await aeadKey(suite, key),
        ciphertext as Uint8Array<ArrayBuffer>,
      ),
    )
  } catch (cause) {
    throw new JWEDecryptionFailed(undefined, { cause })
  }
}

export async function seal(
  alg: string,
  publicKey: types.CryptoKey,
  plaintext: Uint8Array,
  aad: Uint8Array,
): Promise<{ encryptedKey: Uint8Array; ciphertext: Uint8Array }> {
  const s = suite(alg)
  const { enc, sharedSecret } = await dhEncap(s, publicKey)
  const { key, baseNonce } = await keySchedule(s, sharedSecret)
  return { encryptedKey: enc, ciphertext: await aeadSeal(s, key, baseNonce, aad, plaintext) }
}

export async function open(
  alg: string,
  privateKey: types.CryptoKey,
  encryptedKey: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  const s = suite(alg)
  let sharedSecret: Uint8Array
  try {
    sharedSecret = await dhDecap(s, encryptedKey, privateKey)
  } catch (cause) {
    if (cause instanceof TypeError || cause instanceof JOSENotSupported) {
      throw cause
    }
    if (cause instanceof JWEDecryptionFailed) {
      throw cause
    }
    throw new JWEDecryptionFailed(undefined, { cause })
  }
  const { key, baseNonce } = await keySchedule(s, sharedSecret)
  return aeadOpen(s, key, baseNonce, aad, ciphertext)
}
