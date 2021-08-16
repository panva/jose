import { JOSENotSupported } from '../../util/errors.js'
import type { InflateFunction, DeflateFunction } from '../../types.d'

export const inflate: InflateFunction = async () => {
  throw new JOSENotSupported(
    'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation, e.g. using the "pako" module.',
  )
}
export const deflate: DeflateFunction = async () => {
  throw new JOSENotSupported(
    'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime.',
  )
}
