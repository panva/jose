import { createPrivateKey, createPublicKey, KeyObject } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { isCryptoKey } from './webcrypto.js'
import type { PEMExportFunction, PEMImportFunction } from '../interfaces.d'
import isKeyObject from './is_key_object.js'
import invalidKeyInput from '../../lib/invalid_key_input.js'
import { types } from './is_key_like.js'

const genericExport = (
  keyType: 'private' | 'public',
  keyFormat: 'spki' | 'pkcs8',
  key: unknown,
) => {
  let keyObject: KeyObject
  if (isCryptoKey(key)) {
    if (!key.extractable) {
      throw new TypeError('CryptoKey is not extractable')
    }
    keyObject = KeyObject.from(key)
  } else if (isKeyObject(key)) {
    keyObject = key
  } else {
    throw new TypeError(invalidKeyInput(key, ...types))
  }

  if (keyObject.type !== keyType) {
    throw new TypeError(`key is not a ${keyType} key`)
  }

  return keyObject.export({ format: 'pem', type: keyFormat }) as string
}

export const toSPKI: PEMExportFunction = (key) => {
  return genericExport('public', 'spki', key)
}

export const toPKCS8: PEMExportFunction = (key) => {
  return genericExport('private', 'pkcs8', key)
}

export const fromPKCS8: PEMImportFunction = (pem) =>
  createPrivateKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''), 'base64'),
    type: 'pkcs8',
    format: 'der',
  })

export const fromSPKI: PEMImportFunction = (pem) =>
  createPublicKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''), 'base64'),
    type: 'spki',
    format: 'der',
  })

export const fromX509: PEMImportFunction = (pem) =>
  createPublicKey({
    key: pem,
    type: 'spki',
    format: 'pem',
  })
