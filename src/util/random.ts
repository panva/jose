import runtimeRandom from '../runtime/random.js'

interface GetRandomValuesFunction {
  (array: Uint8Array): Uint8Array
}

const random: GetRandomValuesFunction = runtimeRandom
export { random }
export default random
