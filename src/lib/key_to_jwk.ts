import type * as types from '../types.d.ts'
import invalidKeyInput from './invalid_key_input.js'
import { encode as b64u } from '../util/base64url.js'
import { isCryptoKey, isKeyObject } from './is_key_like.js'

interface ExportOptions {
  format: 'jwk'
}

interface ExtractableKeyObject extends types.KeyObject {
  export(arg: ExportOptions): types.JWK
  export(): Uint8Array
}

export default async function keyToJWK(key: unknown): Promise<types.JWK> {
  if (isKeyObject(key)) {
    if (key.type === 'secret') {
      key = (key as ExtractableKeyObject).export()
    } else {
      return (key as ExtractableKeyObject).export({ format: 'jwk' })
    }
  }
  if (key instanceof Uint8Array) {
    return {
      kty: 'oct',
      k: b64u(key),
    }
  }
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'Uint8Array'))
  }
  if (!key.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }
  const { ext, key_ops, alg, use, ...jwk } = await crypto.subtle.exportKey('jwk', key)

  if (jwk.kty === 'AKP') {
    ;(jwk as types.JWK).alg = alg
  }

  return jwk as types.JWK
}
