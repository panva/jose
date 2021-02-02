import type { KeyObject } from 'crypto'
import { createDecipheriv, createCipheriv, getCiphers } from 'crypto'
import { JOSENotSupported } from '../../util/errors.js'
import type { AesKwUnwrapFunction, AesKwWrapFunction } from '../interfaces.d'
import { concat } from '../../lib/buffer_utils.js'
import getSecretKey from './secret_key.js'
import type { KeyLike } from '../../types.d'
import { isCryptoKey, getKeyObject } from './webcrypto.js'

function checkKeySize(key: KeyObject, alg: string) {
  if (key.symmetricKeySize! << 3 !== parseInt(alg.substr(1, 3), 10)) {
    throw new TypeError(`invalid key size for alg: ${alg}`)
  }
}

export const wrap: AesKwWrapFunction = async (alg: string, key: KeyLike, cek: Uint8Array) => {
  const size = parseInt(alg.substr(1, 3), 10)
  const algorithm = `aes${size}-wrap`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(
      `alg ${alg} is unsupported either by JOSE or your javascript runtime`,
    )
  }
  let keyObject: KeyObject
  if (key instanceof Uint8Array) {
    keyObject = getSecretKey(key)
  } else if (isCryptoKey(key)) {
    keyObject = getKeyObject(key)
  } else {
    keyObject = key
  }
  checkKeySize(keyObject, alg)
  const cipher = createCipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6))
  return concat(cipher.update(cek), cipher.final())
}

export const unwrap: AesKwUnwrapFunction = async (
  alg: string,
  key: KeyLike,
  encryptedKey: Uint8Array,
) => {
  const size = parseInt(alg.substr(1, 3), 10)
  const algorithm = `aes${size}-wrap`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(
      `alg ${alg} is unsupported either by JOSE or your javascript runtime`,
    )
  }
  let keyObject: KeyObject
  if (key instanceof Uint8Array) {
    keyObject = getSecretKey(key)
  } else if (isCryptoKey(key)) {
    keyObject = getKeyObject(key)
  } else {
    keyObject = key
  }
  checkKeySize(keyObject, alg)
  const cipher = createDecipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6))
  return concat(cipher.update(encryptedKey), cipher.final())
}
