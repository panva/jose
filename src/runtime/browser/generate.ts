import crypto, { ensureSecureContext } from './webcrypto.js'
import { JOSENotSupported } from '../../util/errors.js'
import random from './random.js'

const modulusLength = 2048
const publicExponent = new Uint8Array([0x01, 0x00, 0x01])

export async function generateSecret(alg: string) {
  let length: number
  let algorithm: AesKeyGenParams | HmacKeyGenParams
  let keyUsages: KeyUsage[]
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      length = parseInt(alg.substr(-3), 10)
      algorithm = { name: 'HMAC', hash: `SHA-${alg.substr(-3)}`, length }
      keyUsages = ['sign', 'verify']
      break
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      length = parseInt(alg.substr(-3), 10)
      return random(new Uint8Array(length >> 3))
    case 'A128KW':
    case 'A192KW':
    case 'A256KW':
      length = parseInt(alg.substring(1, 4), 10)
      algorithm = { name: 'AES-KW', length }
      keyUsages = ['wrapKey', 'unwrapKey']
      break
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW':
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      length = parseInt(alg.substring(1, 4), 10)
      algorithm = { name: 'AES-GCM', length }
      keyUsages = ['encrypt', 'decrypt']
      break
    default:
      throw new JOSENotSupported('unsupported or invalid JWK "alg" (Algorithm) Parameter value')
  }

  return crypto.subtle.generateKey(algorithm, false, keyUsages) as Promise<CryptoKey>
}

interface Options {
  crv?: string
}

export async function generateKeyPair(alg: string, options?: Options) {
  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams
  let keyUsages: KeyUsage[]

  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = { name: 'RSA-PSS', hash: `SHA-${alg.substr(-3)}`, publicExponent, modulusLength }
      keyUsages = ['sign', 'verify']
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: `SHA-${alg.substr(-3)}`,
        publicExponent,
        modulusLength,
      }
      keyUsages = ['sign', 'verify']
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.substr(-3), 10) || 1}`,
        publicExponent,
        modulusLength,
      }
      keyUsages = ['decrypt', 'unwrapKey', 'encrypt', 'wrapKey']
      break
    case 'ES256':
      algorithm = { name: 'ECDSA', namedCurve: 'P-256' }
      keyUsages = ['sign', 'verify']
      break
    case 'ES384':
      algorithm = { name: 'ECDSA', namedCurve: 'P-384' }
      keyUsages = ['sign', 'verify']
      break
    case 'ES512':
      algorithm = { name: 'ECDSA', namedCurve: 'P-521' }
      keyUsages = ['sign', 'verify']
      break
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW':
      algorithm = { name: 'ECDH', namedCurve: options?.crv || 'P-256' }
      keyUsages = ['deriveKey', 'deriveBits']
      break
    default:
      throw new JOSENotSupported('unsupported or invalid JWK "alg" (Algorithm) Parameter value')
  }

  ensureSecureContext()
  return crypto.subtle.generateKey(algorithm, false, keyUsages) as Promise<CryptoKeyPair>
}
