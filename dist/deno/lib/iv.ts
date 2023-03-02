import { JOSENotSupported } from '../util/errors.ts'
import random from '../runtime/random.ts'

export function bitLength(alg: string) {
  switch (alg) {
    case 'A128GCM':
    case 'A128GCMKW':
    case 'A192GCM':
    case 'A192GCMKW':
    case 'A256GCM':
    case 'A256GCMKW':
      return 96
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return 128
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }
}
export default (alg: string): Uint8Array => random(new Uint8Array(bitLength(alg) >> 3))
