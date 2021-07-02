import { timingSafeEqual as impl } from 'crypto'

import type { TimingSafeEqual } from '../interfaces'

const timingSafeEqual: TimingSafeEqual = impl

export default timingSafeEqual
