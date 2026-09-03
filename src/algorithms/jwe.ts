/** Tree-shakeable JWE key-management algorithm capability factories. @module */

import type * as types from '../types.d.ts'

import { encode as b64u } from '../util/base64url.js'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { concat, encode, uint32be } from '../lib/buffer_utils.js'
import {
  checkCryptoKey,
  checkModulusLength,
  checkUsage,
  type ExpectedAlgorithm,
} from '../lib/crypto_key.js'
import { decodeBase64url, digest } from '../lib/helpers.js'
import { assertCryptoKey } from '../lib/is_key_like.js'
import { createAlgorithmFactory as create } from '../lib/algorithm_capability.js'
import type {
  JWECEKTransportCapability,
  JWECEKTransportMode,
  JWECEKTransportResult,
  JWEContentEncryptionCapability,
  JWEDirectKeyAgreementCapability,
  JWEDirectKeyAgreementResult,
} from '../lib/jwe_algorithm.js'
import { decryptGCM, encryptGCM } from '../lib/jwe_aes_gcm.js'
import {
  A128GCMKWKey,
  A128KWKey,
  A192GCMKWKey,
  A192KWKey,
  A256GCMKWKey,
  A256KWKey,
  ECDH_ES_A128KWKey,
  ECDH_ES_A192KWKey,
  ECDH_ES_A256KWKey,
  ECDH_ESKey,
  PBES2_HS256_A128KWKey,
  PBES2_HS384_A192KWKey,
  PBES2_HS512_A256KWKey,
  RSA_OAEP_256Key,
  RSA_OAEP_384Key,
  RSA_OAEP_512Key,
  RSA_OAEPKey,
  type KeyRecipe,
} from '../lib/key_algorithm.js'
import type { KeyDescriptor } from '../lib/key_descriptor.js'
import { resolvedJwkToKey } from '../lib/jwk_to_key_resolved.js'
import { prepareKey } from '../lib/key.js'
import { assertUint8Array, isObject } from '../lib/type_checks.js'

import type { JWEKeyManagementAlgorithmName, JWEKeyManagementFactory } from './types.js'

function transportFactory<Algorithm extends JWEKeyManagementAlgorithmName>(
  algorithm: Algorithm,
  mode: JWECEKTransportMode,
  key: Readonly<KeyDescriptor>,
  encrypt: JWECEKTransportCapability['encrypt'],
  decrypt: JWECEKTransportCapability['decrypt'],
): JWEKeyManagementFactory<Algorithm> {
  return create(
    { category: 'jwe-key-management', algorithm, key, encrypt, decrypt, mode },
    1,
  ) as JWEKeyManagementFactory<Algorithm>
}

function directEncryptionFactory<Algorithm extends JWEKeyManagementAlgorithmName>(
  algorithm: Algorithm,
): JWEKeyManagementFactory<Algorithm> {
  return create(
    { category: 'jwe-key-management', algorithm, mode: 'direct-encryption' },
    1,
  ) as JWEKeyManagementFactory<Algorithm>
}

function directKeyAgreementFactory<Algorithm extends JWEKeyManagementAlgorithmName>(
  algorithm: Algorithm,
  key: Readonly<KeyDescriptor>,
  encrypt: JWEDirectKeyAgreementCapability['encrypt'],
  decrypt: JWEDirectKeyAgreementCapability['decrypt'],
): JWEKeyManagementFactory<Algorithm> {
  return create(
    {
      category: 'jwe-key-management',
      algorithm,
      key,
      encrypt,
      decrypt,
      mode: 'direct-key-agreement',
    },
    1,
  ) as JWEKeyManagementFactory<Algorithm>
}

function assertEncryptedKey(
  encryptedKey: Uint8Array | undefined,
): asserts encryptedKey is Uint8Array {
  if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')
}

