import { isJWK } from '../lib/is_jwk.js'
import type { JWK, CryptoKey, KeyObject } from '../types.d.ts'
import { decode } from './base64url.js'
import importJWK from './jwk_to_key.js'
import { isKeyObject } from './is_key_like.js'

let cache: WeakMap<object, Record<string, CryptoKey>>

interface ConvertableKeyObject extends KeyObject {
  export(): Uint8Array
  export(opts: { format: 'jwk' }): JWK
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
  ): CryptoKey
}

const handleJWK = async (key: KeyObject | JWK, jwk: JWK, alg: string, freeze = false) => {
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

const handleKeyObject = (key: ConvertableKeyObject, alg: string) => {
  cache ||= new WeakMap()
  let cached = cache.get(key)
  if (cached?.[alg]) {
    return cached[alg]
  }

  let cryptoKey: CryptoKey | undefined
  if (key.asymmetricKeyType === 'x25519' || key.asymmetricKeyType === 'x448') {
    switch (alg) {
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW':
        break

      default:
        throw new TypeError('TODO')
    }

    cryptoKey = key.toCryptoKey(
      key.asymmetricKeyType,
      true,
      key.type === 'private' ? ['deriveBits', 'deriveKey'] : [],
    )
  }

  if (key.asymmetricKeyType === 'ed25519' || key.asymmetricKeyType === 'ed448') {
    if (alg !== 'EdDSA') {
      throw new TypeError('TODO')
    }

    cryptoKey = key.toCryptoKey(key.asymmetricKeyType, true, [
      key.type === 'private' ? 'sign' : 'verify',
    ])
  }

  if (key.asymmetricKeyType === 'rsa') {
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
      return key.toCryptoKey(
        {
          name: 'RSA-OAEP',
          hash,
        },
        true,
        key.type === 'private' ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey'],
      )
    }

    cryptoKey = key.toCryptoKey(
      {
        name: alg.startsWith('PS') ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5',
        hash,
      },
      true,
      [key.type === 'private' ? 'sign' : 'verify'],
    )
  }

  if (key.asymmetricKeyType === 'ec') {
    const nist = new Map<unknown, string>([
      ['prime256v1', 'P-256'],
      ['secp384r1', 'P-384'],
      ['secp521r1', 'P-521'],
    ])

    const namedCurve = nist.get(key.asymmetricKeyDetails?.namedCurve)
    if (!namedCurve) {
      throw new TypeError('TODO')
    }

    if (alg === 'ES256' && namedCurve === 'P-256') {
      cryptoKey = key.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [key.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg === 'ES384' && namedCurve === 'P-384') {
      cryptoKey = key.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [key.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg === 'ES512' && namedCurve === 'P-521') {
      cryptoKey = key.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        true,
        [key.type === 'private' ? 'sign' : 'verify'],
      )
    }

    if (alg.startsWith('ECDH-ES')) {
      cryptoKey = key.toCryptoKey(
        {
          name: 'ECDH',
          namedCurve,
        },
        true,
        key.type === 'private' ? ['deriveBits', 'deriveKey'] : [],
      )
    }
  }

  if (!cryptoKey) {
    throw new TypeError('TODO')
  }

  if (!cached) {
    cache.set(key, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

export default async function normalizeKey(
  key: CryptoKey | KeyObject | JWK | Uint8Array,
  alg: string,
): Promise<CryptoKey | Uint8Array> {
  if (key instanceof Uint8Array) {
    return key
  }

  let normalized: CryptoKey | undefined
  if (isKeyObject<KeyObject>(key)) {
    if (key.type === 'secret') {
      return (key as ConvertableKeyObject).export()
    }

    if ('toCryptoKey' in key && typeof key.toCryptoKey === 'function') {
      normalized = handleKeyObject(key as ConvertableKeyObject, alg)
    } else {
      let jwk: JWK = (key as ConvertableKeyObject).export({ format: 'jwk' })
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
