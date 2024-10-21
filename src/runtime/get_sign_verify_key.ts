import { checkSigCryptoKey } from '../lib/crypto_key.js'
import invalidKeyInput from '../lib/invalid_key_input.js'

export default async function getCryptoKey(
  alg: string,
  key: CryptoKey | Uint8Array,
  usage: KeyUsage,
) {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject'))
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: `SHA-${alg.slice(-3)}`, name: 'HMAC' },
      false,
      [usage],
    )
  }

  checkSigCryptoKey(key, alg, usage)
  return key
}