function checkLength(value: Uint8Array, bits: number, label: string): void {
  if (value.byteLength << 3 !== bits) throw new JWEInvalid(`Invalid ${label} length`)
}

function checkKeyLength(value: Uint8Array, expected: number): void {
  const actual = value.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}

async function encryptAesGcmKw(
  descriptor: KeyDescriptor,
  keyLength: number,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  _joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters = {},
): Promise<JWECEKTransportResult> {
  const iv =
    providedParameters.iv === undefined
      ? crypto.getRandomValues(new Uint8Array(12))
      : providedParameters.iv
  if (!(iv instanceof Uint8Array)) throw new TypeError('"iv" must be an instance of Uint8Array')
  checkLength(iv, 96, 'Initialization Vector')
  if (key instanceof Uint8Array) checkKeyLength(key, keyLength)
  const wrapped = await encryptGCM(descriptor, cek, key, iv, new Uint8Array())
  return [wrapped.ciphertext, { iv: b64u(wrapped.iv), tag: b64u(wrapped.tag) }]
}

async function decryptAesGcmKw(
  descriptor: KeyDescriptor,
  keyLength: number,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
): Promise<Uint8Array> {
  assertEncryptedKey(encryptedKey)
  if (typeof joseHeader.iv !== 'string') {
    throw new JWEInvalid('JOSE Header "iv" (Initialization Vector) missing or invalid')
  }
  if (typeof joseHeader.tag !== 'string') {
    throw new JWEInvalid('JOSE Header "tag" (Authentication Tag) missing or invalid')
  }
  const iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid)
  const tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid)
  checkLength(tag, 128, 'Authentication Tag')
  checkLength(iv, 96, 'Initialization Vector')
  if (key instanceof Uint8Array) checkKeyLength(key, keyLength)
  return decryptGCM(descriptor, key, encryptedKey, iv, tag, new Uint8Array())
}

async function aesKwKey(
  algorithm: ExpectedAlgorithm,
  key: types.CryptoKey | Uint8Array,
  usage: 'wrapKey' | 'unwrapKey',
): Promise<types.CryptoKey> {
  const result =
    key instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'AES-KW', true, [
          usage,
        ])
      : key
  checkCryptoKey(result, algorithm, usage)
  return result
}

async function wrapAesKw(
  algorithm: ExpectedAlgorithm,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
): Promise<Uint8Array> {
  const wrappingKey = await aesKwKey(algorithm, key, 'wrapKey')
  const cekKey = await crypto.subtle.importKey(
    'raw',
    cek as Uint8Array<ArrayBuffer>,
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )
  return new Uint8Array(await crypto.subtle.wrapKey('raw', cekKey, wrappingKey, 'AES-KW'))
}

async function unwrapAesKw(
  algorithm: ExpectedAlgorithm,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
): Promise<Uint8Array> {
  const wrappingKey = await aesKwKey(algorithm, key, 'unwrapKey')
  const cekKey = await crypto.subtle.unwrapKey(
    'raw',
    encryptedKey as Uint8Array<ArrayBuffer>,
    wrappingKey,
    'AES-KW',
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )
  return new Uint8Array(await crypto.subtle.exportKey('raw', cekKey))
}

async function encryptAesKw(
  descriptor: KeyDescriptor,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  _joseHeader: types.JWEHeaderParameters,
): Promise<JWECEKTransportResult> {
  return [await wrapAesKw(descriptor.subtle, key, cek), undefined]
}

async function decryptAesKw(
  descriptor: KeyDescriptor,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
): Promise<Uint8Array> {
  assertEncryptedKey(encryptedKey)
  return unwrapAesKw(descriptor.subtle, key, encryptedKey)
}

type SubtleCryptoWithGetPublicKey = SubtleCrypto & {
  getPublicKey?(key: types.CryptoKey, keyUsages: KeyUsage[]): Promise<types.CryptoKey>
}

