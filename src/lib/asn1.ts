import type * as types from '../types.d.ts'
import { invalidKeyInput } from './invalid_key_input.js'
import { encodeBase64, decodeBase64 } from '../lib/base64.js'
import { JOSENotSupported } from '../util/errors.js'
import { isCryptoKey, isKeyObject } from './is_key_like.js'

import type { KeyImportOptions } from '../key/import.js'

/**
 * Formats a base64 string as a PEM-encoded key with proper line breaks and headers.
 *
 * @param b64 - Base64-encoded key data
 * @param descriptor - Key type descriptor (e.g., "PUBLIC KEY", "PRIVATE KEY")
 *
 * @returns PEM-formatted string
 */
const formatPEM = (b64: string, descriptor: string) => {
  const newlined = (b64.match(/.{1,64}/g) || []).join('\n')
  return `-----BEGIN ${descriptor}-----\n${newlined}\n-----END ${descriptor}-----`
}

interface ExportOptions {
  format: 'pem'
  type: 'spki' | 'pkcs8'
}

interface ExtractableKeyObject extends types.KeyObject {
  export(arg: ExportOptions): string
}

const genericExport = async (
  keyType: 'private' | 'public',
  keyFormat: 'spki' | 'pkcs8',
  key: unknown,
) => {
  if (isKeyObject(key)) {
    if (key.type !== keyType) {
      throw new TypeError(`key is not a ${keyType} key`)
    }

    return (key as ExtractableKeyObject).export({ format: 'pem', type: keyFormat })
  }

  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject'))
  }

  if (!key.extractable) {
    throw new TypeError('CryptoKey is not extractable')
  }

  if (key.type !== keyType) {
    throw new TypeError(`key is not a ${keyType} key`)
  }

  return formatPEM(
    encodeBase64(new Uint8Array(await crypto.subtle.exportKey(keyFormat, key))),
    `${keyType.toUpperCase()} KEY`,
  )
}

export const toSPKI = (key: unknown): Promise<string> => genericExport('public', 'spki', key)

export const toPKCS8 = (key: unknown): Promise<string> => genericExport('private', 'pkcs8', key)

