import { isCloudflareWorkers } from './env.js'
import crypto from './webcrypto.js'
import type { JWKImportFunction } from '../interfaces.d'
import { JOSENotSupported } from '../../util/errors.js'
import type { JWK } from '../../types.d'
import { decode as base64url } from './base64url.js'

function subtleMapping(jwk: JWK): {
  algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  keyUsages: KeyUsage[]
} {
  let algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  let keyUsages: KeyUsage[]

  switch (jwk.kty) {
    case 'oct': {
      switch (jwk.alg) {
        case 'HS256':
        case 'HS384':
        case 'HS512':
          algorithm = { name: 'HMAC', hash: `SHA-${jwk.alg.slice(-3)}` }
          keyUsages = ['sign', 'verify']
          break
        case 'A128CBC-HS256':
        case 'A192CBC-HS384':
        case 'A256CBC-HS512':
          throw new JOSENotSupported(`${jwk.alg} keys cannot be imported as CryptoKey instances`)
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW':
          algorithm = { name: 'AES-GCM' }
          keyUsages = ['encrypt', 'decrypt']
          break
        case 'A128KW':
        case 'A192KW':
        case 'A256KW':
          algorithm = { name: 'AES-KW' }
          keyUsages = ['wrapKey', 'unwrapKey']
          break
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW':
          algorithm = { name: 'PBKDF2' }
          keyUsages = ['deriveBits']
          break
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      break
    }
    case 'RSA': {
      switch (jwk.alg) {
        case 'PS256':
        case 'PS384':
        case 'PS512':
          algorithm = { name: 'RSA-PSS', hash: `SHA-${jwk.alg.slice(-3)}` }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'RS256':
        case 'RS384':
        case 'RS512':
          algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${jwk.alg.slice(-3)}` }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
          algorithm = {
            name: 'RSA-OAEP',
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`,
          }
          keyUsages = jwk.d ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey']
          break
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      break
    }
    case 'EC': {
      switch (jwk.alg) {
        case 'ES256':
          algorithm = { name: 'ECDSA', namedCurve: 'P-256' }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ES384':
          algorithm = { name: 'ECDSA', namedCurve: 'P-384' }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ES512':
          algorithm = { name: 'ECDSA', namedCurve: 'P-521' }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW':
          algorithm = { name: 'ECDH', namedCurve: jwk.crv! }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      break
    }
    case isCloudflareWorkers() && 'OKP':
      if (jwk.alg !== 'EdDSA') {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      switch (jwk.crv) {
        case 'Ed25519':
          algorithm = { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
    case 'OKP': {
      switch (jwk.alg) {
        case 'EdDSA':
          algorithm = { name: jwk.crv! }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW':
          algorithm = { name: jwk.crv! }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      break
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value')
  }

  return { algorithm, keyUsages }
}

const parse: JWKImportFunction = async (jwk: JWK): Promise<CryptoKey> => {
  const { algorithm, keyUsages } = subtleMapping(jwk)
  const rest: [RsaHashedImportParams | EcKeyAlgorithm | Algorithm, boolean, KeyUsage[]] = [
    algorithm,
    jwk.ext ?? false,
    <KeyUsage[]>jwk.key_ops ?? keyUsages,
  ]

  if (algorithm.name === 'PBKDF2') {
    return crypto.subtle.importKey('raw', base64url(jwk.k!), ...rest)
  }

  const keyData: JWK = { ...jwk }
  delete keyData.alg
  return crypto.subtle.importKey('jwk', keyData, ...rest)
}
export default parse