function checkEcdhKey(key: types.CryptoKey, usage?: KeyUsage): void {
  if (key.algorithm.name !== 'ECDH' && key.algorithm.name !== 'X25519') {
    throw new TypeError(
      'CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519',
    )
  }
  checkUsage(key, usage)
}

function assertEcdhKey(key: types.CryptoKey | Uint8Array): asserts key is types.CryptoKey {
  assertCryptoKey(key)
  const curve = (key.algorithm as EcKeyAlgorithm).namedCurve
  if (
    curve !== 'P-256' &&
    curve !== 'P-384' &&
    curve !== 'P-521' &&
    key.algorithm.name !== 'X25519'
  ) {
    throw new JOSENotSupported(
      'ECDH with the provided key is not allowed or not supported by your javascript runtime',
    )
  }
}

function lengthAndInput(input: Uint8Array): Uint8Array {
  return concat(uint32be(input.length), input)
}

async function concatKdf(
  sharedSecret: Uint8Array,
  length: number,
  otherInfo: Uint8Array,
): Promise<Uint8Array> {
  const byteLength = length >> 3
  const hashLength = 32
  const rounds = Math.ceil(byteLength / hashLength)
  const output = new Uint8Array(rounds * hashLength)
  for (let index = 1; index <= rounds; index++) {
    output.set(
      await digest('sha256', concat(uint32be(index), sharedSecret, otherInfo)),
      (index - 1) * hashLength,
    )
  }
  return output.slice(0, byteLength)
}

async function deriveEcdhKey(
  publicKey: types.CryptoKey,
  privateKey: types.CryptoKey,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(),
  apv: Uint8Array = new Uint8Array(),
): Promise<Uint8Array> {
  checkEcdhKey(publicKey)
  checkEcdhKey(privateKey, 'deriveBits')

  const otherInfo = concat(
    lengthAndInput(encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  )
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: publicKey.algorithm.name, public: publicKey },
      privateKey,
      publicKey.algorithm.name === 'X25519'
        ? 256
        : Math.ceil(
            parseInt((publicKey.algorithm as EcKeyAlgorithm).namedCurve.slice(-3), 10) / 8,
          ) << 3,
    ),
  )
  return concatKdf(sharedSecret, keyLength, otherInfo)
}

function partyInfo(joseHeader: types.JWEHeaderParameters, name: 'apu' | 'apv') {
  const value = joseHeader[name]
  if (value === undefined) return undefined
  if (typeof value !== 'string') {
    throw new JWEInvalid(
      `JOSE Header "${name}" (Agreement Party${name === 'apu' ? 'U' : 'V'}Info) invalid`,
    )
  }
  return decodeBase64url(value, name, JWEInvalid)
}

function checkPartyInfo(apu: Uint8Array | undefined, apv: Uint8Array | undefined): void {
  if (apu === undefined || apv === undefined || apu.byteLength !== apv.byteLength) return
  for (let i = 0; i < apu.byteLength; i++) {
    if (apu[i] !== apv[i]) return
  }
  throw new JWEInvalid('JOSE Header "apu" and "apv" values must be distinct')
}

async function decryptSharedSecret(
  algorithm: string,
  descriptor: KeyDescriptor,
  keyLength: number,
  key: types.CryptoKey | Uint8Array,
  joseHeader: types.JWEHeaderParameters,
): Promise<Uint8Array> {
  const { epk } = joseHeader
  if (!isObject<types.JWK>(epk) || epk.d !== undefined || epk.priv !== undefined) {
    throw new JWEInvalid('JOSE Header "epk" (Ephemeral Public Key) missing or invalid')
  }
  assertEcdhKey(key)
  const ephemeralPublicKey = await resolvedJwkToKey(descriptor, epk)
  const apu = partyInfo(joseHeader, 'apu')
  const apv = partyInfo(joseHeader, 'apv')
  checkPartyInfo(apu, apv)
  return deriveEcdhKey(ephemeralPublicKey, key, algorithm, keyLength, apu, apv)
}

