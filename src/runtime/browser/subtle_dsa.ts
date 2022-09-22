import { isCloudflareWorkers } from './env.js'
import { JOSENotSupported } from '../../util/errors.js'

export default function subtleDsa(alg: string, algorithm: KeyAlgorithm | EcKeyAlgorithm) {
  const hash = `SHA-${alg.slice(-3)}`
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      return { hash, name: 'HMAC' }
    case 'PS256':
    case 'PS384':
    case 'PS512':
      // @ts-expect-error
      return { hash, name: 'RSA-PSS', saltLength: alg.slice(-3) >> 3 }
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return { hash, name: 'RSASSA-PKCS1-v1_5' }
    case 'ES256':
    case 'ES384':
    case 'ES512':
      return { hash, name: 'ECDSA', namedCurve: (<EcKeyAlgorithm>algorithm).namedCurve }
    case isCloudflareWorkers() && 'EdDSA':
      const { namedCurve } = <EcKeyAlgorithm>algorithm
      return <EcKeyAlgorithm>{ name: namedCurve, namedCurve }
    case 'EdDSA':
      return { name: algorithm.name }
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}
