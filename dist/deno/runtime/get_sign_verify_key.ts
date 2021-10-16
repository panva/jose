import crypto, { checkCryptoKey, isCryptoKey } from './webcrypto.ts'
import invalidKeyInput from './invalid_key_input.ts'

export default function getCryptoKey(alg: string, key: unknown, usage: KeyUsage) {
  if (isCryptoKey(key)) {
    checkCryptoKey(key, alg, usage)
    return key
  }

  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey'))
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: { name: `SHA-${alg.substr(-3)}` }, name: 'HMAC' },
      false,
      [usage],
    )
  }

  throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'Uint8Array'))
}