async function encryptSharedSecret(
  algorithm: string,
  descriptor: KeyDescriptor,
  keyLength: number,
  key: types.CryptoKey | Uint8Array,
  joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters,
): Promise<[sharedSecret: Uint8Array, parameters: types.JWEHeaderParameters]> {
  assertEcdhKey(key)
  const { apu: providedApu, apv: providedApv } = providedParameters
  if (providedApu !== undefined) assertUint8Array(providedApu, '"apu"')
  if (providedApv !== undefined) assertUint8Array(providedApv, '"apv"')
  const apu = providedApu ?? partyInfo(joseHeader, 'apu')
  const apv = providedApv ?? partyInfo(joseHeader, 'apv')
  checkPartyInfo(apu, apv)

  let ephemeralKey: types.CryptoKey
  if (providedParameters.epk !== undefined) {
    ephemeralKey = (await prepareKey(
      descriptor,
      providedParameters.epk,
      'decrypt',
    )) as types.CryptoKey
  } else {
    ephemeralKey = (
      await crypto.subtle.generateKey(key.algorithm as EcKeyAlgorithm, true, ['deriveBits'])
    ).privateKey
  }

  const subtle = crypto.subtle as SubtleCryptoWithGetPublicKey
  let exportableEpk = ephemeralKey
  if (!exportableEpk.extractable) {
    if (typeof subtle.getPublicKey !== 'function') {
      throw new TypeError('CryptoKey for "epk" must be extractable')
    }
    exportableEpk = await subtle.getPublicKey(ephemeralKey, [])
  }
  const { x, y, crv, kty } = (await subtle.exportKey('jwk', exportableEpk)) as types.JWK
  const epk: types.JWK = { x, crv, kty }
  const parameters: types.JWEHeaderParameters = { epk }
  if (kty === 'EC') epk.y = y
  if (providedApu !== undefined) parameters.apu = b64u(providedApu)
  if (providedApv !== undefined) parameters.apv = b64u(providedApv)

  return [await deriveEcdhKey(key, ephemeralKey, algorithm, keyLength, apu, apv), parameters]
}

async function encryptEcdhEs(
  descriptor: KeyDescriptor,
  enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters = {},
): Promise<JWEDirectKeyAgreementResult> {
  const [cek, parameters] = await encryptSharedSecret(
    enc.algorithm,
    descriptor,
    enc.cekBits,
    key,
    joseHeader,
    providedParameters,
  )
  return [cek, parameters]
}

async function decryptEcdhEs(
  descriptor: KeyDescriptor,
  enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  joseHeader: types.JWEHeaderParameters,
): Promise<Uint8Array> {
  return decryptSharedSecret(enc.algorithm, descriptor, enc.cekBits, key, joseHeader)
}

async function encryptEcdhEsKw(
  algorithm: string,
  descriptor: KeyDescriptor,
  wrappingAlgorithm: ExpectedAlgorithm,
  keyLength: number,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters = {},
): Promise<JWECEKTransportResult> {
  const [sharedSecret, parameters] = await encryptSharedSecret(
    algorithm,
    descriptor,
    keyLength,
    key,
    joseHeader,
    providedParameters,
  )
  return [await wrapAesKw(wrappingAlgorithm, sharedSecret, cek), parameters]
}

async function decryptEcdhEsKw(
  algorithm: string,
  descriptor: KeyDescriptor,
  wrappingAlgorithm: ExpectedAlgorithm,
  keyLength: number,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
): Promise<Uint8Array> {
  const sharedSecret = await decryptSharedSecret(algorithm, descriptor, keyLength, key, joseHeader)
  assertEncryptedKey(encryptedKey)
  return unwrapAesKw(wrappingAlgorithm, sharedSecret, encryptedKey)
}

