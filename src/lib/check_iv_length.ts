import { JWEInvalid } from '../util/errors.js'
import { bitLengths } from './iv.js'

const checkIvLength = (enc: string, iv: Uint8Array) => {
  if (iv.length << 3 !== bitLengths.get(enc)) {
    throw new JWEInvalid('Invalid Initialization Vector length')
  }
}

export default checkIvLength
