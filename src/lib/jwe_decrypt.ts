import type * as types from '../types.d.ts'
import { decrypt, generateCek } from './content_encryption.js'
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js'
import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { isDisjoint, isObject } from './type_checks.js'
import { decryptKeyManagement } from './key_management.js'
import { concat, decoder, encode } from './buffer_utils.js'
import { validateCrit, validateAlgorithms, JWE_RECOGNIZED } from './options.js'
import { prepareKey } from './key.js'
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import { decompress } from './deflate.js'

export type DecryptGetKey = (
  protectedHeader: types.JWEHeaderParameters | undefined,
  token: types.FlattenedJWE,
) => Promise<types.KeyInput> | types.KeyInput

/** Whatever a decryption needs that is the same for every recipient of a given JWE. */
export type DecryptShared = [
  keyManagementAlgorithms: Set<string> | undefined,
  contentEncryptionAlgorithms: Set<string> | undefined,
  options: types.DecryptOptions | undefined,
]

export type DecryptedJWE = [
  plaintext: Uint8Array,
  parsedProt: types.JWEHeaderParameters | undefined,
  key: types.CryptoKey | Uint8Array,
  resolvedKey: boolean,
]

/**
 * The parts of a JWE that every recipient shares. A General JWE pays for these once instead of once
 * per recipient.
 */
export type SharedJWE = [
  parsedProt: types.JWEHeaderParameters | undefined,
  ciphertext: Uint8Array,
  iv: Uint8Array | undefined,
  tag: Uint8Array | undefined,
  additionalData: Uint8Array,
]

/** Checks the members every recipient of a General JWE shares. */
export function checkShared(jwe: types.FlattenedJWE): void {
  const { ciphertext, protected: encodedProtected, unprotected } = jwe
  if (jwe.iv !== undefined && typeof jwe.iv !== 'string') {
    throw new JWEInvalid('JWE Initialization Vector incorrect type')
  }

  if (typeof ciphertext !== 'string') {
    throw new JWEInvalid('JWE Ciphertext missing or incorrect type')
  }

  if (jwe.tag !== undefined && typeof jwe.tag !== 'string') {
    throw new JWEInvalid('JWE Authentication Tag incorrect type')
  }

  if (encodedProtected !== undefined && typeof encodedProtected !== 'string') {
    throw new JWEInvalid('JWE Protected Header incorrect type')
  }

  if (jwe.aad !== undefined && (typeof jwe.aad !== 'string' || !jwe.aad)) {
    throw new JWEInvalid('JWE AAD incorrect type')
  }

  if (unprotected !== undefined && !isObject(unprotected)) {
    throw new JWEInvalid('JWE Shared Unprotected Header incorrect type')
  }
}

/** Checks the members that belong to one recipient. */
export function checkRecipient(jwe: types.FlattenedJWE): void {
  const { encrypted_key: encryptedKey, header } = jwe
  if (encryptedKey !== undefined && typeof encryptedKey !== 'string') {
    throw new JWEInvalid('JWE Encrypted Key incorrect type')
  }

  if (header !== undefined && !isObject(header)) {
    throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type')
  }

  if (jwe.protected === undefined && header === undefined && jwe.unprotected === undefined) {
    throw new JWEInvalid('JOSE Header missing')
  }
}

/** Parses and decodes the shared members. Their types must already have been checked. */
export function shareJWE(jwe: types.FlattenedJWE): SharedJWE {
  const { protected: encodedProtected, ciphertext, iv, tag, aad } = jwe
  let parsedProt: types.JWEHeaderParameters | undefined
  if (encodedProtected !== undefined) {
    parsedProt = parseJoseHeader(encodedProtected, JWEInvalid, 'JWE Protected Header is invalid')
  }

  const protectedHeader: Uint8Array =
    encodedProtected !== undefined ? encode(encodedProtected) : new Uint8Array()

  return [
    parsedProt,
    decodeBase64url(ciphertext, 'ciphertext', JWEInvalid),
    iv !== undefined ? decodeBase64url(iv, 'iv', JWEInvalid) : undefined,
    tag !== undefined ? decodeBase64url(tag, 'tag', JWEInvalid) : undefined,
    aad !== undefined
      ? concat(protectedHeader, encode('.'), encodeBase64url(aad, 'aad', JWEInvalid))
      : protectedHeader,
  ]
}

/** Flattened and General results have the same shape, so they are assembled in one place. */
export function decryptResult(
  jwe: types.FlattenedJWE,
  decrypted: DecryptedJWE,
): types.FlattenedDecryptResult & Partial<types.ResolvedKey> {
  const [plaintext, parsedProt, key, resolvedKey] = decrypted
  const { protected: encodedProtected, aad, unprotected, header } = jwe
  const result: types.FlattenedDecryptResult = { plaintext }

  if (encodedProtected !== undefined) {
    result.protectedHeader = parsedProt
  }

  if (aad !== undefined) {
    result.additionalAuthenticatedData = decodeBase64url(aad, 'aad', JWEInvalid)
  }

  if (unprotected !== undefined) {
    result.sharedUnprotectedHeader = unprotected
  }

  if (header !== undefined) {
    result.unprotectedHeader = header
  }

  if (resolvedKey) {
    return { ...result, key }
  }

  return result
}