async function derivePbes2(
  algorithm: string,
  descriptor: KeyDescriptor,
  p2s: Uint8Array,
  p2c: number,
  key: types.CryptoKey | Uint8Array,
): Promise<Uint8Array> {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
    throw new JWEInvalid('PBES2 Salt Input must be 8 or more octets')
  }
  if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
    throw new JWEInvalid('PBES2 Count Input must be a positive integer')
  }

  const password =
    key instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'PBKDF2', false, [
          'deriveBits',
        ])
      : (checkCryptoKey(key, descriptor.subtle, 'deriveBits'), key)

  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        hash: `SHA-${algorithm.slice(8, 11)}`,
        iterations: p2c,
        name: 'PBKDF2',
        salt: concat(encode(algorithm), Uint8Array.of(0), p2s) as Uint8Array<ArrayBuffer>,
      },
      password,
      parseInt(algorithm.slice(13, 16), 10),
    ),
  )
}

async function encryptPbes2(
  algorithm: string,
  descriptor: KeyDescriptor,
  wrappingAlgorithm: ExpectedAlgorithm,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  _joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters = {},
): Promise<JWECEKTransportResult> {
  const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters
  const derived = await derivePbes2(algorithm, descriptor, p2s, p2c, key)
  const encryptedKey = await wrapAesKw(wrappingAlgorithm, derived, cek)
  return [encryptedKey, { p2c, p2s: b64u(p2s) }]
}

async function decryptPbes2(
  algorithm: string,
  descriptor: KeyDescriptor,
  wrappingAlgorithm: ExpectedAlgorithm,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  maxPBES2Count?: number,
): Promise<Uint8Array> {
  assertEncryptedKey(encryptedKey)
  if (typeof joseHeader.p2c !== 'number') {
    throw new JWEInvalid('JOSE Header "p2c" (PBES2 Count) missing or invalid')
  }
  if (
    maxPBES2Count !== undefined &&
    maxPBES2Count !== Infinity &&
    (!Number.isSafeInteger(maxPBES2Count) || maxPBES2Count < 1)
  ) {
    throw new TypeError('maxPBES2Count must be a positive safe integer or Infinity')
  }
  const p2cLimit = maxPBES2Count ?? 10_000
  if (joseHeader.p2c > p2cLimit) {
    throw new JWEInvalid('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds')
  }
  if (typeof joseHeader.p2s !== 'string') {
    throw new JWEInvalid('JOSE Header "p2s" (PBES2 Salt) missing or invalid')
  }

  const p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid)
  const derived = await derivePbes2(algorithm, descriptor, p2s, joseHeader.p2c, key)
  return unwrapAesKw(wrappingAlgorithm, derived, encryptedKey)
}

function checkRsaKey(
  algorithm: string,
  descriptor: KeyDescriptor,
  key: types.CryptoKey,
  usage: 'encrypt' | 'decrypt',
): void {
  checkCryptoKey(key, descriptor.subtle, usage)
  checkModulusLength(algorithm, key)
}

async function encryptRsaOaep(
  algorithm: string,
  descriptor: KeyDescriptor,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  _joseHeader: types.JWEHeaderParameters,
): Promise<JWECEKTransportResult> {
  assertCryptoKey(key)
  checkRsaKey(algorithm, descriptor, key, 'encrypt')
  const encryptedKey = new Uint8Array(
    await crypto.subtle.encrypt('RSA-OAEP', key, cek as Uint8Array<ArrayBuffer>),
  )
  return [encryptedKey, undefined]
}

async function decryptRsaOaep(
  algorithm: string,
  descriptor: KeyDescriptor,
  _enc: JWEContentEncryptionCapability,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
): Promise<Uint8Array> {
  assertEncryptedKey(encryptedKey)
  assertCryptoKey(key)
  checkRsaKey(algorithm, descriptor, key, 'decrypt')
  return new Uint8Array(
    await crypto.subtle.decrypt('RSA-OAEP', key, encryptedKey as Uint8Array<ArrayBuffer>),
  )
}

