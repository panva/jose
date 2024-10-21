import { isJWK } from '../lib/is_jwk.js'
import type { JWK, KeyLike } from '../types.d.ts'
import { decode } from './base64url.js'
import importJWK from './jwk_to_key.js'

let cache: WeakMap<object, Record<string, CryptoKey>>

interface AsymmetricKeyDetails {
  namedCurve?: string | undefined
}

interface KeyObject extends KeyLike {
  export(): Uint8Array
  export(opts: { format: 'jwk' }): JWK
  asymmetricKeyType?: string
  asymmetricKeyDetails?: AsymmetricKeyDetails
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

const isKeyObject = (key: unknown): key is KeyObject => {
  // @ts-expect-error
  return key?.[Symbol.toStringTag] === 'KeyObject'
}

const handleJWK = async (key: KeyLike | JWK, jwk: JWK, alg: string, freeze = false) => {
  cache ||= new WeakMap()
  let cached = cache.get(key)
  if (cached?.[alg]) {
    return cached[alg]
  }

  const cryptoKey = await importJWK({ ...jwk, alg })
  if (freeze) Object.freeze(key)
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

const handleKeyObject = async (key: KeyObject, alg: string) => {
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

const normalizeKey = (key: KeyLike | Uint8Array | JWK | unknown, alg: string) => {
  if (isKeyObject(key)) {
    if (key.type === 'secret') {
      return new Uint8Array(key.export())
    }
    if (typeof key.toCryptoKey === 'function') {
      return handleKeyObject(key, alg)
    }

    let jwk: JWK = key.export({ format: 'jwk' })
    return handleJWK(key, jwk, alg)
  }

  if (isJWK(key)) {
    if (key.k) return decode(key.k)
    return handleJWK(key, key, alg, true)
  }

  return key as KeyLike | Uint8Array
}

export default { normalizeKey }
