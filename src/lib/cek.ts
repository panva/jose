import type { AsyncOrSync } from '../types.i.d'
import { JOSENotSupported } from '../util/errors.js'

const bitLengths = new Map<string, number>([
  ['A128CBC-HS256', 256],
  ['A128GCM', 128],
  ['A192CBC-HS384', 384],
  ['A192GCM', 192],
  ['A256CBC-HS512', 512],
  ['A256GCM', 256],
])

const factory = (random: (array: Uint8Array) => AsyncOrSync<Uint8Array>) => (
  alg: string,
): AsyncOrSync<Uint8Array> => {
  const bitLength = bitLengths.get(alg)
  if (!bitLength) {
    throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`)
  }

  return random(new Uint8Array(bitLength >> 3))
}
export default factory
export { bitLengths }
