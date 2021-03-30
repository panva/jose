import crypto, { isCryptoKey } from './webcrypto.js'

export default function getCryptoKey(alg: string, key: unknown, usage: KeyUsage) {
  if (isCryptoKey(key)) {
    return key
  }

  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError('symmetric keys are only applicable for HMAC-based algorithms')
    }
    return crypto.subtle.importKey(
      'raw',
      key,
      { hash: { name: `SHA-${alg.substr(-3)}` }, name: 'HMAC' },
      false,
      [usage],
    )
  }

  throw new TypeError('invalid key input')
}