/** Helper function to compare two byte arrays for equality */
const bytesEqual = (a: Uint8Array, b: readonly number[]): boolean => {
  if (a.byteLength !== b.length) return false
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/** ASN.1 DER parsing state */
interface ASN1State {
  readonly data: Uint8Array
  pos: number
}

/** Creates ASN.1 parsing state */
const createASN1State = (data: Uint8Array): ASN1State => ({ data, pos: 0 })

/** Parses ASN.1 length encoding (both short and long form) */
const parseLength = (state: ASN1State): number => {
  const first = state.data[state.pos++]
  if (first & 0x80) {
    // Long form: first byte indicates number of subsequent length bytes
    const lengthOfLen = first & 0x7f
    let length = 0
    for (let i = 0; i < lengthOfLen; i++) {
      length = (length << 8) | state.data[state.pos++]
    }
    return length
  }
  // Short form: length is encoded directly in first byte
  return first
}

/** Skips ASN.1 elements (tag + length + content) */
const skipElement = (state: ASN1State, count: number = 1): void => {
  if (count <= 0) return
  state.pos++ // Skip tag byte
  const length = parseLength(state)
  state.pos += length // Skip content bytes
  if (count > 1) {
    skipElement(state, count - 1) // Recursively skip remaining elements
  }
}

/** Expects a specific tag and throws if not found */
const expectTag = (state: ASN1State, expectedTag: number, errorMessage: string): void => {
  if (state.data[state.pos++] !== expectedTag) {
    throw new Error(errorMessage)
  }
}

/** Gets a subarray from current position */
const getSubarray = (state: ASN1State, length: number): Uint8Array => {
  const result = state.data.subarray(state.pos, state.pos + length)
  state.pos += length
  return result
}

/** Parses algorithm OID and returns the OID bytes */
const parseAlgorithmOID = (state: ASN1State): Uint8Array => {
  expectTag(state, 0x06, 'Expected algorithm OID')
  const oidLen = parseLength(state)
  return getSubarray(state, oidLen)
}

/** Parses a PKCS#8 private key structure up to the privateKey field */
function parsePKCS8Header(state: ASN1State) {
  // Parse outer SEQUENCE (PrivateKeyInfo)
  expectTag(state, 0x30, 'Invalid PKCS#8 structure')
  parseLength(state) // Skip outer length

  // Skip version (INTEGER)
  expectTag(state, 0x02, 'Expected version field')
  const verLen = parseLength(state)
  state.pos += verLen

  // Parse privateKeyAlgorithm (AlgorithmIdentifier SEQUENCE)
  expectTag(state, 0x30, 'Expected algorithm identifier')
  const algIdLen = parseLength(state)
  const algIdStart = state.pos

  return { algIdStart, algIdLength: algIdLen }
}

/** Parses an SPKI structure up to the subjectPublicKey field */
function parseSPKIHeader(state: ASN1State) {
  // Parse outer SEQUENCE (SubjectPublicKeyInfo)
  expectTag(state, 0x30, 'Invalid SPKI structure')
  parseLength(state) // Skip outer length

  // Parse algorithm identifier (AlgorithmIdentifier SEQUENCE)
  expectTag(state, 0x30, 'Expected algorithm identifier')
  const algIdLen = parseLength(state)
  const algIdStart = state.pos

  return { algIdStart, algIdLength: algIdLen }
}

/** Parses algorithm identifier and returns curve name for EC/ECDH keys */
const parseECAlgorithmIdentifier = (state: ASN1State): string => {
  const algOid = parseAlgorithmOID(state)

  // id-x25519
  if (bytesEqual(algOid, [0x2b, 0x65, 0x6e])) {
    return 'X25519'
  }

  // id-ecPublicKey 1.2.840.10045.2.1
  if (!bytesEqual(algOid, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01])) {
    throw new Error('Unsupported key algorithm')
  }

  // Parse curve parameters (should be an OID for named curves)
  expectTag(state, 0x06, 'Expected curve OID')
  const curveOidLen = parseLength(state)
  const curveOid = getSubarray(state, curveOidLen)

  // Compare with known curve OIDs - NIST curves inlined
  for (const { name, oid } of [
    { name: 'P-256', oid: [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07] }, // 1.2.840.10045.3.1.7
    { name: 'P-384', oid: [0x2b, 0x81, 0x04, 0x00, 0x22] }, // 1.3.132.0.34
    { name: 'P-521', oid: [0x2b, 0x81, 0x04, 0x00, 0x23] }, // 1.3.132.0.35
  ] as const) {
    if (bytesEqual(curveOid, oid)) {
      return name
    }
  }

  throw new Error('Unsupported named curve')
}

