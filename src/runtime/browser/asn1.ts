import { isCloudflareWorkers } from './env.js'
import crypto, { isCryptoKey } from './webcrypto.js'
import type { PEMExportFunction, PEMImportFunction } from '../interfaces.d'
import invalidKeyInput from '../../lib/invalid_key_input.js'
import { encodeBase64 } from './base64url.js'
import formatPEM from '../../lib/format_pem.js'
import { JOSENotSupported } from '../../util/errors.js'
import { types } from './is_key_like.js'

import type { PEMImportOptions } from '../../key/import.js'

const genericExport = async (
  keyType: 'private' | 'public',
  keyFormat: 'spki' | 'pkcs8',
  key: unknown,
) => {
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, ...types))
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

export const toSPKI: PEMExportFunction = (key) => {
  return genericExport('public', 'spki', key)
}

export const toPKCS8: PEMExportFunction = (key) => {
  return genericExport('private', 'pkcs8', key)
}

const findOid = (keyData: Uint8Array, oid: number[], from = 0): boolean => {
  if (from === 0) {
    oid.unshift(oid.length)
    oid.unshift(0x06)
  }
  let i = keyData.indexOf(oid[0], from)
  if (i === -1) return false
  const sub = keyData.subarray(i, i + oid.length)
  if (sub.length !== oid.length) return false
  return sub.every((value, index) => value === oid[index]) || findOid(keyData, oid, i + 1)
}

const getNamedCurve = (keyData: Uint8Array): string => {
  switch (true) {
    case findOid(keyData, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]):
      return 'P-256'
    case findOid(keyData, [0x2b, 0x81, 0x04, 0x00, 0x22]):
      return 'P-384'
    case findOid(keyData, [0x2b, 0x81, 0x04, 0x00, 0x23]):
      return 'P-521'
    case findOid(keyData, [0x2b, 0x65, 0x6e]):
      return 'X25519'
    case findOid(keyData, [0x2b, 0x65, 0x6f]):
      return 'X448'
    case findOid(keyData, [0x2b, 0x65, 0x70]):
      return 'Ed25519'
    case findOid(keyData, [0x2b, 0x65, 0x71]):
      return 'Ed448'
    default:
      throw new JOSENotSupported('Invalid or unsupported EC Key Curve or OKP Key Sub Type')
  }
}

const genericImport = async (
  replace: RegExp,
  keyFormat: 'spki' | 'pkcs8',
  pem: string,
  alg: string,
  options?: PEMImportOptions,
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
      algorithm = namedCurve.startsWith('P-') ? { name: 'ECDH', namedCurve } : { name: namedCurve }
      keyUsages = isPublic ? [] : ['deriveBits']
      break
    }
    case isCloudflareWorkers() && 'EdDSA': {
      const namedCurve = getNamedCurve(keyData).toUpperCase()
      algorithm = { name: `NODE-${namedCurve}`, namedCurve: `NODE-${namedCurve}` }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    }
    case 'EdDSA':
      algorithm = { name: getNamedCurve(keyData) }
      keyUsages = isPublic ? ['verify'] : ['sign']
      break
    default:
      throw new JOSENotSupported('Invalid or unsupported "alg" (Algorithm) value')
  }

  return crypto.subtle.importKey(
    keyFormat,
    keyData,
    algorithm,
    options?.extractable ?? false,
    keyUsages,
  )
}

export const fromPKCS8: PEMImportFunction = (pem, alg, options?) => {
  return genericImport(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, 'pkcs8', pem, alg, options)
}

export const fromSPKI: PEMImportFunction = (pem, alg, options?) => {
  return genericImport(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, 'spki', pem, alg, options)
}