function aesgcmkw<Algorithm extends JWEKeyManagementAlgorithmName>(
  key: KeyRecipe<Algorithm>,
  bits: number,
): JWEKeyManagementFactory<Algorithm> {
  return transportFactory(
    key.alg,
    'key-wrapping',
    key,
    encryptAesGcmKw.bind(null, key, bits),
    decryptAesGcmKw.bind(null, key, bits),
  )
}

function aeskw<Algorithm extends JWEKeyManagementAlgorithmName>(
  key: KeyRecipe<Algorithm>,
): JWEKeyManagementFactory<Algorithm> {
  return transportFactory(
    key.alg,
    'key-wrapping',
    key,
    encryptAesKw.bind(null, key),
    decryptAesKw.bind(null, key),
  )
}

function direct(): JWEKeyManagementFactory<'dir'> {
  return directEncryptionFactory('dir')
}

function ecdh(): JWEKeyManagementFactory<'ECDH-ES'> {
  return directKeyAgreementFactory(
    ECDH_ESKey.alg,
    ECDH_ESKey,
    encryptEcdhEs.bind(null, ECDH_ESKey),
    decryptEcdhEs.bind(null, ECDH_ESKey),
  )
}

function ecdhKw<Algorithm extends JWEKeyManagementAlgorithmName>(
  key: KeyRecipe<Algorithm>,
  bits: number,
): JWEKeyManagementFactory<Algorithm> {
  const wrapping = { name: 'AES-KW', length: bits }
  return transportFactory(
    key.alg,
    'key-agreement-with-key-wrapping',
    key,
    encryptEcdhEsKw.bind(null, key.alg, key, wrapping, bits),
    decryptEcdhEsKw.bind(null, key.alg, key, wrapping, bits),
  )
}

function pbes2<Algorithm extends JWEKeyManagementAlgorithmName>(
  key: KeyRecipe<Algorithm>,
): JWEKeyManagementFactory<Algorithm> {
  const wrapping = { name: 'AES-KW', length: +key.alg.slice(13, 16) }
  return transportFactory(
    key.alg,
    'key-wrapping',
    key,
    encryptPbes2.bind(null, key.alg, key, wrapping),
    decryptPbes2.bind(null, key.alg, key, wrapping),
  )
}

function rsaes<Algorithm extends JWEKeyManagementAlgorithmName>(
  key: KeyRecipe<Algorithm>,
): JWEKeyManagementFactory<Algorithm> {
  return transportFactory(
    key.alg,
    'key-encryption',
    key,
    encryptRsaOaep.bind(null, key.alg, key),
    decryptRsaOaep.bind(null, key.alg, key),
  )
}

/** The `dir` JWE key-management algorithm capability factory. */
export const dir: JWEKeyManagementFactory<'dir'> = /* @__PURE__ */ direct()

/** The `RSA-OAEP` JWE key-management algorithm capability factory. */
export const RSA_OAEP: JWEKeyManagementFactory<'RSA-OAEP'> = /* @__PURE__ */ rsaes(RSA_OAEPKey)

/** The `RSA-OAEP-256` JWE key-management algorithm capability factory. */
export const RSA_OAEP_256: JWEKeyManagementFactory<'RSA-OAEP-256'> =
  /* @__PURE__ */ rsaes(RSA_OAEP_256Key)

/** The `RSA-OAEP-384` JWE key-management algorithm capability factory. */
export const RSA_OAEP_384: JWEKeyManagementFactory<'RSA-OAEP-384'> =
  /* @__PURE__ */ rsaes(RSA_OAEP_384Key)

/** The `RSA-OAEP-512` JWE key-management algorithm capability factory. */
export const RSA_OAEP_512: JWEKeyManagementFactory<'RSA-OAEP-512'> =
  /* @__PURE__ */ rsaes(RSA_OAEP_512Key)

