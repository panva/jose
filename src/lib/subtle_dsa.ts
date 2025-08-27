import { JOSENotSupported } from '../util/errors.js'

export default (alg: string, algorithm: KeyAlgorithm | EcKeyAlgorithm) => {
  const hash = `SHA-${alg.slice(-3)}`
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      return { hash, name: 'HMAC' }
    case 'PS256':
    case 'PS384':
    case 'PS512':
      return { hash, name: 'RSA-PSS', saltLength: parseInt(alg.slice(-3), 10) >> 3 }
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return { hash, name: 'RSASSA-PKCS1-v1_5' }
    case 'ES256':
    case 'ES384':
    case 'ES512':
      return { hash, name: 'ECDSA', namedCurve: (algorithm as EcKeyAlgorithm).namedCurve }
    case 'Ed25519': // Fall through
    case 'EdDSA':
      return { name: 'Ed25519' }
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      return { name: alg }
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}
