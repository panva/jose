import { getCiphers, KeyObject, createDecipheriv } from 'crypto'
import type { CipherGCMTypes } from 'crypto'

import type { DecryptFunction } from '../interfaces'
import checkIvLength from '../../lib/check_iv_length.js'
import checkCekLength from './check_cek_length.js'
import { concat } from '../../lib/buffer_utils.js'
import { JOSENotSupported, JWEDecryptionFailed } from '../../util/errors.js'
import timingSafeEqual from './timing_safe_equal.js'
import cbcTag from './cbc_tag.js'
import { isCryptoKey, getKeyObject } from './webcrypto.js'
import type { KeyLike } from '../../types'
import isKeyObject from './is_key_object.js'
import invalidKeyInput from './invalid_key_input.js'

async function cbcDecrypt(
  enc: string,
  cek: KeyObject | Uint8Array,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const keySize = parseInt(enc.substr(1, 3), 10)

  if (isKeyObject(cek)) {
    // eslint-disable-next-line no-param-reassign
    cek = cek.export()
  }

  const encKey = cek.subarray(keySize >> 3)
  const macKey = cek.subarray(0, keySize >> 3)
  const macSize = parseInt(enc.substr(-3), 10)

  const algorithm = `aes-${keySize}-cbc`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`)
  }

  const expectedTag = cbcTag(aad, iv, ciphertext, macSize, macKey, keySize)

  let macCheckPassed!: boolean
  try {
    macCheckPassed = timingSafeEqual(tag, expectedTag)
  } catch {
    //
  }
  if (!macCheckPassed) {
    throw new JWEDecryptionFailed()
  }

  let plaintext!: Uint8Array
  try {
    const cipher = createDecipheriv(algorithm, encKey, iv)
    plaintext = concat(cipher.update(ciphertext), cipher.final())
  } catch {
    //
  }
  if (!plaintext) {
    throw new JWEDecryptionFailed()
  }

  return plaintext
}
async function gcmDecrypt(
  enc: string,
  cek: KeyObject | Uint8Array,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) {
  const keySize = parseInt(enc.substr(1, 3), 10)

  const algorithm = <CipherGCMTypes>`aes-${keySize}-gcm`
  if (!getCiphers().includes(algorithm)) {
    throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`)
  }
  try {
    const cipher = createDecipheriv(algorithm, cek, iv, { authTagLength: 16 })
    cipher.setAuthTag(tag)
    if (aad.byteLength) {
      cipher.setAAD(aad)
    }

    return concat(cipher.update(ciphertext), cipher.final())
  } catch (err) {
    throw new JWEDecryptionFailed()
  }
}

const decrypt: DecryptFunction = async (
  enc: string,
  cek: unknown,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array,
  aad: Uint8Array,
) => {
  let key: KeyLike
  if (isCryptoKey(cek)) {
    // eslint-disable-next-line no-param-reassign
    key = getKeyObject(cek, enc, new Set(['decrypt']))
  } else if (cek instanceof Uint8Array || isKeyObject(cek)) {
    key = cek
  } else {
    throw new TypeError(invalidKeyInput(cek, 'KeyObject', 'CryptoKey', 'Uint8Array'))
  }

  checkCekLength(enc, key)
  checkIvLength(enc, iv)

  if (enc.substr(4, 3) === 'CBC') {
    return cbcDecrypt(enc, key, ciphertext, iv, tag, aad)
  }

  return gcmDecrypt(enc, key, ciphertext, iv, tag, aad)
}

export default decrypt
