import { KeyObject, createDecipheriv, createCipheriv, getCiphers } from 'crypto'
import { JOSENotSupported } from '../../util/errors.js'
import type { AesKwUnwrapFunction, AesKwWrapFunction } from '../interfaces.d'
import { concat } from '../../lib/buffer_utils.js'
import getSecretKey from './secret_key.js'
import { isCryptoKey, getKeyObject as exportCryptoKey } from './webcrypto.js'

function checkKeySize(key: KeyObject, alg: string) {
  if (key.symmetricKeySize! << 3 !== parseInt(alg.substr(1, 3), 10)) {
    throw new TypeError(`invalid key size for alg: ${alg}`)
  }
}

function getKeyObject(key: unknown) {
  if (key instanceof KeyObject) {
    return key
  }
  if (key instanceof Uint8Array) {
    return getSecretKey(key)
  }
  if (isCryptoKey(key)) {
    return exportCryptoKey(key)
  }

  throw new TypeError('invalid key input')
}

export const wrap: AesKwWrapFunction = async (alg: string, key: unknown, cek: Uint8Array) => {
  const size = parseInt(alg.substr(1, 3), 10)
  const algorithm = `aes${size}-wrap`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(
      `alg ${alg} is unsupported either by JOSE or your javascript runtime`,
    )
  }
  const keyObject = getKeyObject(key)
  checkKeySize(keyObject, alg)
  const cipher = createCipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6))
  return concat(cipher.update(cek), cipher.final())
}

export const unwrap: AesKwUnwrapFunction = async (
  alg: string,
  key: unknown,
  encryptedKey: Uint8Array,
) => {
  const size = parseInt(alg.substr(1, 3), 10)
  const algorithm = `aes${size}-wrap`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(
      `alg ${alg} is unsupported either by JOSE or your javascript runtime`,
    )
  }
  const keyObject = getKeyObject(key)
  checkKeySize(keyObject, alg)
  const cipher = createDecipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6))
  return concat(cipher.update(encryptedKey), cipher.final())
}
