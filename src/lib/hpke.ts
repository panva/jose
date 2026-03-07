import { concat, encode } from './buffer_utils.js'
import { ecdhDeriveBits } from './ecdhes.js'
import { aeadEncrypt } from './encrypt.js'
import { aeadDecrypt } from './decrypt.js'
import { JOSENotSupported } from '../util/errors.js'

// HPKE Modes
const MODE_BASE = 0x00
const MODE_PSK = 0x01

// I2OSP: Integer to Octet String Primitive
function I2OSP(n: number, w: number): Uint8Array {
  const ret = new Uint8Array(w)
  let num = n
  for (let i = w - 1; i >= 0; i--) {
    ret[i] = num & 0xff
    num >>>= 8
  }
  return ret
}

interface Suite {
  kem: {
    id: number
    suite_id: Uint8Array
    algorithm: EcKeyGenParams | KeyAlgorithm
    Nsecret: number
    Nenc: number
    Npk: number
    Ndh: number
  }
  aead: {
    id: number
    algorithm: string
    keyFormat: string
    Nk: number
    Nn: number
  }
  id: Uint8Array
}

const KDF_HASH = 'SHA-256'
const KDF_NH = 32
const KDF_ID = 0x0001

function defineSuite(
  kemId: number,
  kemAlg: EcKeyGenParams | KeyAlgorithm,
  kemNsecret: number,
  kemNenc: number,
  kemNpk: number,
  kemNdh: number,
  aeadId: number,
  aeadAlg: string,
  aeadKeyFormat: string,
  aeadNk: number,
  aeadNn: number,
): Suite {
  return {
    kem: {
      id: kemId,
      suite_id: concat(encode('KEM'), I2OSP(kemId, 2)),
      algorithm: kemAlg,
      Nsecret: kemNsecret,
      Nenc: kemNenc,
      Npk: kemNpk,
      Ndh: kemNdh,
    },
    aead: {
      id: aeadId,
      algorithm: aeadAlg,
      keyFormat: aeadKeyFormat,
      Nk: aeadNk,
      Nn: aeadNn,
    },
    id: concat(encode('HPKE'), I2OSP(kemId, 2), I2OSP(KDF_ID, 2), I2OSP(aeadId, 2)),
  }
}

let suites: Record<string, Suite>

function getSuite(alg: string): Suite {
  suites ??= Object.create(null)
  if (alg in suites) return suites[alg]

  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-7':
      // DHKEM(P-256, HKDF-SHA256) + HKDF-SHA256 + AES-GCM
      suites[alg] = defineSuite(
        0x0010,
        { name: 'ECDH', namedCurve: 'P-256' },
        32,
        65,
        65,
        32,
        alg === 'HPKE-0' ? 0x0001 : 0x0002,
        'AES-GCM',
        'raw',
        alg === 'HPKE-0' ? 16 : 32,
        12,
      )
      return suites[alg]
    case 'HPKE-4':
      // DHKEM(X25519, HKDF-SHA256) + HKDF-SHA256 + ChaCha20Poly1305
      suites[alg] = defineSuite(
        0x0020,
        { name: 'X25519' },
        32,
        32,
        32,
        32,
        0x0003,
        'ChaCha20-Poly1305',
        'raw-secret',
        32,
        12,
      )
      return suites[alg]
    default:
      throw new JOSENotSupported('Unsupported HPKE algorithm')
  }
}

// HKDF Extract
async function Extract(salt: Uint8Array, ikm: Uint8Array) {
  const saltBuf: ArrayBuffer =
    salt.byteLength === 0 ? new ArrayBuffer(KDF_NH) : (salt.buffer as ArrayBuffer)
  return new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      await crypto.subtle.importKey('raw', saltBuf, { name: 'HMAC', hash: KDF_HASH }, false, [
        'sign',
      ]),
      ikm as Uint8Array<ArrayBuffer>,
    ),
  )
}

// HKDF Expand
async function Expand(prk: Uint8Array, info: Uint8Array, L: number) {
  const N = Math.ceil(L / KDF_NH)
  const key = await crypto.subtle.importKey(
    'raw',
    prk as Uint8Array<ArrayBuffer>,
    { name: 'HMAC', hash: KDF_HASH },
    false,
    ['sign'],
  )
  const T = new Uint8Array(N * KDF_NH)
  let prev = new Uint8Array()
  for (let i = 0; i < N; i++) {
    const input = new Uint8Array(prev.byteLength + info.byteLength + 1)
    input.set(prev)
    input.set(info, prev.byteLength)
    input[prev.byteLength + info.byteLength] = i + 1
    const ti = new Uint8Array(await crypto.subtle.sign('HMAC', key, input))
    T.set(ti, i * KDF_NH)
    prev = ti
  }
  return T.slice(0, L)
}

const HPKE_V1 = encode('HPKE-v1')

function LabeledExtract(
  suite_id: Uint8Array,
  salt: Uint8Array,
  label: Uint8Array,
  ikm: Uint8Array,
) {
  return Extract(salt, concat(HPKE_V1, suite_id, label, ikm))
}

function LabeledExpand(
  suite_id: Uint8Array,
  prk: Uint8Array,
  label: Uint8Array,
  info: Uint8Array,
  L: number,
) {
  return Expand(prk, concat(I2OSP(L, 2), HPKE_V1, suite_id, label, info), L)
}

// DHKEM

async function SerializePublicKey(key: CryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', key))
}

