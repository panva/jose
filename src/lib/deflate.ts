import type * as types from '../types.d.ts'
import { JWEInvalid } from '../util/errors.js'
import {
  resolveJWECompression,
  type JWEAlgorithmSet,
  type JWECompressionCapability,
} from './jwe_algorithm.js'

export function validateZip(
  joseHeader: types.JWEHeaderParameters,
  protectedHeader: types.JWEHeaderParameters | undefined,
  algorithms: JWEAlgorithmSet,
): Readonly<JWECompressionCapability> | undefined {
  if (joseHeader.zip === undefined) return undefined

  const compression = resolveJWECompression(algorithms, joseHeader.zip)
  if (!protectedHeader?.zip) {
    throw new JWEInvalid(
      'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    )
  }
  return compression
}
