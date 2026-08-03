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
import { checkCryptoKey, checkModulusLength, checkUsage } from './crypto_key.js'
import { concat, encode, uint32be } from './buffer_utils.js'
import { assertCryptoKey } from './is_key_like.js'

type SubtleCryptoWithGetPublicKey = SubtleCrypto & {
  getPublicKey?(key: types.CryptoKey, keyUsages: KeyUsage[]): Promise<types.CryptoKey>
}

/** Unreachable - the integrated algorithms never come through here, but their names widen the union. */
const unsupportedAlg = 'Unsupported JWE key management algorithm'

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

async function aeskwCryptoKey(key: types.CryptoKey | Uint8Array, alg: string, usage: KeyUsage) {
  const expected = jweAlgorithm(alg).subtle
  const cryptoKey =
    key instanceof Uint8Array
      ? await crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'AES-KW', true, [
          usage,
        ])
      : key
  checkCryptoKey(cryptoKey, expected, usage)
  return cryptoKey
}

async function aeskwWrap(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  cek: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await aeskwCryptoKey(key, alg, 'wrapKey')

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

function pbes2CryptoKey(key: types.CryptoKey | Uint8Array, alg: string) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, 'PBKDF2', false, [
      'deriveBits',
    ])
  }

  checkCryptoKey(key, jweAlgorithm(alg).subtle, 'deriveBits')
  return key
}

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

  const cryptoKey = await pbes2CryptoKey(key, alg)

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

function assertEncryptedKey(
  encryptedKey: Uint8Array | undefined,
): asserts encryptedKey is Uint8Array {
  if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')
}

function assertNoEncryptedKey(encryptedKey: Uint8Array | undefined): void {
  if (encryptedKey !== undefined) throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')
}

export async function decryptKeyManagement(
  alg: string,
  enc: JWEEncryption,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  options?: types.DecryptOptions,
): Promise<types.CryptoKey | Uint8Array> {
  const entry = jweAlgorithm(alg)
  if (alg === 'dir') {
    assertNoEncryptedKey(encryptedKey)

    return key
  }

  switch (entry.subtle.name) {
    case 'ECDH': {
      if (alg === 'ECDH-ES') assertNoEncryptedKey(encryptedKey)
      if (!isObject<types.JWK>(joseHeader.epk))
        throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`)

      assertEcdhKey(key)

      const epk = await jwkToKey(entry, joseHeader.epk)
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
    case 'RSA-OAEP': {
      assertEncryptedKey(encryptedKey)
      assertCryptoKey(key)
      checkRsaKey(alg, key, 'decrypt')
      return new Uint8Array(
        await crypto.subtle.decrypt('RSA-OAEP', key, encryptedKey as Uint8Array<ArrayBuffer>),
      )
    }
    case 'PBKDF2': {
      assertEncryptedKey(encryptedKey)

      if (typeof joseHeader.p2c !== 'number')
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`)

      const p2cLimit = options?.maxPBES2Count || 10_000

      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`)

      if (typeof joseHeader.p2s !== 'string')
        throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`)

      const p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid)
      const derived = await deriveKey(p2s, alg, joseHeader.p2c, key)
      return aeskwUnwrap(alg.slice(-6), derived, encryptedKey)
    }
    case 'AES-KW': {
      assertEncryptedKey(encryptedKey)

      return aeskwUnwrap(alg, key, encryptedKey)
    }
    case 'AES-GCM': {
      assertEncryptedKey(encryptedKey)

      if (typeof joseHeader.iv !== 'string')
        throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`)

      if (typeof joseHeader.tag !== 'string')
        throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`)

      let iv: Uint8Array
      iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid)
      let tag: Uint8Array
      tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid)

      return decrypt(jweEncryption(alg.slice(0, -2)), key, encryptedKey, iv, tag, new Uint8Array())
    }
    default:
      throw new JOSENotSupported(unsupportedAlg)
  }
}

export async function encryptKeyManagement(
  alg: string,
  enc: JWEEncryption,
  key: types.CryptoKey | Uint8Array,
  providedCek?: Uint8Array,
  providedParameters: JWEKeyManagementHeaderParameters = {},
): Promise<
  [
    cek: types.CryptoKey | Uint8Array,
    encryptedKey: Uint8Array | undefined,
    parameters: JWEHeaderParameters | undefined,
  ]
> {
  let encryptedKey: Uint8Array | undefined
  let parameters: (JWEHeaderParameters & { epk?: JWK }) | undefined
  let cek: types.CryptoKey | Uint8Array

  const entry = jweAlgorithm(alg)
  if (alg === 'dir') return [key, undefined, undefined]

  switch (entry.subtle.name) {
    case 'ECDH': {
      assertEcdhKey(key)
      const { apu, apv } = providedParameters
      let ephemeralKey: types.CryptoKey
      if (providedParameters.epk) {
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
    case 'RSA-OAEP': {
      cek = providedCek || generateCek(enc)
      assertCryptoKey(key)
      checkRsaKey(alg, key, 'encrypt')
      encryptedKey = new Uint8Array(
        await crypto.subtle.encrypt('RSA-OAEP', key, cek as Uint8Array<ArrayBuffer>),
      )
      break
    }
    case 'PBKDF2': {
      cek = providedCek || generateCek(enc)
      const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters
      const derived = await deriveKey(p2s, alg, p2c, key)
      encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek)
      parameters = { p2c, p2s: b64u(p2s) }
      break
    }
    case 'AES-KW': {
      cek = providedCek || generateCek(enc)
      encryptedKey = await aeskwWrap(alg, key, cek)
      break
    }
    case 'AES-GCM': {
      cek = providedCek || generateCek(enc)
      const { iv } = providedParameters
      const wrapped = await encrypt(jweEncryption(alg.slice(0, -2)), cek, key, iv, new Uint8Array())
      encryptedKey = wrapped.ciphertext
      parameters = { iv: b64u(wrapped.iv!), tag: b64u(wrapped.tag!) }
      break
    }
    default:
      throw new JOSENotSupported(unsupportedAlg)
  }

  return [cek, encryptedKey, parameters]
}
