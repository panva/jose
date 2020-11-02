import type { VerifyFunction } from '../interfaces.d'
import subtleAlgorithm from './subtle_dsa.js'
import crypto, { ensureSecureContext } from './webcrypto.js'
import checkKeyLength from './check_key_length.js'

const verify: VerifyFunction = async (alg, key: CryptoKey | Uint8Array, signature, data) => {
  ensureSecureContext()
  let cryptoKey: CryptoKey
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError('symmetric keys are only applicable for HMAC-based algorithms')
    }
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { hash: `SHA-${alg.substr(-3)}`, name: 'HMAC' },
      false,
      ['verify'],
    )
  } else {
    cryptoKey = key
  }

  checkKeyLength(alg, cryptoKey)

  return crypto.subtle.verify(subtleAlgorithm(alg), cryptoKey, signature, data)
}

export default verify
