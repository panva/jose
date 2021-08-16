import { timingSafeEqual as impl } from 'crypto'

import type { TimingSafeEqual } from '../interfaces.d'

const timingSafeEqual: TimingSafeEqual = impl

export default timingSafeEqual
