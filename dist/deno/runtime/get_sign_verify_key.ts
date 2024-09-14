import crypto, { isCryptoKey } from './webcrypto.ts'
import { checkSigCryptoKey } from '../lib/crypto_key.ts'
import invalidKeyInput from '../lib/invalid_key_input.ts'
import { types } from './is_key_like.ts'
import normalize from './normalize_key.ts'

export default async function getCryptoKey(alg: string, key: unknown, usage: KeyUsage) {
  if (usage === 'sign') {
    key = await normalize.normalizePrivateKey(key, alg)
  }

  if (usage === 'verify') {
    key = await normalize.normalizePublicKey(key, alg)
  }

  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage)
    return key
  }

  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, ...types))
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: `SHA-${alg.slice(-3)}`, name: 'HMAC' },
      false,
      [usage],
    )
  }

  throw new TypeError(invalidKeyInput(key, ...types, 'Uint8Array', 'JSON Web Key'))
}
