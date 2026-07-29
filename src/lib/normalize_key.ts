import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'
import { decode } from '../util/base64url.js'
import { jwkToKey } from './jwk_to_key.js'
import { checkKeyType, BYTES, CRYPTO, KEYOBJECT, JWK } from './check_key_type.js'
import type { Tagged } from './check_key_type.js'

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

/**
 * Asserts everything there is to assert about `key` for this algorithm and operation, and returns
 * what the crypto primitives consume. The key is discriminated once: checkKeyType reports what it
 * found, and the conversion below acts on that rather than testing the input all over again.
 */
export async function prepareKey(
  entry: KeyDescriptor,
  key: unknown,
  usage: 'sign' | 'verify' | 'encrypt' | 'decrypt',
): Promise<types.CryptoKey | Uint8Array> {
  const tagged: Tagged = checkKeyType(entry, key, usage)

  switch (tagged.kind) {
    case BYTES:
    case CRYPTO:
      return tagged.key

    case JWK:
      if (tagged.key.k) {
        return decode(tagged.key.k)
      }
      return handleJWK(tagged.key, tagged.key, entry, true)

    case KEYOBJECT: {
      const keyObject = tagged.key as ConvertableKeyObject

      if (keyObject.type === 'secret') {
        return keyObject.export()
      }

      if ('toCryptoKey' in keyObject && typeof keyObject.toCryptoKey === 'function') {
        try {
          return handleKeyObject(keyObject, entry)
        } catch (err) {
          if (err instanceof TypeError) {
            throw err
          }
        }
      }

      return handleJWK(keyObject, keyObject.export({ format: 'jwk' }), entry)
    }
  }
}