/** The `ECDH-ES` JWE key-management algorithm capability factory. */
export const ECDH_ES: JWEKeyManagementFactory<'ECDH-ES'> = /* @__PURE__ */ ecdh()

/** The `ECDH-ES+A128KW` JWE key-management algorithm capability factory. */
export const ECDH_ES_A128KW: JWEKeyManagementFactory<'ECDH-ES+A128KW'> = /* @__PURE__ */ ecdhKw(
  ECDH_ES_A128KWKey,
  128,
)

/** The `ECDH-ES+A192KW` JWE key-management algorithm capability factory. */
export const ECDH_ES_A192KW: JWEKeyManagementFactory<'ECDH-ES+A192KW'> = /* @__PURE__ */ ecdhKw(
  ECDH_ES_A192KWKey,
  192,
)

/** The `ECDH-ES+A256KW` JWE key-management algorithm capability factory. */
export const ECDH_ES_A256KW: JWEKeyManagementFactory<'ECDH-ES+A256KW'> = /* @__PURE__ */ ecdhKw(
  ECDH_ES_A256KWKey,
  256,
)

/** The `A128KW` JWE key-management algorithm capability factory. */
export const A128KW: JWEKeyManagementFactory<'A128KW'> = /* @__PURE__ */ aeskw(A128KWKey)

/** The `A192KW` JWE key-management algorithm capability factory. */
export const A192KW: JWEKeyManagementFactory<'A192KW'> = /* @__PURE__ */ aeskw(A192KWKey)

/** The `A256KW` JWE key-management algorithm capability factory. */
export const A256KW: JWEKeyManagementFactory<'A256KW'> = /* @__PURE__ */ aeskw(A256KWKey)

/** The `A128GCMKW` JWE key-management algorithm capability factory. */
export const A128GCMKW: JWEKeyManagementFactory<'A128GCMKW'> = /* @__PURE__ */ aesgcmkw(
  A128GCMKWKey,
  128,
)

/** The `A192GCMKW` JWE key-management algorithm capability factory. */
export const A192GCMKW: JWEKeyManagementFactory<'A192GCMKW'> = /* @__PURE__ */ aesgcmkw(
  A192GCMKWKey,
  192,
)

/** The `A256GCMKW` JWE key-management algorithm capability factory. */
export const A256GCMKW: JWEKeyManagementFactory<'A256GCMKW'> = /* @__PURE__ */ aesgcmkw(
  A256GCMKWKey,
  256,
)

/** The `PBES2-HS256+A128KW` JWE key-management algorithm capability factory. */
export const PBES2_HS256_A128KW: JWEKeyManagementFactory<'PBES2-HS256+A128KW'> =
  /* @__PURE__ */ pbes2(PBES2_HS256_A128KWKey)

/** The `PBES2-HS384+A192KW` JWE key-management algorithm capability factory. */
export const PBES2_HS384_A192KW: JWEKeyManagementFactory<'PBES2-HS384+A192KW'> =
  /* @__PURE__ */ pbes2(PBES2_HS384_A192KWKey)

/** The `PBES2-HS512+A256KW` JWE key-management algorithm capability factory. */
export const PBES2_HS512_A256KW: JWEKeyManagementFactory<'PBES2-HS512+A256KW'> =
  /* @__PURE__ */ pbes2(PBES2_HS512_A256KWKey)

export type {
  AsymmetricJWEKeyManagementAlgorithmName,
  JWEAlgorithmSelection,
  JWEKeyManagementAlgorithmName,
  JWEKeyManagementAlgorithmOf,
} from './types.js'

/** Represents a factory for any algorithm capability accepted by composable JWE operations. */
export type { JWEAlgorithmFactory } from './types.js'

/** Represents a factory for one built-in JWE key-management algorithm capability. */
export type { JWEKeyManagementFactory } from './types.js'
