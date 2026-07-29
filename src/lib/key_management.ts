import type * as types from '../types.d.ts'
import type { JWEKeyManagementHeaderParameters, JWEHeaderParameters, JWK } from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { prepareKey } from './key.js'
import { jwkToKey } from './jwk_to_key.js'
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import type { JWEEncryption } from './jwe_algorithms.js'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { decodeBase64url, digest } from './helpers.js'
import { generateCek, encrypt, decrypt } from './content_encryption.js'
import { isObject } from './type_checks.js'
import { checkCryptoKey, checkUsage } from './crypto_key.js'
import { checkModulusLength } from './signing.js'
import { concat, encode, uint32be } from './buffer_utils.js'
import { assertCryptoKey } from './is_key_like.js'

type SubtleCryptoWithGetPublicKey = SubtleCrypto & {
  getPublicKey?(key: types.CryptoKey, keyUsages: KeyUsage[]): Promise<types.CryptoKey>
}

/** ECDH accepts either of two algorithm names, so it cannot go through the generic comparison. */
function checkEcdhCryptoKey(key: types.CryptoKey, usage?: KeyUsage): void {
  switch (key.algorithm.name) {
    case 'ECDH':
    case 'X25519':
      break
    default:
      throw new TypeError(
        'CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519',
      )
  }

  checkUsage(key, usage)
}

// --- aeskw ---

