import type * as types from '../types.d.ts'
import type { JWEKeyManagementHeaderParameters, JWEHeaderParameters, JWK } from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import {
  prepareKey,
  rawKey,
  jwkToKey,
  checkCryptoKey,
  checkModulusLength,
  checkUsage,
  assertCryptoKey,
} from './key.js'
import {
  jweAlgorithm,
  jweEncryption,
  isJWECEKTransport,
  type JWEConventionalAlgorithm,
  type JWEEncryption,
} from './jwe_algorithms.js'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { decodeBase64url, assertUint8Array, isObject } from './validate.js'
import { digest, concat, encode, uint32be } from './buffer_utils.js'
import { checkCekLength, generateCek, encrypt, decrypt } from './content_encryption.js'

type SubtleCryptoWithGetPublicKey = SubtleCrypto & {
  getPublicKey?(key: types.CryptoKey, keyUsages: KeyUsage[]): Promise<types.CryptoKey>
}

/** ECDH accepts either of two algorithm names, so it cannot go through the generic comparison. */
function checkEcdhCryptoKey(key: types.CryptoKey, usage?: KeyUsage): void {
  if (key.algorithm.name !== 'ECDH' && key.algorithm.name !== 'X25519') {
    throw new TypeError(
      'CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519',
    )
  }

  checkUsage(key, usage)
}

// --- aeskw ---

async function aeskwWrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await rawKey(key, jweAlgorithm(alg).subtle, 'wrapKey', true)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.importKey(
    'raw',
    cek as Uint8Array<ArrayBuffer>,
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'))
}

async function aeskwUnwrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await rawKey(key, jweAlgorithm(alg).subtle, 'unwrapKey', true)

  // algorithm used is irrelevant
  const cryptoKeyCek = await crypto.subtle.unwrapKey(
    'raw',
    encryptedKey as Uint8Array<ArrayBuffer>,
    cryptoKey,
    'AES-KW',
    { hash: 'SHA-256', name: 'HMAC' },
    true,
    ['sign'],
  )

  return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek))
}

// --- rsaes ---

function checkRsaKey(alg: string, key: types.CryptoKey, usage: 'encrypt' | 'decrypt') {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, usage)
  checkModulusLength(alg, key)
}

// --- pbes2kw ---

