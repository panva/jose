import * as crypto from 'crypto'
import { isCryptoKey, getKeyObject } from './webcrypto.js'
import getSecretKey from './secret_key.js'

export default function getSignVerifyKey(alg: string, key: unknown, usage: KeyUsage) {
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
    return getKeyObject(key, alg, new Set([usage]))
  }
  throw new TypeError('invalid key input')
}