function checkKeySize(key: types.CryptoKey, alg: string) {
  if ((key.algorithm as AesKeyAlgorithm).length !== parseInt(alg.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg}`)
  }
}

function aeskwCryptoKey(key: types.CryptoKey | Uint8Array, alg: string, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'AES-KW', true, [usage])
  }
  checkCryptoKey(key, jweAlgorithm(alg).subtle, usage)
  return key
}

async function aeskwWrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await aeskwCryptoKey(key, alg, 'wrapKey')

  checkKeySize(cryptoKey, alg)

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
  const cryptoKey = await aeskwCryptoKey(key, alg, 'unwrapKey')

  checkKeySize(cryptoKey, alg)

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

// --- aesgcmkw ---

async function aesGcmKwWrap(
  gcm: JWEEncryption,
  key: unknown,
  cek: Uint8Array,
  iv?: Uint8Array,
): Promise<{ encryptedKey: Uint8Array; iv: string; tag: string }> {
  const wrapped = await encrypt(gcm, cek, key, iv, new Uint8Array())

  return {
    encryptedKey: wrapped.ciphertext,
    iv: b64u(wrapped.iv!),
    tag: b64u(wrapped.tag!),
  }
}

async function aesGcmKwUnwrap(
  gcm: JWEEncryption,
  key: unknown,
  encryptedKey: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
): Promise<Uint8Array> {
  return decrypt(gcm, key, encryptedKey, iv, tag, new Uint8Array())
}

// --- rsaes ---

const subtleAlgorithm = (alg: string) => {
  switch (alg) {
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      return 'RSA-OAEP'
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}

async function rsaesEncrypt(
  alg: string,
  key: types.CryptoKey,
  cek: Uint8Array,
): Promise<Uint8Array> {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, 'encrypt')
  checkModulusLength(alg, key)

  return new Uint8Array(
    await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek as Uint8Array<ArrayBuffer>),
  )
}

async function rsaesDecrypt(
  alg: string,
  key: types.CryptoKey,
  encryptedKey: Uint8Array,
): Promise<Uint8Array> {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, 'decrypt')
  checkModulusLength(alg, key)

  return new Uint8Array(
    await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey as Uint8Array<ArrayBuffer>),
  )
}

// --- pbes2kw ---

function pbes2CryptoKey(key: types.CryptoKey | Uint8Array, alg: string) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'PBKDF2', false, [
      'deriveBits',
    ])
  }

  checkCryptoKey(key, jweAlgorithm(alg).subtle, 'deriveBits')
  return key
}

const concatSalt = (alg: string, p2sInput: Uint8Array) =>
  concat(encode(alg), Uint8Array.of(0x00), p2sInput)

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

  const salt = concatSalt(alg, p2s)
  const keylen = parseInt(alg.slice(13, 16), 10)
  const subtleAlg = {
    hash: `SHA-${alg.slice(8, 11)}`,
    iterations: p2c,
    name: 'PBKDF2',
    salt,
  }

  const cryptoKey = await pbes2CryptoKey(key, alg)

  return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen))
}

async function pbes2kwWrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
  p2c = 2048,
  p2s: Uint8Array = crypto.getRandomValues(new Uint8Array(16)),
): Promise<{ encryptedKey: Uint8Array; p2c: number; p2s: string }> {
  const derived = await deriveKey(p2s, alg, p2c, key)

  const encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek)

  return { encryptedKey, p2c, p2s: b64u(p2s) }
}

async function pbes2kwUnwrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array,
  p2c: number,
  p2s: Uint8Array,
): Promise<Uint8Array> {
  const derived = await deriveKey(p2s, alg, p2c, key)

  return aeskwUnwrap(alg.slice(-6), derived, encryptedKey)
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
    // Construct Hash_i input: Counter || Z || OtherInfo
    const hashInput = new Uint8Array(4 + Z.length + OtherInfo.length)
    hashInput.set(uint32be(i), 0) // 32-bit big-endian counter
    hashInput.set(Z, 4) // Shared secret Z
    hashInput.set(OtherInfo, 4 + Z.length) // OtherInfo

    // Hash_i = Hash(Counter || Z || OtherInfo)
    const hashResult = await digest('sha256', hashInput)
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

  // Construct OtherInfo
  const algorithmID = lengthAndInput(encode(algorithm))
  const partyUInfo = lengthAndInput(apu)
  const partyVInfo = lengthAndInput(apv)
  const suppPubInfo = uint32be(keyLength)
  const suppPrivInfo = new Uint8Array()

  const otherInfo = concat(algorithmID, partyUInfo, partyVInfo, suppPubInfo, suppPrivInfo)

  // Perform ECDH to get the shared secret Z
  const Z = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: publicKey.algorithm.name,
        public: publicKey,
      },
      privateKey,
      getEcdhBitLength(publicKey),
    ),
  )

  // Apply Concat KDF to derive the final key material
  return concatKdf(Z, keyLength, otherInfo)
}

function getEcdhBitLength(publicKey: CryptoKey) {
  if (publicKey.algorithm.name === 'X25519') {
    return 256
  }

  return (
    Math.ceil(parseInt((publicKey.algorithm as EcKeyAlgorithm).namedCurve.slice(-3), 10) / 8) << 3
  )
}

function ecdhesAllowed(key: types.CryptoKey): boolean {
  switch ((key.algorithm as EcKeyAlgorithm).namedCurve) {
    case 'P-256':
    case 'P-384':
    case 'P-521':
      return true
    default:
      return key.algorithm.name === 'X25519'
  }
}

const unsupportedAlgHeader = 'Invalid or unsupported "alg" (JWE Algorithm) header value'

function assertEncryptedKey(
  encryptedKey: Uint8Array | undefined,
): asserts encryptedKey is Uint8Array {
  if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')
}

export async function decryptKeyManagement(
  alg: string,
  enc: JWEEncryption,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  options?: types.DecryptOptions,
): Promise<types.CryptoKey | Uint8Array> {
  switch (alg) {
    case 'dir': {
      // Direct Encryption
      if (encryptedKey !== undefined)
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')

      return key
    }
    case 'ECDH-ES':
      // Direct Key Agreement
      if (encryptedKey !== undefined)
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')

    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      // Direct Key Agreement
      if (!isObject<types.JWK>(joseHeader.epk))
        throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`)

      assertCryptoKey(key)
      if (!ecdhesAllowed(key))
        throw new JOSENotSupported(
          'ECDH with the provided key is not allowed or not supported by your javascript runtime',
        )

      const epk = await jwkToKey(jweAlgorithm(alg), joseHeader.epk)
      let partyUInfo!: Uint8Array
      let partyVInfo!: Uint8Array

      if (joseHeader.apu !== undefined) {
        if (typeof joseHeader.apu !== 'string')
          throw new JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`)
        partyUInfo = decodeBase64url(joseHeader.apu, 'apu', JWEInvalid)
      }

      if (joseHeader.apv !== undefined) {
        if (typeof joseHeader.apv !== 'string')
          throw new JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`)
        partyVInfo = decodeBase64url(joseHeader.apv, 'apv', JWEInvalid)
      }

      const sharedSecret = await ecdhesDeriveKey(
        epk,
        key,
        alg === 'ECDH-ES' ? enc.alg : alg,
        alg === 'ECDH-ES' ? enc.cekBits : parseInt(alg.slice(-5, -2), 10),
        partyUInfo,
        partyVInfo,
      )

      if (alg === 'ECDH-ES') return sharedSecret

      // Key Agreement with Key Wrapping
      assertEncryptedKey(encryptedKey)

      return aeskwUnwrap(alg.slice(-6), sharedSecret, encryptedKey)
    }
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      assertEncryptedKey(encryptedKey)
      assertCryptoKey(key)
      return rsaesDecrypt(alg, key, encryptedKey)
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      assertEncryptedKey(encryptedKey)

      if (typeof joseHeader.p2c !== 'number')
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`)

      const p2cLimit = options?.maxPBES2Count || 10_000

      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`)

      if (typeof joseHeader.p2s !== 'string')
        throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`)

      let p2s: Uint8Array
      p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid)
      return pbes2kwUnwrap(alg, key, encryptedKey, joseHeader.p2c, p2s)
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      assertEncryptedKey(encryptedKey)

      return aeskwUnwrap(alg, key, encryptedKey)
    }
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      // Key Wrapping (AES GCM KW)
      assertEncryptedKey(encryptedKey)

      if (typeof joseHeader.iv !== 'string')
        throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`)

      if (typeof joseHeader.tag !== 'string')
        throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`)

      let iv: Uint8Array
      iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid)
      let tag: Uint8Array
      tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid)

      return aesGcmKwUnwrap(jweEncryption(jweAlgorithm(alg).gcmkw!), key, encryptedKey, iv, tag)
    }
    default: {
      throw new JOSENotSupported(unsupportedAlgHeader)
    }
  }
}

export async function encryptKeyManagement(
  alg: string,
  enc: JWEEncryption,
  key: types.CryptoKey | Uint8Array,
  providedCek?: Uint8Array,
  providedParameters: JWEKeyManagementHeaderParameters = {},
): Promise<{
  cek: types.CryptoKey | Uint8Array
  encryptedKey?: Uint8Array
  parameters?: JWEHeaderParameters
}> {
  let encryptedKey: Uint8Array | undefined
  let parameters: (JWEHeaderParameters & { epk?: JWK }) | undefined
  let cek: types.CryptoKey | Uint8Array

  switch (alg) {
    case 'dir': {
      // Direct Encryption
      cek = key
      break
    }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      assertCryptoKey(key)
      // Direct Key Agreement
      if (!ecdhesAllowed(key)) {
        throw new JOSENotSupported(
          'ECDH with the provided key is not allowed or not supported by your javascript runtime',
        )
      }
      const { apu, apv } = providedParameters
      let ephemeralKey: types.CryptoKey
      if (providedParameters.epk) {
        ephemeralKey = (await prepareKey(
          jweAlgorithm(alg),
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
      const sharedSecret = await ecdhesDeriveKey(
        key,
        ephemeralKey,
        alg === 'ECDH-ES' ? enc.alg : alg,
        alg === 'ECDH-ES' ? enc.cekBits : parseInt(alg.slice(-5, -2), 10),
        apu,
        apv,
      )
      parameters = { epk: { x, crv, kty } }
      if (kty === 'EC') parameters.epk!.y = y
      if (apu) parameters.apu = b64u(apu)
      if (apv) parameters.apv = b64u(apv)

      if (alg === 'ECDH-ES') {
        cek = sharedSecret
        break
      }

      // Key Agreement with Key Wrapping
      cek = providedCek || generateCek(enc)
      const kwAlg = alg.slice(-6)
      encryptedKey = await aeskwWrap(kwAlg, sharedSecret, cek)
      break
    }
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      cek = providedCek || generateCek(enc)
      assertCryptoKey(key)
      encryptedKey = await rsaesEncrypt(alg, key, cek)
      break
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      cek = providedCek || generateCek(enc)
      const { p2c, p2s } = providedParameters
      ;({ encryptedKey, ...parameters } = await pbes2kwWrap(alg, key, cek, p2c, p2s))
      break
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      cek = providedCek || generateCek(enc)
      encryptedKey = await aeskwWrap(alg, key, cek)
      break
    }
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      // Key Wrapping (AES GCM KW)
      cek = providedCek || generateCek(enc)
      const { iv } = providedParameters
      ;({ encryptedKey, ...parameters } = await aesGcmKwWrap(
        jweEncryption(jweAlgorithm(alg).gcmkw!),
        key,
        cek,
        iv,
      ))
      break
    }
    default: {
      throw new JOSENotSupported(unsupportedAlgHeader)
    }
  }

  return { cek, encryptedKey, parameters }
}
