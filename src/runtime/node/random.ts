import { randomFillSync } from 'crypto'
import type { GetRandomValuesFunction } from '../interfaces.d'

const random: GetRandomValuesFunction = randomFillSync

export default random
