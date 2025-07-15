import type * as types from '../types.d.ts'
import invalidKeyInput from './invalid_key_input.js'
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

export const toSPKI = (key: unknown): Promise<string> => {
  return genericExport('public', 'spki', key)
}

export const toPKCS8 = (key: unknown): Promise<string> => {
  return genericExport('private', 'pkcs8', key)
}

/**
 * Detects the named curve from ECDH/ECDSA key data by searching for curve OID patterns.
 *
 * @param keyData - The key data to analyze
 *
 * @returns The curve name ('P-256', 'P-384', or 'P-521') or undefined if not found
 */
const getNamedCurve = (keyData: Uint8Array): string | undefined => {
  // OID patterns for NIST curves (Object Identifier byte sequences)
  const patterns = Object.entries({
    'P-256': [0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07],
    'P-384': [0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22],
    'P-521': [0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x23],
  })

  const maxPatternLen = Math.max(...Object.values(patterns).map((a) => a.length))

  for (let i = 0; i <= keyData.byteLength - maxPatternLen; i++) {
    for (const [curve, bytes] of patterns) {
      if (i <= keyData.byteLength - bytes.length) {
        if (keyData.subarray(i, i + bytes.length).every((byte, idx) => byte === bytes[idx])) {
          return curve
        }
      }
    }
  }

  return undefined
}

const genericImport = async (
  keyFormat: 'spki' | 'pkcs8',
  keyData: Uint8Array,
  alg: string,
  options?: KeyImportOptions,
) => {
  let algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  let keyUsages: KeyUsage[]

  const isPublic = keyFormat === 'spki'

  // Helper functions for determining key usage based on key type
  const getSignatureUsages = (): KeyUsage[] => (isPublic ? ['verify'] : ['sign'])
  const getEncryptionUsages = (): KeyUsage[] =>
    isPublic ? ['encrypt', 'wrapKey'] : ['decrypt', 'unwrapKey']

  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = { name: 'RSA-PSS', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = getSignatureUsages()
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = getSignatureUsages()
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`,
      }
      keyUsages = getEncryptionUsages()
      break
    case 'ES256':
    case 'ES384':
    case 'ES512': {
      const curveMap = { ES256: 'P-256', ES384: 'P-384', ES512: 'P-521' } as const
      algorithm = { name: 'ECDSA', namedCurve: curveMap[alg] }
      keyUsages = getSignatureUsages()
      break
    }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      const namedCurve = getNamedCurve(keyData)
      algorithm = namedCurve ? { name: 'ECDH', namedCurve } : { name: 'X25519' }
      keyUsages = isPublic ? [] : ['deriveBits']
      break
    }
    case 'Ed25519':
    case 'EdDSA':
      algorithm = { name: 'Ed25519' }
      keyUsages = getSignatureUsages()
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

export const fromPKCS8: PEMImportFunction = (pem, alg, options?) => {
  const keyData = decodeBase64(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''))
  return genericImport('pkcs8', keyData, alg, options)
}

export const fromSPKI: PEMImportFunction = (pem, alg, options?) => {
  const keyData = decodeBase64(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''))
  return genericImport('spki', keyData, alg, options)
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
  // Parse ASN.1 DER structure to extract SPKI from X.509 certificate
  let pos = 0

  // Helper function to parse ASN.1 length encoding (both short and long form)
  const parseLength = (): number => {
    const first = buf[pos++]
    if (first & 0x80) {
      // Long form: first byte indicates number of subsequent length bytes
      const lengthOfLength = first & 0x7f
      let length = 0
      for (let i = 0; i < lengthOfLength; i++) {
        length = (length << 8) | buf[pos++]
      }
      return length
    }
    // Short form: length is encoded directly in first byte
    return first
  }

  // Helper function to skip ASN.1 elements (tag + length + content)
  const skipElement = (count: number = 1): void => {
    if (count <= 0) return
    pos++ // Skip tag byte
    const length = parseLength()
    pos += length // Skip content bytes
    if (count > 1) {
      skipElement(count - 1) // Recursively skip remaining elements
    }
  }

  // Parse outer certificate SEQUENCE
  if (buf[pos++] !== 0x30) throw new Error('Invalid certificate structure')
  parseLength() // Skip certificate length

  // Parse tbsCertificate (To Be Signed Certificate) SEQUENCE
  if (buf[pos++] !== 0x30) throw new Error('Invalid tbsCertificate structure')
  parseLength() // Skip tbsCertificate length

  if (buf[pos] === 0xa0) {
    // Optional version field present (context-specific [0])
    // Skip: version, serialNumber, signature algorithm, issuer, validity, subject
    skipElement(6)
  } else {
    // No version field (defaults to v1)
    // Skip: serialNumber, signature algorithm, issuer, validity, subject
    skipElement(5)
  }

  // Extract subjectPublicKeyInfo SEQUENCE
  const spkiStart = pos
  if (buf[pos++] !== 0x30) throw new Error('Invalid SPKI structure')
  const spkiContentLength = parseLength()

  // Return the complete SPKI structure (tag + length + content)
  return buf.subarray(spkiStart, spkiStart + spkiContentLength + (pos - spkiStart))
}

/**
 * Extracts SPKI from a PEM-encoded X.509 certificate string.
 *
 * @param x509 - PEM-encoded X.509 certificate
 *
 * @returns SPKI structure as bytes
 */
function extractX509SPKI(x509: string): Uint8Array {
  const base64Content = x509.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, '')
  const derBytes = decodeBase64(base64Content)
  return spkiFromX509(derBytes)
}

export const fromX509: PEMImportFunction = (pem, alg, options?) => {
  let spki: Uint8Array
  try {
    spki = extractX509SPKI(pem)
  } catch (cause) {
    throw new TypeError('Failed to parse the X.509 certificate', { cause })
  }
  return genericImport('spki', spki, alg, options)
}
