import { promisify } from 'util'
import { inflateRaw as inflateRawCb, deflateRaw as deflateRawCb } from 'zlib'

import type { InflateFunction, DeflateFunction } from '../../types.d'

const inflateRaw = promisify(inflateRawCb)
const deflateRaw = promisify(deflateRawCb)

export const inflate: InflateFunction = (input: Uint8Array) =>
  inflateRaw(input, { maxOutputLength: 250_000 })
export const deflate: DeflateFunction = (input: Uint8Array) => deflateRaw(input)