export function prepareDecrypt(options?: types.DecryptOptions): DecryptShared {
  return [
    options && validateAlgorithms('keyManagementAlgorithms', options.keyManagementAlgorithms),
    options &&
      validateAlgorithms('contentEncryptionAlgorithms', options.contentEncryptionAlgorithms),
    options,
  ]
}

/** Decrypts for one recipient, given the already-parsed shared parts of the JWE. */
export async function decryptRecipient(
  jwe: types.FlattenedJWE,
  token: SharedJWE,
  shared: DecryptShared,
  key: types.KeyInput | DecryptGetKey,
): Promise<DecryptedJWE> {
  const [keyManagementAlgorithms, contentEncryptionAlgorithms, options] = shared
  const [parsedProt, ciphertext, iv, tag, additionalData] = token
  const { encrypted_key: encodedKey, header, unprotected } = jwe

  let joseHeader: types.JWEHeaderParameters
  if (header !== undefined || unprotected !== undefined) {
    if (!isDisjoint(parsedProt, header, unprotected)) {
      throw new JWEInvalid(
        'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
      )
    }
    joseHeader = { ...parsedProt, ...header, ...unprotected }
  } else {
    joseHeader = parsedProt ?? {}
  }

  validateCrit(JWEInvalid, JWE_RECOGNIZED, options?.crit, parsedProt, joseHeader)

  if (joseHeader.zip !== undefined && joseHeader.zip !== 'DEF') {
    throw new JOSENotSupported(
      'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
    )
  }

  if (joseHeader.zip !== undefined && !parsedProt?.zip) {
    throw new JWEInvalid(
      'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    )
  }

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header')
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header')
  }

  if (
    (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) ||
    (!keyManagementAlgorithms && alg.startsWith('PBES2'))
  ) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed')
  }

  if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
    throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed')
  }

  const encEntry = jweEncryption(enc)

  let encryptedKey!: Uint8Array
  if (encodedKey !== undefined) {
    encryptedKey = decodeBase64url(encodedKey, 'encrypted_key', JWEInvalid)
  }

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jwe)
    resolvedKey = true
  }
  const algEntry = jweAlgorithm(alg)
  const k = await prepareKey(alg === 'dir' ? encEntry : algEntry, key, 'decrypt')
  let cek: types.CryptoKey | Uint8Array
  try {
    cek = await decryptKeyManagement(alg, encEntry, k, encryptedKey, joseHeader, options)
    if (
      encodedKey !== undefined &&
      cek instanceof Uint8Array &&
      cek.byteLength << 3 !== encEntry.cekBits
    ) {
      cek = generateCek(encEntry)
    }
  } catch (err) {
    if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
      throw err
    }
    // https://www.rfc-editor.org/info/rfc7516/#section-11.5
    // To mitigate the attacks described in RFC 3218, the
    // recipient MUST NOT distinguish between format, padding, and length
    // errors of encrypted keys.  It is strongly recommended, in the event
    // of receiving an improperly formatted key, that the recipient
    // substitute a randomly generated CEK and proceed to the next step, to
    // mitigate timing attacks.
    cek = generateCek(encEntry)
  }

  let plaintext = await decrypt(encEntry, cek, ciphertext, iv, tag, additionalData)

  if (joseHeader.zip === 'DEF') {
    const maxDecompressedLength = options?.maxDecompressedLength ?? 250_000
    if (maxDecompressedLength === 0) {
      throw new JOSENotSupported(
        'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      )
    }
    if (
      maxDecompressedLength !== Infinity &&
      (!Number.isSafeInteger(maxDecompressedLength) || maxDecompressedLength < 1)
    ) {
      throw new TypeError('maxDecompressedLength must be 0, a positive safe integer, or Infinity')
    }
    plaintext = await decompress(plaintext, maxDecompressedLength).catch((cause) => {
      if (cause instanceof JWEInvalid) throw cause
      throw new JWEInvalid('Failed to decompress plaintext', { cause })
    })
  }

  return [plaintext, parsedProt, k, resolvedKey]
}

/**
 * Decrypts a single-recipient JWE. `jwe` must already have been checked to have the member types
 * the Flattened Serialization requires; the Compact adapter gets that for free from String#split.
 */
export async function decryptJWE(
  jwe: types.FlattenedJWE,
  shared: DecryptShared,
  key: types.KeyInput | DecryptGetKey,
): Promise<DecryptedJWE> {
  return decryptRecipient(jwe, shareJWE(jwe), shared, key)
}

/** Splits a Compact JWE and decrypts it. Every member is a string by construction. */
export async function decryptCompact(
  jwe: string | Uint8Array,
  shared: DecryptShared,
  key: types.KeyInput | DecryptGetKey,
): Promise<DecryptedJWE> {
  if (jwe instanceof Uint8Array) {
    jwe = decoder.decode(jwe)
  }

  if (typeof jwe !== 'string') {
    throw new JWEInvalid('Compact JWE must be a string or Uint8Array')
  }

  const {
    0: protectedHeader,
    1: encryptedKey,
    2: iv,
    3: ciphertext,
    4: tag,
    length,
  } = jwe.split('.')

  if (length !== 5) {
    throw new JWEInvalid('Invalid Compact JWE')
  }

  return decryptJWE(
    {
      ciphertext,
      iv: iv || undefined,
      protected: protectedHeader,
      tag: tag || undefined,
      encrypted_key: encryptedKey || undefined,
    },
    shared,
    key,
  )
}
