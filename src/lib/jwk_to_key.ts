import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'

const unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'

function subtleMapping(jwk: types.JWK): {
  algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  keyUsages: KeyUsage[]
} {
  let algorithm: RsaHashedImportParams | EcKeyAlgorithm | Algorithm
  let keyUsages: KeyUsage[]

  switch (jwk.kty) {
    case 'AKP': {
      switch (jwk.alg) {
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
          algorithm = { name: jwk.alg }
          keyUsages = jwk.priv ? ['sign'] : ['verify']
          break
        default:
          throw new JOSENotSupported(unsupportedAlg)
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
          throw new JOSENotSupported(unsupportedAlg)
      }
      break
    }
    case 'EC': {
      switch (jwk.alg) {
        case 'ES256':
        case 'ES384':
        case 'ES512':
          algorithm = {
            name: 'ECDSA',
            namedCurve: { ES256: 'P-256', ES384: 'P-384', ES512: 'P-521' }[jwk.alg],
          }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW':
          algorithm = { name: 'ECDH', namedCurve: jwk.crv! }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        case 'HPKE-0':
        case 'HPKE-7':
          algorithm = { name: 'ECDH', namedCurve: 'P-256' }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        default:
          throw new JOSENotSupported(unsupportedAlg)
      }
      break
    }
    case 'OKP': {
      switch (jwk.alg) {
        case 'Ed25519': // Fall through
        case 'EdDSA':
          algorithm = { name: 'Ed25519' }
          keyUsages = jwk.d ? ['sign'] : ['verify']
          break
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW':
          algorithm = { name: jwk.crv! }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        case 'HPKE-3':
        case 'HPKE-4':
          algorithm = { name: 'X25519' }
          keyUsages = jwk.d ? ['deriveBits'] : []
          break
        default:
          throw new JOSENotSupported(unsupportedAlg)
      }
      break
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value')
  }

  return { algorithm, keyUsages }
}

export async function jwkToKey(jwk: types.JWK): Promise<types.CryptoKey> {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present')
  }

  const { algorithm, keyUsages } = subtleMapping(jwk)

  const keyData: types.JWK = { ...jwk }
  if (keyData.kty !== 'AKP') {
    delete keyData.alg
  }
  delete keyData.use

  return crypto.subtle.importKey(
    'jwk',
    keyData,
    algorithm,
    jwk.ext ?? (jwk.d || jwk.priv ? false : true),
    (jwk.key_ops as KeyUsage[]) ?? keyUsages,
  )
}
