import type * as types from '../types.d.ts'
import { isJWK } from './is_jwk.js'
import { decode } from './base64url.js'
import importJWK from './jwk_to_key.js'
import { isKeyObject } from './is_key_like.js'

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

const handleJWK = async (
  key: types.KeyObject | types.JWK,
  jwk: types.JWK,
  alg: string,
  freeze = false,
) => {
  cache ||= new WeakMap()
  let cached = cache.get(key)
  if (cached?.[alg]) {
    return cached[alg]
  }

  const cryptoKey = await importJWK({ ...jwk, alg, ext: true })
  if (freeze) Object.freeze(key)
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

const handleKeyObject = (keyObject: ConvertableKeyObject, alg: string) => {
  cache ||= new WeakMap()
  let cached = cache.get(keyObject)
  if (cached?.[alg]) {
    return cached[alg]
  }

  let cryptoKey: types.CryptoKey | undefined
  if (keyObject.asymmetricKeyType === 'x25519') {
    switch (alg) {
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW':
        break

      default:
        throw new TypeError('TODO')
    }

    cryptoKey = keyObject.toCryptoKey(
      keyObject.asymmetricKeyType,
      true,
      keyObject.type === 'private' ? ['deriveBits'] : [],
    )
  }

  if (keyObject.asymmetricKeyType === 'ed25519') {
    if (alg !== 'EdDSA') {
      throw new TypeError('TODO')
    }

    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, true, [
      keyObject.type === 'private' ? 'sign' : 'verify',
    ])
  }

  if (keyObject.asymmetricKeyType === 'rsa') {
    let hash: string
    switch (alg) {
      case 'RSA-OAEP':
        hash = 'SHA-1'
        break
      case 'RS256':
      case 'PS256':
      case 'RSA-OAEP-256':
        hash = 'SHA-256'
        break
      case 'RS384':
      case 'PS384':
      case 'RSA-OAEP-384':
        hash = 'SHA-384'
        break
      case 'RS512':
      case 'PS512':
      case 'RSA-OAEP-512':
        hash = 'SHA-512'
        break

      default:
        throw new TypeError('unsupported algorithm')
    }

    if (alg.startsWith('RSA-OAEP')) {
      return keyObject.toCryptoKey(
        {
          name: 'RSA-OAEP',
          hash,
        },
        true,
        keyObject.type === 'private' ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey'],
      )
    }

    cryptoKey = keyObject.toCryptoKey(
      {
        name: alg.startsWith('PS') ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5',
        hash,
      },
      true,
      [keyObject.type === 'private' ? 'sign' : 'verify'],
    )
  }

  if (keyObject.asymmetricKeyType === 'ec') {
    const nist = new Map<unknown, string>([
      ['prime256v1', 'P-256'],
      ['secp384r1', 'P-384'],
      ['secp521r1', 'P-521'],
    ])

    const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve)
    if (!namedCurve) {
      throw new TypeError('TODO')
    }

    if (alg === 'ES256' && namedCurve === 'P-256') {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [keyObject.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg === 'ES384' && namedCurve === 'P-384') {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [keyObject.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg === 'ES512' && namedCurve === 'P-521') {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [keyObject.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg.startsWith('ECDH-ES')) {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: 'ECDH',
          namedCurve,
        },
        true,
        keyObject.type === 'private' ? ['deriveBits'] : [],
      )
    }
  }

  if (!cryptoKey) {
    throw new TypeError('TODO')
  }

  if (!cached) {
    cache.set(keyObject, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

export default async (
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  alg: string,
): Promise<types.CryptoKey | Uint8Array> => {
  if (key instanceof Uint8Array) {
    return key
  }

  let normalized: types.CryptoKey | undefined
  if (isKeyObject<types.KeyObject>(key)) {
    if (key.type === 'secret') {
      return (key as ConvertableKeyObject).export()
    }

    if ('toCryptoKey' in key && typeof key.toCryptoKey === 'function') {
      normalized = handleKeyObject(key as ConvertableKeyObject, alg)
    } else {
      let jwk: types.JWK = (key as ConvertableKeyObject).export({ format: 'jwk' })
      normalized = await handleJWK(key, jwk, alg)
    }
  } else if (isJWK(key)) {
    if (key.k) {
      return decode(key.k)
    }
    normalized = await handleJWK(key, key, alg, true)
  } else {
    normalized = key
  }

  return normalized
}
