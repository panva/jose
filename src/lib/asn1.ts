import type * as types from '../types.d.ts'
import invalidKeyInput from './invalid_key_input.js'
import { encodeBase64, decodeBase64 } from './base64url.js'
import { JOSENotSupported } from '../util/errors.js'
import { isCryptoKey, isKeyObject } from './is_key_like.js'

import type { KeyImportOptions } from '../key/import.js'

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

const findOid = (keyData: Uint8Array, oid: number[], from = 0): boolean => {
  if (from === 0) {
    oid.unshift(oid.length)
    oid.unshift(0x06)
  }
  const i = keyData.indexOf(oid[0], from)
  if (i === -1) return false
  const sub = keyData.subarray(i, i + oid.length)
  if (sub.length !== oid.length) return false
  return sub.every((value, index) => value === oid[index]) || findOid(keyData, oid, i + 1)
}

const getNamedCurve = (keyData: Uint8Array): string | undefined => {
  switch (true) {
    case findOid(keyData, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]):
      return 'P-256'
    case findOid(keyData, [0x2b, 0x81, 0x04, 0x00, 0x22]):
      return 'P-384'
    case findOid(keyData, [0x2b, 0x81, 0x04, 0x00, 0x23]):
      return 'P-521'
    default:
      return undefined
  }
}

const genericImport = async (
  replace: RegExp,
  keyFormat: 'spki' | 'pkcs8',
  pem: string,
  alg: string,
  options?: KeyImportOptions,
) => {
  let algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  let keyUsages: KeyUsage[]

  const keyData = new Uint8Array(
    atob(pem.replace(replace, ''))
      .split('')
      .map((c) => c.charCodeAt(0)),
  )

  const isPublic = keyFormat === 'spki'

  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = { name: 'RSA-PSS', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${alg.slice(-3)}` }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`,
      }
      keyUsages = isPublic ? ['encrypt', 'wrapKey'] : ['decrypt', 'unwrapKey']
      break
    case 'ES256':
      algorithm = { name: 'ECDSA', namedCurve: 'P-256' }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    case 'ES384':
      algorithm = { name: 'ECDSA', namedCurve: 'P-384' }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    case 'ES512':
      algorithm = { name: 'ECDSA', namedCurve: 'P-521' }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      const namedCurve = getNamedCurve(keyData)
      algorithm = namedCurve?.startsWith('P-') ? { name: 'ECDH', namedCurve } : { name: 'X25519' }
      keyUsages = isPublic ? [] : ['deriveBits']
      break
    }
    case 'Ed25519': // Fall through
    case 'EdDSA':
      algorithm = { name: 'Ed25519' }
      keyUsages = isPublic ? ['verify'] : ['sign']
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
  return genericImport(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, 'pkcs8', pem, alg, options)
}

export const fromSPKI: PEMImportFunction = (pem, alg, options?) => {
  return genericImport(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, 'spki', pem, alg, options)
}

function getElement(seq: Uint8Array) {
  const result = []
  let next = 0

  while (next < seq.length) {
    const nextPart = parseElement(seq.subarray(next))
    result.push(nextPart)
    next += nextPart.byteLength
  }
  return result
}

function parseElement(bytes: Uint8Array) {
  let position = 0

  // tag
  let tag = bytes[0] & 0x1f
  position++
  if (tag === 0x1f) {
    tag = 0
    while (bytes[position] >= 0x80) {
      tag = tag * 128 + bytes[position] - 0x80
      position++
    }
    tag = tag * 128 + bytes[position] - 0x80
    position++
  }

  // length
  let length = 0
  if (bytes[position] < 0x80) {
    length = bytes[position]
    position++
  } else if (length === 0x80) {
    length = 0

    while (bytes[position + length] !== 0 || bytes[position + length + 1] !== 0) {
      if (length > bytes.byteLength) {
        throw new TypeError('invalid indefinite form length')
      }
      length++
    }

    const byteLength = position + length + 2
    return {
      byteLength,
      contents: bytes.subarray(position, position + length),
      raw: bytes.subarray(0, byteLength),
    }
  } else {
    const numberOfDigits = bytes[position] & 0x7f
    position++
    length = 0
    for (let i = 0; i < numberOfDigits; i++) {
      length = length * 256 + bytes[position]
      position++
    }
  }

  const byteLength = position + length
  return {
    byteLength,
    contents: bytes.subarray(position, byteLength),
    raw: bytes.subarray(0, byteLength),
  }
}

function spkiFromX509(buf: Uint8Array) {
  const tbsCertificate = getElement(getElement(parseElement(buf).contents)[0].contents)
  return encodeBase64(tbsCertificate[tbsCertificate[0].raw[0] === 0xa0 ? 6 : 5].raw)
}

let createPublicKey: any
function getSPKI(x509: string): string {
  try {
    // @ts-ignore
    createPublicKey ??= globalThis.process?.getBuiltinModule?.('node:crypto')?.createPublicKey
  } catch {
    createPublicKey = 0
  }

  if (createPublicKey) {
    try {
      return new createPublicKey(x509).export({ format: 'pem', type: 'spki' })
    } catch {}
  }
  const pem = x509.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, '')
  const raw = decodeBase64(pem)
  return formatPEM(spkiFromX509(raw), 'PUBLIC KEY')
}

export const fromX509: PEMImportFunction = (pem, alg, options?) => {
  let spki: string
  try {
    spki = getSPKI(pem)
  } catch (cause) {
    throw new TypeError('Failed to parse the X.509 certificate', { cause })
  }
  return fromSPKI(spki, alg, options)
}
