import * as crypto from 'crypto'
import { isCryptoKey, getKeyObject as exportCryptoKey } from './webcrypto.js'
import getSecretKey from './secret_key.js'

export default function getKeyObject(alg: string, key: unknown) {
  if (key instanceof crypto.KeyObject) {
    return key
  }
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError('symmetric keys are only applicable for HMAC-based JWA algorithms')
    }
    return getSecretKey(key)
  }
  if (isCryptoKey(key)) {
    return exportCryptoKey(key)
  }
  throw new TypeError('invalid key input')
}
