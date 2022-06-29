import { JOSENotSupported } from '../util/errors.ts'
import type { InflateFunction, DeflateFunction } from '../types.d.ts'

export const inflate: InflateFunction = async () => {
  throw new JOSENotSupported(
    'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation.',
  )
}
export const deflate: DeflateFunction = async () => {
  throw new JOSENotSupported(
    'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.',
  )
}
