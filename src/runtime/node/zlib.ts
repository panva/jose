import { promisify } from 'util'
import { inflateRaw as inflateRawCb, deflateRaw as deflateRawCb } from 'zlib'

import type { InflateFunction, DeflateFunction } from '../../types.d'

const inflateRaw = promisify(inflateRawCb)
const deflateRaw = promisify(deflateRawCb)

export const inflate: InflateFunction = async (input: Uint8Array) => {
  return inflateRaw(input)
}

export const deflate: DeflateFunction = async (input: Uint8Array) => {
  return deflateRaw(input)
}
