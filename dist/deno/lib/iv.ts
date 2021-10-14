import { JOSENotSupported } from '../util/errors.ts'
import random from '../runtime/random.ts'

const bitLengths = new Map<string, number>([
  ['A128CBC-HS256', 128],
  ['A128GCM', 96],
  ['A128GCMKW', 96],
  ['A192CBC-HS384', 128],
  ['A192GCM', 96],
  ['A192GCMKW', 96],
  ['A256CBC-HS512', 128],
  ['A256GCM', 96],
  ['A256GCMKW', 96],
])

const generateIv = (alg: string): Uint8Array => {
  const bitLength = bitLengths.get(alg)
  if (!bitLength) {
    throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }

  return random(new Uint8Array(bitLength >> 3))
}

export default generateIv
export { bitLengths }
