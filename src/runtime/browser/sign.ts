import type { SignFunction } from '../interfaces.d'
import subtleAlgorithm from './subtle_dsa.js'
import crypto, { ensureSecureContext } from './webcrypto.js'
import checkKeyLength from './check_key_length.js'

const sign: SignFunction = async (alg, key: CryptoKey | Uint8Array, data) => {
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
      ['sign'],
    )
  } else {
    cryptoKey = key
  }

  checkKeyLength(alg, cryptoKey)

  const signature = await crypto.subtle.sign(subtleAlgorithm(alg), cryptoKey, data)
  return new Uint8Array(signature)
}

export default sign
