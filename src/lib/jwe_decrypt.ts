import type * as types from '../types.d.ts'
import { decrypt, generateCek } from './content_encryption.js'
import {
  decodeBase64url,
  encodeBase64url,
  parseJoseHeader,
  isDisjoint,
  isObject,
  validateCrit,
  validateAlgorithms,
  JWE_RECOGNIZED,
} from './validate.js'
import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { decryptKeyManagement } from './key_management.js'
import { decoder } from './buffer_utils.js'
import { prepareKey } from './key.js'
import { JWE, isJWECEKTransport, jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import type { JWEEncryption } from './jwe_algorithms.js'
import { decompress, validateZip } from './deflate.js'

export type DecryptGetKey = (
  protectedHeader: types.JWEHeaderParameters | undefined,
  token: types.FlattenedJWE,
) => Promise<types.KeyInput> | types.KeyInput

/** Whatever a decryption needs that is the same for every recipient of a given JWE. */
export type DecryptShared = [
  keyManagementAlgorithms: Set<string> | undefined,
  contentEncryptionAlgorithms: Set<string> | undefined,
  crit: { [propName: string]: boolean } | undefined,
  maxPBES2Count: number | undefined,
  maxDecompressedLength: number | undefined,
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

export type SharedJWEMembers = Pick<
  types.FlattenedJWE,
  'aad' | 'ciphertext' | 'iv' | 'protected' | 'tag' | 'unprotected'
>

export type RecipientJWEMembers = Pick<types.FlattenedJWE, 'encrypted_key' | 'header'>

export type RecipientJWESnapshot =
  | [members: RecipientJWEMembers, headerAlg: unknown, error?: never]
  | [members: undefined, headerAlg: unknown, error: unknown]

/** Captures and validates shared members without reading any of them twice. */
export function snapshotSharedJWE(jwe: types.FlattenedJWE | types.GeneralJWE): SharedJWEMembers {
  const { aad, ciphertext, iv, protected: encodedProtected, tag, unprotected } = jwe
  if (iv !== undefined && (typeof iv !== 'string' || !iv)) {
    throw new JWEInvalid('JWE Initialization Vector incorrect type')
  }

  if (typeof ciphertext !== 'string') {
    throw new JWEInvalid('JWE Ciphertext missing or incorrect type')
  }

  if (tag !== undefined && (typeof tag !== 'string' || !tag)) {
    throw new JWEInvalid('JWE Authentication Tag incorrect type')
  }

  if (encodedProtected !== undefined && typeof encodedProtected !== 'string') {
    throw new JWEInvalid('JWE Protected Header incorrect type')
  }

  if (aad !== undefined && (typeof aad !== 'string' || !aad)) {
    throw new JWEInvalid('JWE AAD incorrect type')
  }

  if (unprotected !== undefined && !isObject(unprotected)) {
    throw new JWEInvalid('JWE Shared Unprotected Header incorrect type')
  }

  return {
    aad,
    ciphertext,
    iv,
    protected: encodedProtected,
    tag,
    unprotected: unprotected === undefined ? undefined : { ...unprotected },
  }
}

/** Captures one recipient's serialization members without reading either of them twice. */
export function snapshotRecipientJWE(recipient: RecipientJWEMembers): RecipientJWESnapshot {
  let header: types.JWEHeaderParameters | undefined
  let headerAlg: unknown
  try {
    const { header: inputHeader } = recipient
    if (isObject<types.JWEHeaderParameters>(inputHeader)) {
      headerAlg = inputHeader.alg
      const parameters = Object.keys(inputHeader)
      if (!parameters.includes('alg')) headerAlg = undefined
      header = Object.fromEntries(
        parameters.map((parameter) => [
          parameter,
          parameter === 'alg' ? headerAlg : inputHeader[parameter],
        ]),
      )
    } else {
      header = inputHeader
    }
    const { encrypted_key: encryptedKey } = recipient
    return [{ encrypted_key: encryptedKey, header }, headerAlg]
  } catch (error) {
    return [undefined, headerAlg, error]
  }
}

/** Checks the members that belong to one recipient. */
export function checkRecipient(jwe: types.FlattenedJWE): void {
  const { encrypted_key: encryptedKey, header } = jwe
  // Whether an empty string is a structural error depends on the resolved key-management mode.
  // CEK transports must send it through RFC 3218 failure substitution instead.
  if (encryptedKey !== undefined && typeof encryptedKey !== 'string') {
    throw new JWEInvalid('JWE Encrypted Key incorrect type')
  }

  if (header !== undefined) {
    if (!isObject(header)) {
      throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type')
    }
  }

  if (jwe.protected === undefined && header === undefined && jwe.unprotected === undefined) {
    throw new JWEInvalid('JOSE Header missing')
  }
}

/** Parses and decodes the shared members. Their types must already have been checked. */
export function shareJWE(jwe: SharedJWEMembers): SharedJWE {
  const { protected: encodedProtected, ciphertext, iv, tag, aad } = jwe
  let parsedProt: types.JWEHeaderParameters | undefined
  if (encodedProtected !== undefined) {
    parsedProt = parseJoseHeader(encodedProtected, JWEInvalid, 'JWE Protected Header is invalid')
  }

  return [
    parsedProt,
    decodeBase64url(ciphertext, 'ciphertext', JWEInvalid),
    iv !== undefined ? decodeBase64url(iv, 'iv', JWEInvalid) : undefined,
    tag !== undefined ? decodeBase64url(tag, 'tag', JWEInvalid) : undefined,
    encodeBase64url(
      (encodedProtected ?? '') + (aad !== undefined ? `.${aad}` : ''),
      'aad',
      JWEInvalid,
    ),
  ]
}

export function prepareDecrypt(options?: types.DecryptOptions): DecryptShared {
  return [
    options && validateAlgorithms('keyManagementAlgorithms', options.keyManagementAlgorithms),
    options &&
      validateAlgorithms('contentEncryptionAlgorithms', options.contentEncryptionAlgorithms),
    options?.crit,
    options?.maxPBES2Count,
    options?.maxDecompressedLength,
  ]
}

/** Decrypts one recipient, optionally reusing a General JWE's already-decoded shared members. */
export async function decryptJWE(
  jwe: types.FlattenedJWE,
  shared: DecryptShared,
  key: types.KeyInput | DecryptGetKey,
  token: SharedJWE = shareJWE(jwe),
): Promise<types.FlattenedDecryptResult & Partial<types.ResolvedKey>> {
  const [parsedProt, ciphertext, iv, tag, additionalData] = token
  const { header, unprotected, aad } = jwe

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

  const [
    keyManagementAlgorithms,
    contentEncryptionAlgorithms,
    crit,
    maxPBES2Count,
    maxDecompressedLength,
  ] = shared
  const { encrypted_key: encodedKey } = jwe

  validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, parsedProt, joseHeader)

  validateZip(joseHeader, parsedProt)

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header')
  }

  const selected = JWE[alg]
  if (encodedKey === '' && (!selected || !isJWECEKTransport(selected))) {
    throw new JWEInvalid('JWE Encrypted Key incorrect type')
  }
  const integrated = selected?.mode === 'integrated-encryption'
  if (!integrated && (typeof enc !== 'string' || !enc)) {
    throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header')
  }

  if (
    (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) ||
    (!keyManagementAlgorithms && alg.startsWith('PBES2'))
  ) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed')
  }

  let encEntry: JWEEncryption | undefined
  if (integrated) {
    if (enc !== undefined) {
      throw new JWEInvalid(
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
      )
    }
    if (iv?.byteLength) {
      throw new JWEInvalid('JWE Initialization Vector must be empty for integrated encryption')
    }
    if (tag?.byteLength) {
      throw new JWEInvalid('JWE Authentication Tag must be empty for integrated encryption')
    }
  } else {
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc as string)) {
      throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed')
    }
    encEntry = jweEncryption(enc)
  }

  let encryptedKey: Uint8Array | undefined
  if (encodedKey !== undefined) {
    try {
      encryptedKey = decodeBase64url(encodedKey, 'encrypted_key', JWEInvalid)
    } catch (error) {
      if (!selected || !isJWECEKTransport(selected)) throw error
      // RFC 7516 Section 11.5 requires a transported CEK's format, padding, and length failures
      // to be indistinguishable. Feed malformed encodings through the same unwrap/decrypt and
      // random-CEK substitution path as other malformed Encrypted Key values.
      encryptedKey = new Uint8Array()
    }
  }

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jwe)
    resolvedKey = true
  }
  const algEntry = selected ?? jweAlgorithm(alg)
  if (isJWECEKTransport(algEntry) && encryptedKey === undefined) {
    // RFC 7516 Section 11.5 requires malformed, missing, and wrong-length transported CEKs to be
    // indistinguishable. Let the unwrap/decrypt fail and substitute a random CEK below.
    encryptedKey = new Uint8Array()
  }
  const k = await prepareKey(
    algEntry.mode === 'direct-encryption' ? encEntry! : algEntry,
    key,
    'decrypt',
  )

  let plaintext: Uint8Array
  if (algEntry.mode === 'integrated-encryption') {
    plaintext = await algEntry.decrypt(
      k,
      encryptedKey,
      ciphertext,
      additionalData,
      parsedProt,
      joseHeader,
    )
  } else {
    const encryption = encEntry!
    let cek: types.CryptoKey | Uint8Array
    try {
      cek = await decryptKeyManagement(
        algEntry,
        encryption,
        k,
        encryptedKey,
        joseHeader,
        maxPBES2Count,
      )
      if (
        isJWECEKTransport(algEntry) &&
        cek instanceof Uint8Array &&
        cek.byteLength << 3 !== encryption.cekBits
      ) {
        cek = generateCek(encryption)
      }
    } catch (err) {
      if (
        err instanceof TypeError ||
        err instanceof JWEInvalid ||
        err instanceof JOSENotSupported
      ) {
        throw err
      }
      // https://www.rfc-editor.org/info/rfc7516/#section-11.5
      // To mitigate the attacks described in RFC 3218, the
      // recipient MUST NOT distinguish between format, padding, and length
      // errors of encrypted keys.  It is strongly recommended, in the event
      // of receiving an improperly formatted key, that the recipient
      // substitute a randomly generated CEK and proceed to the next step, to
      // mitigate timing attacks.
      cek = generateCek(encryption)
    }

    plaintext = await decrypt(encryption, cek, ciphertext, iv, tag, additionalData)
  }

  if (joseHeader.zip === 'DEF') {
    const decompressionLimit = maxDecompressedLength ?? 250_000
    if (decompressionLimit === 0) {
      throw new JOSENotSupported(
        'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      )
    }
    if (
      decompressionLimit !== Infinity &&
      (!Number.isSafeInteger(decompressionLimit) || decompressionLimit < 1)
    ) {
      throw new TypeError('maxDecompressedLength must be 0, a positive safe integer, or Infinity')
    }
    plaintext = await decompress(plaintext, decompressionLimit).catch((cause) => {
      if (cause instanceof JWEInvalid) throw cause
      throw new JWEInvalid('Failed to decompress plaintext', { cause })
    })
  }

  return {
    plaintext,
    ...(parsedProt && { protectedHeader: parsedProt }),
    ...(aad !== undefined && {
      additionalAuthenticatedData: decodeBase64url(aad, 'aad', JWEInvalid),
    }),
    ...(unprotected && { sharedUnprotectedHeader: unprotected }),
    ...(header && { unprotectedHeader: header }),
    ...(resolvedKey && { key: k }),
  }
}

/** Splits a Compact JWE and decrypts it. Every member is a string by construction. */
export async function decryptCompact(
  jwe: string | Uint8Array,
  shared: DecryptShared,
  key: types.KeyInput | DecryptGetKey,
): Promise<types.CompactDecryptResult & Partial<types.ResolvedKey>> {
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

  const flattened = {
    ciphertext,
    iv: iv || undefined,
    protected: protectedHeader,
    tag: tag || undefined,
    encrypted_key: encryptedKey || undefined,
  }
  return decryptJWE(flattened, shared, key) as Promise<
    types.CompactDecryptResult & Partial<types.ResolvedKey>
  >
}
