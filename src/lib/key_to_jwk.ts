import type * as types from '../types.d.ts'
import invalidKeyInput from './invalid_key_input.js'
import { encode as base64url } from './base64url.js'
import { isCryptoKey } from './is_key_like.js'

export default async (key: unknown): Promise<types.JWK> => {
  if (key instanceof Uint8Array) {
    return {
      kty: 'oct',
      k: base64url(key),
    }
  }
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'Uint8Array'))
  }
  if (!key.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }
  const { ext, key_ops, alg, use, ...jwk } = await crypto.subtle.exportKey('jwk', key)

  return jwk as types.JWK
}
