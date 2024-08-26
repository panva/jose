import type { JWK, KeyLike } from '../types.d.ts'
import { decode } from './base64url.ts'
import importJWK from './jwk_to_key.ts'

const normalizeSecretKey = (k: string) => decode(k)

let privCache: WeakMap<object, Record<string, CryptoKey>>
let pubCache: WeakMap<object, Record<string, CryptoKey>>

const isKeyObject = (key: unknown): key is KeyLike => {
  // @ts-expect-error
  return key?.[Symbol.toStringTag] === 'KeyObject'
}

const importAndCache = async (
  cache: typeof privCache | typeof pubCache,
  key: KeyLike,
  jwk: JWK,
  alg: string,
) => {
  let cached = cache.get(key)
  if (cached?.[alg]) {
    return cached[alg]
  }

  const cryptoKey = await importJWK({ ...jwk, alg })
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

const normalizePublicKey = (key: KeyLike | Uint8Array | unknown, alg: string) => {
  if (isKeyObject(key)) {
    // @ts-expect-error
    let jwk: JWK = key.export({ format: 'jwk' })
    delete jwk.d
    delete jwk.dp
    delete jwk.dq
    delete jwk.p
    delete jwk.q
    delete jwk.qi
    if (jwk.k) {
      return normalizeSecretKey(jwk.k)
    }

    pubCache ||= new WeakMap()
    return importAndCache(pubCache, key, jwk, alg)
  }

  return <KeyLike | Uint8Array>key
}

const normalizePrivateKey = (key: KeyLike | Uint8Array | unknown, alg: string) => {
  if (isKeyObject(key)) {
    // @ts-expect-error
    let jwk: JWK = key.export({ format: 'jwk' })
    if (jwk.k) {
      return normalizeSecretKey(jwk.k)
    }

    privCache ||= new WeakMap()
    return importAndCache(privCache, key, jwk, alg)
  }

  return <KeyLike | Uint8Array>key
}

export default { normalizePublicKey, normalizePrivateKey }
