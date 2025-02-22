import { JWEInvalid } from '../util/errors.ts'
import { bitLength } from './iv.ts'

export default (enc: string, iv: Uint8Array) => {
  if (iv.length << 3 !== bitLength(enc)) {
    throw new JWEInvalid('Invalid Initialization Vector length')
  }
}
