import type { GetRandomValuesFunction } from '../interfaces.d'
import crypto from './webcrypto.js'

const random: GetRandomValuesFunction = crypto.getRandomValues.bind(crypto)

export default random
