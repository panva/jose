import { JOSENotSupported } from '../util/errors.ts'
import random from '../runtime/random.ts'

export function bitLength(alg: string) {
  switch (alg) {
    case 'A128CBC-HS256':
      return 128
    case 'A128GCM':
      return 96
    case 'A128GCMKW':
      return 96
    case 'A192CBC-HS384':
      return 128
    case 'A192GCM':
      return 96
    case 'A192GCMKW':
      return 96
    case 'A256CBC-HS512':
      return 128
    case 'A256GCM':
      return 96
    case 'A256GCMKW':
      return 96
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }
}
export default (alg: string): Uint8Array => random(new Uint8Array(bitLength(alg) >> 3))