async function DeserializePublicKey(key: Uint8Array, algorithm: EcKeyGenParams | KeyAlgorithm) {
  return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, algorithm, true, [])
}

async function ExtractAndExpand(suite: Suite, dh: Uint8Array, kemContext: Uint8Array) {
  const eae_prk = await LabeledExtract(suite.kem.suite_id, new Uint8Array(), encode('eae_prk'), dh)
  return LabeledExpand(
    suite.kem.suite_id,
    eae_prk,
    encode('shared_secret'),
    kemContext,
    suite.kem.Nsecret,
  )
}

async function Encap(suite: Suite, pkR: CryptoKey) {
  const ekp = await crypto.subtle.generateKey(suite.kem.algorithm, true, ['deriveBits'])
  const { privateKey: skE, publicKey: pkE } = ekp as CryptoKeyPair

  const dh = await ecdhDeriveBits(pkR, skE)

  const enc = await SerializePublicKey(pkE)
  const pkRm = await SerializePublicKey(pkR)
  const kemContext = concat(enc, pkRm)
  const sharedSecret = await ExtractAndExpand(suite, dh, kemContext)
  return { sharedSecret, enc }
}

async function Decap(suite: Suite, enc: Uint8Array, skR: CryptoKey) {
  let pkR: CryptoKey
  if (typeof (crypto.subtle as any).getPublicKey === 'function') {
    pkR = await (crypto.subtle as any).getPublicKey(skR, [])
  } else {
    if (!skR.extractable) {
      throw new JOSENotSupported(
        'HPKE decryption requires the key to be extractable in this runtime.',
      )
    }
    const jwk = await crypto.subtle.exportKey('jwk', skR)
    delete jwk.d
    pkR = await crypto.subtle.importKey('jwk', jwk, suite.kem.algorithm, true, [])
  }

  const pkE = await DeserializePublicKey(enc, suite.kem.algorithm)
  const dh = await ecdhDeriveBits(pkE, skR)

  const pkRm = await SerializePublicKey(pkR)
  const kemContext = concat(enc, pkRm)
  return ExtractAndExpand(suite, dh, kemContext)
}

// KeySchedule

function VerifyPSKInputs(psk: Uint8Array, pskId: Uint8Array) {
  const gotPSK = psk.byteLength !== 0
  const gotPSKId = pskId.byteLength !== 0
  if (gotPSK !== gotPSKId) {
    throw new Error('Inconsistent PSK inputs')
  }
  if (gotPSK && psk.byteLength < 32) {
    throw new Error('PSK must be at least 32 bytes')
  }
}

async function KeySchedule(
  suite: Suite,
  sharedSecret: Uint8Array,
  info: Uint8Array,
  psk?: Uint8Array,
  pskId?: Uint8Array,
) {
  const _psk = psk ?? new Uint8Array()
  const _pskId = pskId ?? new Uint8Array()
  VerifyPSKInputs(_psk, _pskId)

  const mode = _psk.byteLength > 0 ? MODE_PSK : MODE_BASE

  const sid = suite.id

  const [pskIdHash, infoHash] = await Promise.all([
    LabeledExtract(sid, new Uint8Array(), encode('psk_id_hash'), _pskId),
    LabeledExtract(sid, new Uint8Array(), encode('info_hash'), info),
  ])

  const keyScheduleCtx = concat(I2OSP(mode, 1), pskIdHash, infoHash)
  const secret = await LabeledExtract(sid, sharedSecret, encode('secret'), _psk)

  const [key, baseNonce] = await Promise.all([
    LabeledExpand(sid, secret, encode('key'), keyScheduleCtx, suite.aead.Nk),
    LabeledExpand(sid, secret, encode('base_nonce'), keyScheduleCtx, suite.aead.Nn),
  ])

  return { key, baseNonce }
}

function importAeadKey(suite: Suite, key: Uint8Array, usage: 'encrypt' | 'decrypt') {
  return crypto.subtle.importKey(
    suite.aead.keyFormat as any,
    key as Uint8Array<ArrayBuffer>,
    suite.aead.algorithm,
    false,
    [usage],
  )
}

// Single-shot API

export async function Seal(
  alg: string,
  pkR: CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  pt: Uint8Array,
  psk?: Uint8Array,
  pskId?: Uint8Array,
): Promise<{ enc: Uint8Array; ct: Uint8Array }> {
  const suite = getSuite(alg)

  const { sharedSecret, enc } = await Encap(suite, pkR)
  const { key, baseNonce } = await KeySchedule(suite, sharedSecret, info, psk, pskId)
  const ct = await aeadEncrypt(
    suite.aead.algorithm,
    await importAeadKey(suite, key, 'encrypt'),
    baseNonce,
    aad,
    pt,
  )

  return { enc, ct }
}

export async function Open(
  alg: string,
  enc: Uint8Array,
  skR: CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  ct: Uint8Array,
  psk?: Uint8Array,
  pskId?: Uint8Array,
): Promise<Uint8Array> {
  const suite = getSuite(alg)

  const sharedSecret = await Decap(suite, enc, skR)
  const { key, baseNonce } = await KeySchedule(suite, sharedSecret, info, psk, pskId)
  return aeadDecrypt(
    suite.aead.algorithm,
    await importAeadKey(suite, key, 'decrypt'),
    baseNonce,
    aad,
    ct,
  )
}

export function isIntegratedEncryption(alg: string): boolean {
  return alg === 'HPKE-0' || alg === 'HPKE-4' || alg === 'HPKE-7'
}
