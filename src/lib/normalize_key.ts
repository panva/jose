import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'
import { isJWK } from './type_checks.js'
import { decode } from '../util/base64url.js'
import { jwkToKey } from './jwk_to_key.js'
import { isCryptoKey, isKeyObject } from './is_key_like.js'

const unusableForAlg = 'given KeyObject instance cannot be used for this algorithm'

let cache: WeakMap<object, Record<string, CryptoKey>>

interface ConvertableKeyObject extends types.KeyObject {
  export(): Uint8Array
  export(opts: { format: 'jwk' }): types.JWK
  asymmetricKeyType?: string
  asymmetricKeyDetails?: { namedCurve?: string }
  toCryptoKey(
    alg:
      | AlgorithmIdentifier
      | RsaHashedImportParams
      | EcKeyImportParams
      | HmacImportParams
      | AesKeyAlgorithm,
    extractable: boolean,
    usages: string[],
  ): types.CryptoKey
}

/** Node names the NIST curves after the OpenSSL identifiers rather than the JOSE ones. */
const nist: Record<string, string> = {
  // @ts-expect-error
  __proto__: null,
  prime256v1: 'P-256',
  secp384r1: 'P-384',
  secp521r1: 'P-521',
}

function cached(key: object, alg: string): CryptoKey | undefined {
  cache ||= new WeakMap()
  return cache.get(key)?.[alg]
}

function store(key: object, alg: string, cryptoKey: CryptoKey): CryptoKey {
  const entry = cache.get(key)
  if (entry) {
    entry[alg] = cryptoKey
  } else {
    cache.set(key, { [alg]: cryptoKey })
  }
  return cryptoKey
}

const handleJWK = async (
  key: types.KeyObject | types.JWK,
  jwk: types.JWK,
  entry: KeyDescriptor,
  freeze = false,
) => {
  const hit = cached(key, entry.alg)
  if (hit) return hit

  const cryptoKey = await jwkToKey(entry, { ...jwk, alg: entry.alg })
  if (freeze) Object.freeze(key)
  return store(key, entry.alg, cryptoKey)
}

const handleKeyObject = (keyObject: ConvertableKeyObject, entry: KeyDescriptor) => {
  const hit = cached(keyObject, entry.alg)
  if (hit) return hit

  const isPublic = keyObject.type === 'public'
  const extractable = isPublic ? true : false
  const usages = isPublic ? entry.usages.public : entry.usages.private

  const { asymmetricKeyType } = keyObject
  const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve!]

  let params: { name: string; hash?: string; namedCurve?: string }

  if (entry.subtleFor) {
    try {
      params = entry.subtleFor({ crv, asymmetricKeyType })
    } catch {
      throw new TypeError(unusableForAlg)
    }
    if (!params.name || ('namedCurve' in params && !params.namedCurve)) {
      throw new TypeError(unusableForAlg)
    }
  } else {
    if (asymmetricKeyType !== entry.asymmetricKeyType) {
      throw new TypeError(unusableForAlg)
    }

    if (entry.subtle.namedCurve && crv !== entry.subtle.namedCurve) {
      throw new TypeError(unusableForAlg)
    }

    params = entry.subtle
  }

  return store(keyObject, entry.alg, keyObject.toCryptoKey(params, extractable, usages))
}

export async function normalizeKey(
  key: types.KeyInput,
  entry: KeyDescriptor,
): Promise<types.CryptoKey | Uint8Array> {
  if (key instanceof Uint8Array) {
    return key
  }

  if (isCryptoKey(key)) {
    return key
  }

  if (isKeyObject(key)) {
    if (key.type === 'secret') {
      return (key as ConvertableKeyObject).export()
    }

    if ('toCryptoKey' in key && typeof key.toCryptoKey === 'function') {
      try {
        return handleKeyObject(key as ConvertableKeyObject, entry)
      } catch (err) {
        if (err instanceof TypeError) {
          throw err
        }
      }
    }

    let jwk: types.JWK = (key as ConvertableKeyObject).export({ format: 'jwk' })
    return handleJWK(key, jwk, entry)
  }

  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k)
    }
    return handleJWK(key, key, entry, true)
  }

  throw new Error('unreachable')
}
