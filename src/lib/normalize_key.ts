import type * as types from '../types.d.ts'
import { isJWK } from './type_checks.js'
import { decode } from '../util/base64url.js'
import { jwkToKey } from './jwk_to_key.js'
import { isCryptoKey, isKeyObject } from './is_key_like.js'
import { isIntegratedEncryption, keyAlgorithm } from './hpke.js'

const unusableForAlg = 'given KeyObject instance cannot be used for this algorithm'

let cache: WeakMap<object, Record<string, CryptoKey>>

function getPublicKeyAvailable() {
  return typeof (crypto.subtle as { getPublicKey?: unknown }).getPublicKey === 'function'
}

function requiresExtractablePrivateKey(alg: string) {
  if (getPublicKeyAvailable()) {
    return false
  }

  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-1':
    case 'HPKE-3':
    case 'HPKE-4':
    case 'HPKE-7':
      return true
    default:
      return false
  }
}

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

  const keyData = { ...jwk, alg }
  if (jwk.d && requiresExtractablePrivateKey(alg)) {
    keyData.ext = true
  }
  const cryptoKey = await jwkToKey(keyData)
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

  const isPublic = keyObject.type === 'public'
  const extractable =
    isPublic || (keyObject.type === 'private' && requiresExtractablePrivateKey(alg))

  let cryptoKey: types.CryptoKey | undefined
  if (keyObject.asymmetricKeyType === 'ml-kem-768') {
    if (alg !== 'HPKE-12') {
      throw new TypeError(unusableForAlg)
    }

    cryptoKey = keyObject.toCryptoKey(
      'ML-KEM-768',
      extractable,
      isPublic ? ['encapsulateBits'] : ['decapsulateBits'],
    )
  }

  if (keyObject.asymmetricKeyType === 'x25519') {
    switch (alg) {
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW':
      case 'HPKE-3':
      case 'HPKE-4':
        break

      default:
        throw new TypeError(unusableForAlg)
    }

    cryptoKey = keyObject.toCryptoKey(
      keyObject.asymmetricKeyType,
      extractable,
      isPublic ? [] : ['deriveBits'],
    )
  }

  if (keyObject.asymmetricKeyType === 'ed25519') {
    if (alg !== 'EdDSA' && alg !== 'Ed25519') {
      throw new TypeError(unusableForAlg)
    }

    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
      isPublic ? 'verify' : 'sign',
    ])
  }

  switch (keyObject.asymmetricKeyType) {
    case 'ml-dsa-44':
    case 'ml-dsa-65':
    case 'ml-dsa-87': {
      if (alg !== keyObject.asymmetricKeyType.toUpperCase()) {
        throw new TypeError(unusableForAlg)
      }

      cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
        isPublic ? 'verify' : 'sign',
      ])
    }
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
        throw new TypeError(unusableForAlg)
    }

    if (alg.startsWith('RSA-OAEP')) {
      return keyObject.toCryptoKey(
        {
          name: 'RSA-OAEP',
          hash,
        },
        extractable,
        isPublic ? ['encrypt'] : ['decrypt'],
      )
    }

    cryptoKey = keyObject.toCryptoKey(
      {
        name: alg.startsWith('PS') ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5',
        hash,
      },
      extractable,
      [isPublic ? 'verify' : 'sign'],
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
      throw new TypeError(unusableForAlg)
    }

    const expectedCurve: Record<string, string> = { ES256: 'P-256', ES384: 'P-384', ES512: 'P-521' }
    if (expectedCurve[alg] && namedCurve === expectedCurve[alg]) {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: 'ECDSA',
          namedCurve,
        },
        extractable,
        [isPublic ? 'verify' : 'sign'],
      )
    }

    if (alg.startsWith('ECDH-ES') || isIntegratedEncryption(alg)) {
      const algorithm = isIntegratedEncryption(alg)
        ? keyAlgorithm(alg)
        : { name: 'ECDH', namedCurve }
      if ((algorithm as EcKeyAlgorithm).namedCurve !== namedCurve) {
        throw new TypeError(unusableForAlg)
      }
      cryptoKey = keyObject.toCryptoKey(algorithm, extractable, isPublic ? [] : ['deriveBits'])
    }
  }

  if (!cryptoKey) {
    throw new TypeError(unusableForAlg)
  }

  if (!cached) {
    cache.set(keyObject, { [alg]: cryptoKey })
  } else {
    cached[alg] = cryptoKey
  }
  return cryptoKey
}

export async function normalizeKey(
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  alg: string,
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
        return handleKeyObject(key as ConvertableKeyObject, alg)
      } catch (err) {
        if (err instanceof TypeError) {
          throw err
        }
      }
    }

    let jwk: types.JWK = (key as ConvertableKeyObject).export({ format: 'jwk' })
    return handleJWK(key, jwk, alg)
  }

  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k)
    }
    return handleJWK(key, key, alg, true)
  }

  throw new Error('unreachable')
}
