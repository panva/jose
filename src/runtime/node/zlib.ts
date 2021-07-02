import { promisify } from 'util'
import { inflateRaw as inflateRawCb, deflateRaw as deflateRawCb } from 'zlib'

import type { InflateFunction, DeflateFunction } from '../../types'

const inflateRaw = promisify(inflateRawCb)
const deflateRaw = promisify(deflateRawCb)

export const inflate: InflateFunction = (input: Uint8Array) => inflateRaw(input)
export const deflate: DeflateFunction = (input: Uint8Array) => deflateRaw(input)