async function deriveKey(
  p2s: Uint8Array,
  alg: string,
  p2c: number,
  key: types.CryptoKey | Uint8Array,
) {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
    throw new JWEInvalid('PBES2 Salt Input must be 8 or more octets')
  }
  if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
    throw new JWEInvalid('PBES2 Count Input must be a positive integer')
  }

  const salt = concat(encode(alg), Uint8Array.of(0), p2s)
  const keylen = parseInt(alg.slice(13, 16), 10)
  const subtleAlg = {
    hash: `SHA-${alg.slice(8, 11)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }

  const cryptoKey = await rawKey(key, jweAlgorithm(alg).subtle, 'deriveBits')

  return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
}

// --- ecdhes ---

function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input)
}

/**
 * Concat KDF implementation
 *
 * @param Z - Shared secret from key-agreement scheme
 * @param L - Length of derived keying material in bits
 * @param OtherInfo - Context and application specific data
 */
async function concatKdf(Z: Uint8Array, L: number, OtherInfo: Uint8Array) {
  // dkLen = L (in bits), converted to bytes for output length
  const dkLen = L >> 3
  // Hash output length in bytes (SHA-256 produces 32 bytes)
  const hashLen = 32
  // Number of hash function calls needed
  const reps = Math.ceil(dkLen / hashLen)
  // Initialize output buffer for concatenated hash results
  const dk = new Uint8Array(reps * hashLen)

  // Perform reps iterations of the hash function
  for (let i = 1; i <= reps; i++) {
    // Hash_i = Hash(Counter || Z || OtherInfo)
    const hashResult = await digest('sha256', concat(uint32be(i), Z, OtherInfo))
    dk.set(hashResult, (i - 1) * hashLen)
  }

  // Return leading L bits of dk (truncate to exact length needed)
  return dk.slice(0, dkLen)
}

/**
 * ECDH-ES Key Agreement with Concat KDF
 *
 * @param publicKey
 * @param privateKey
 * @param algorithm - AlgorithmID: For Direct Key Agreement (ECDH-ES), this is the "enc" value. For
 *   Key Agreement with Key Wrapping, this is the "alg" value
 * @param keyLength - Keydatalen: Number of bits in the desired output key
 * @param apu - PartyUInfo: Agreement PartyUInfo value (information about the producer)
 * @param apv - PartyVInfo: Agreement PartyVInfo value (information about the recipient)
 */
async function ecdhesDeriveKey(
  publicKey: types.CryptoKey,
  privateKey: types.CryptoKey,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(),
  apv: Uint8Array = new Uint8Array(),
): Promise<Uint8Array> {
  checkEcdhCryptoKey(publicKey)
  checkEcdhCryptoKey(privateKey, 'deriveBits')

  const otherInfo = concat(
    lengthAndInput(encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  )

  // Perform ECDH to get the shared secret Z
  const Z = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: publicKey.algorithm.name,
        public: publicKey,
      },
      privateKey,
      publicKey.algorithm.name === 'X25519'
        ? 256
        : Math.ceil(
            parseInt((publicKey.algorithm as EcKeyAlgorithm).namedCurve.slice(-3), 10) / 8,
          ) << 3,
    ),
  )

  // Apply Concat KDF to derive the final key material
  return concatKdf(Z, keyLength, otherInfo)
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

function assertEncryptedKey(
  encryptedKey: Uint8Array | undefined,
): asserts encryptedKey is Uint8Array {
  if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')
}

function assertNoEncryptedKey(encryptedKey: Uint8Array | undefined): void {
  if (encryptedKey !== undefined) throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')
}

export function validateMaxPBES2Count(value: number | undefined): void {
  if (value !== undefined && value !== Infinity && (!Number.isSafeInteger(value) || value < 1)) {
    throw new TypeError('maxPBES2Count must be a positive safe integer or Infinity')
  }
}

export async function decryptKeyManagement(
  entry: JWEConventionalAlgorithm,
  enc: JWEEncryption,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  maxPBES2Count?: number,
): Promise<types.CryptoKey | Uint8Array> {
  const { alg } = entry
  const mode = entry.mode
  if (mode === 'direct-encryption') {
    assertNoEncryptedKey(encryptedKey)
    return key
  }
  const direct = mode === 'direct-key-agreement'
  if (direct) assertNoEncryptedKey(encryptedKey)
  else assertEncryptedKey(encryptedKey)

  switch (entry.subtle.name) {
    case 'ECDH': {
      const { epk } = joseHeader
      if (
        !isObject<types.JWK>(epk) ||
        ['d', 'k', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'priv'].some((parameter) =>
          Object.hasOwn(epk, parameter),
        )
      ) {
        throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`)
      }

      assertEcdhKey(key)

      const ephemeralPublicKey = await jwkToKey(entry, epk)
      const partyUInfo = partyInfo(joseHeader, 'apu')
      const partyVInfo = partyInfo(joseHeader, 'apv')
      checkPartyInfo(partyUInfo, partyVInfo)

      const sharedSecret = await ecdhesDeriveKey(
        ephemeralPublicKey,
        key,
        direct ? enc.alg : alg,
        direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10),
        partyUInfo,
        partyVInfo,
      )

      if (direct) return sharedSecret

      key = sharedSecret
      break
    }
    case 'RSA-OAEP': {
      assertCryptoKey(key)
      checkRsaKey(alg, key, 'decrypt')
      return new Uint8Array(
        await crypto.subtle.decrypt('RSA-OAEP', key, encryptedKey as Uint8Array<ArrayBuffer>),
      )
    }
    case 'PBKDF2': {
      if (typeof joseHeader.p2c !== 'number')
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`)

      validateMaxPBES2Count(maxPBES2Count)

      const p2cLimit = maxPBES2Count ?? 10_000

      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`)

      if (typeof joseHeader.p2s !== 'string')
        throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`)

      const p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid)
      key = await deriveKey(p2s, alg, joseHeader.p2c, key)
      break
    }
    case 'AES-GCM': {
      if (typeof joseHeader.iv !== 'string')
        throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`)

      if (typeof joseHeader.tag !== 'string')
        throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`)

      const iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid)
      const tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid)

      if (iv.byteLength !== 12) throw new JWEInvalid('Invalid Initialization Vector length')
      if (tag.byteLength !== 16) throw new JWEInvalid('Invalid Authentication Tag length')

      return decrypt(jweEncryption(alg.slice(0, -2)), key, encryptedKey!, iv, tag, new Uint8Array())
    }
  }
  return aeskwUnwrap(alg.slice(-6), key, encryptedKey!)
}

export async function encryptKeyManagement(
  entry: JWEConventionalAlgorithm,
  enc: JWEEncryption,
  inputKey: types.KeyInput,
  joseHeader: types.JWEHeaderParameters,
  providedCek?: Uint8Array,
  providedParameters: JWEKeyManagementHeaderParameters = {},
): Promise<
  [
    cek: types.CryptoKey | Uint8Array,
    encryptedKey: Uint8Array | undefined,
    parameters: JWEHeaderParameters | undefined,
  ]
> {
  const { alg, mode } = entry
  const transport = isJWECEKTransport(entry)
  if (providedCek !== undefined && !transport) {
    throw new TypeError(
      `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    )
  }
  let key = await prepareKey(mode === 'direct-encryption' ? enc : entry, inputKey, 'encrypt')
  if (mode === 'direct-encryption') return [key, undefined, undefined]

  const cek = transport ? (providedCek ?? generateCek(enc)) : undefined
  if (cek) checkCekLength(cek, enc.cekBits)
  let encryptedKey: Uint8Array | undefined
  let parameters: JWEHeaderParameters | undefined
  switch (entry.subtle.name) {
    case 'ECDH': {
      assertEcdhKey(key)
      const { apu: providedApu, apv: providedApv } = providedParameters
      if (providedApu !== undefined) {
        assertUint8Array(providedApu, '"apu"')
      }
      if (providedApv !== undefined) {
        assertUint8Array(providedApv, '"apv"')
      }
      const apu = providedApu ?? partyInfo(joseHeader, 'apu')
      const apv = providedApv ?? partyInfo(joseHeader, 'apv')
      checkPartyInfo(apu, apv)
      let ephemeralKey: types.CryptoKey
      if (providedParameters.epk !== undefined) {
        ephemeralKey = (await prepareKey(
          entry,
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
      const direct = mode === 'direct-key-agreement'
      const sharedSecret = await ecdhesDeriveKey(
        key,
        ephemeralKey,
        direct ? enc.alg : alg,
        direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10),
        apu,
        apv,
      )
      const epk: JWK = { x, crv, kty }
      if (kty === 'EC') epk.y = y
      parameters = { epk }
      if (providedApu !== undefined) parameters.apu = b64u(providedApu)
      if (providedApv !== undefined) parameters.apv = b64u(providedApv)

      if (direct) return [sharedSecret, undefined, parameters]

      key = sharedSecret
      break
    }
    case 'RSA-OAEP': {
      assertCryptoKey(key)
      checkRsaKey(alg, key, 'encrypt')
      encryptedKey = new Uint8Array(
        await crypto.subtle.encrypt('RSA-OAEP', key, cek as Uint8Array<ArrayBuffer>),
      )
      break
    }
    case 'PBKDF2': {
      const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters
      key = await deriveKey(p2s, alg, p2c, key)
      parameters = { p2c, p2s: b64u(p2s) }
      break
    }
    case 'AES-GCM': {
      const iv =
        providedParameters.iv === undefined
          ? crypto.getRandomValues(new Uint8Array(12))
          : providedParameters.iv
      if (!(iv instanceof Uint8Array)) {
        throw new TypeError('"iv" must be an instance of Uint8Array')
      }
      const wrapped = await encrypt(
        jweEncryption(alg.slice(0, -2)),
        cek!,
        key,
        iv,
        new Uint8Array(),
      )
      encryptedKey = wrapped.ciphertext
      parameters = { iv: b64u(wrapped.iv!), tag: b64u(wrapped.tag!) }
    }
  }
  encryptedKey ??= await aeskwWrap(alg.slice(-6), key, cek!)
  if (!(encryptedKey instanceof Uint8Array) || !encryptedKey.byteLength) {
    throw new TypeError('JWE key management algorithm did not produce an Encrypted Key')
  }
  return [cek!, encryptedKey, parameters]
}
