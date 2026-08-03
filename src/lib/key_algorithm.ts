import { JOSENotSupported } from '../util/errors.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { JWS } from './jws_algorithms.js'
import { JWE } from './jwe_algorithms.js'

/**
 * Resolves an identifier from either family. Only the key material APIs need this - an operation
 * knows which family it is in and resolves against that registry alone.
 */
export function keyAlgorithm(alg: string): KeyDescriptor {
  const entry = typeof alg === 'string' ? (JWS[alg] ?? JWE[alg]) : undefined
  if (!entry) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }
  return entry
}
