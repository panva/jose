import type { KeyLike } from '../types.d.ts'
import { decode } from './base64url.ts'
import importJWK from './jwk_to_key.ts'

const normalizeSecretKey = (k: string) => decode(k)

const normalizePublicKey = async (key: KeyLike | Uint8Array | unknown, alg: string) => {
  // @ts-expect-error
  if (key?.[Symbol.toStringTag] === 'KeyObject') {
    // @ts-expect-error
    let jwk = key.export({ format: 'jwk' })
    delete jwk.d
    delete jwk.dp
    delete jwk.dq
    delete jwk.p
    delete jwk.q
    delete jwk.qi
    if (jwk.k) {
      return normalizeSecretKey(jwk.k)
    }

    return importJWK({ ...jwk, alg })
  }

  return <KeyLike | Uint8Array>key
}

const normalizePrivateKey = async (key: KeyLike | Uint8Array | unknown, alg: string) => {
  // @ts-expect-error
  if (key?.[Symbol.toStringTag] === 'KeyObject') {
    // @ts-expect-error
    let jwk = key.export({ format: 'jwk' })
    if (jwk.k) {
      return normalizeSecretKey(jwk.k)
    }

    return importJWK({ ...jwk, alg })
  }

  return <KeyLike | Uint8Array>key
}

export default { normalizePublicKey, normalizePrivateKey }