const genericImport = async (
  keyFormat: 'spki' | 'pkcs8',
  keyData: Uint8Array,
  alg: string,
  options?: KeyImportOptions & { getNamedCurve?: (keyData: Uint8Array) => string },
) => {
  let algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  let keyUsages: KeyUsage[]

  const isPublic = keyFormat === 'spki'

  // Helper functions for determining key usage based on key type
  const getSigUsages = (): KeyUsage[] => (isPublic ? ['verify'] : ['sign'])
  const getEncUsages = (): KeyUsage[] =>
    isPublic ? ['encrypt', 'wrapKey'] : ['decrypt', 'unwrapKey']

  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = { name: 'RSA-PSS', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = getSigUsages()
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = getSigUsages()
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`,
      }
      keyUsages = getEncUsages()
      break
    case 'ES256':
    case 'ES384':
    case 'ES512': {
      const curveMap = { ES256: 'P-256', ES384: 'P-384', ES512: 'P-521' } as const
      algorithm = { name: 'ECDSA', namedCurve: curveMap[alg] }
      keyUsages = getSigUsages()
      break
    }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      try {
        const namedCurve = options!.getNamedCurve!(keyData)
        algorithm = namedCurve === 'X25519' ? { name: 'X25519' } : { name: 'ECDH', namedCurve }
      } catch (cause) {
        throw new JOSENotSupported('Invalid or unsupported key format')
      }
      keyUsages = isPublic ? [] : ['deriveBits']
      break
    }
    case 'Ed25519':
    case 'EdDSA':
      algorithm = { name: 'Ed25519' }
      keyUsages = getSigUsages()
      break
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      algorithm = { name: alg }
      keyUsages = getSigUsages()
      break
    default:
      throw new JOSENotSupported('Invalid or unsupported "alg" (Algorithm) value')
  }

  return crypto.subtle.importKey(
    keyFormat,
    keyData,
    algorithm,
    options?.extractable ?? (isPublic ? true : false),
    keyUsages,
  )
}

type PEMImportFunction = (
  pem: string,
  alg: string,
  options?: KeyImportOptions,
) => Promise<types.CryptoKey>

/** Helper function to process PEM-encoded data */
const processPEMData = (pem: string, pattern: RegExp): Uint8Array => {
  return decodeBase64(pem.replace(pattern, ''))
}

export const fromPKCS8: PEMImportFunction = (pem, alg, options?) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g)

  let opts: Parameters<typeof genericImport>[3] = options

  if (alg?.startsWith?.('ECDH-ES')) {
    opts ||= {}
    opts.getNamedCurve = (keyData: Uint8Array) => {
      const state = createASN1State(keyData)
      parsePKCS8Header(state)
      return parseECAlgorithmIdentifier(state)
    }
  }

  return genericImport('pkcs8', keyData, alg, opts)
}

export const fromSPKI: PEMImportFunction = (pem, alg, options?) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g)

  let opts: Parameters<typeof genericImport>[3] = options

  if (alg?.startsWith?.('ECDH-ES')) {
    opts ||= {}
    opts.getNamedCurve = (keyData: Uint8Array) => {
      const state = createASN1State(keyData)
      parseSPKIHeader(state)
      return parseECAlgorithmIdentifier(state)
    }
  }

  return genericImport('spki', keyData, alg, opts)
}

/**
 * Extracts the Subject Public Key Info (SPKI) from an X.509 certificate. Parses the ASN.1 DER
 * structure to locate and extract the public key portion.
 *
 * @param buf - DER-encoded X.509 certificate bytes
 *
 * @returns SPKI structure as bytes
 */
function spkiFromX509(buf: Uint8Array): Uint8Array {
  const state = createASN1State(buf)

  // Parse outer certificate SEQUENCE
  expectTag(state, 0x30, 'Invalid certificate structure')
  parseLength(state) // Skip certificate length

  // Parse tbsCertificate (To Be Signed Certificate) SEQUENCE
  expectTag(state, 0x30, 'Invalid tbsCertificate structure')
  parseLength(state) // Skip tbsCertificate length

  if (buf[state.pos] === 0xa0) {
    // Optional version field present (context-specific [0])
    // Skip: version, serialNumber, signature algorithm, issuer, validity, subject
    skipElement(state, 6)
  } else {
    // No version field (defaults to v1)
    // Skip: serialNumber, signature algorithm, issuer, validity, subject
    skipElement(state, 5)
  }

  // Extract subjectPublicKeyInfo SEQUENCE
  const spkiStart = state.pos
  expectTag(state, 0x30, 'Invalid SPKI structure')
  const spkiContentLen = parseLength(state)

  // Return the complete SPKI structure (tag + length + content)
  return buf.subarray(spkiStart, spkiStart + spkiContentLen + (state.pos - spkiStart))
}

/**
 * Extracts SPKI from a PEM-encoded X.509 certificate string.
 *
 * @param x509 - PEM-encoded X.509 certificate
 *
 * @returns SPKI structure as bytes
 */
function extractX509SPKI(x509: string): Uint8Array {
  const derBytes = processPEMData(x509, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g)
  return spkiFromX509(derBytes)
}

export const fromX509: PEMImportFunction = (pem, alg, options?) => {
  let spki: Uint8Array
  try {
    spki = extractX509SPKI(pem)
  } catch (cause) {
    throw new TypeError('Failed to parse the X.509 certificate', { cause })
  }
  return fromSPKI(formatPEM(encodeBase64(spki), 'PUBLIC KEY'), alg, options)
}
