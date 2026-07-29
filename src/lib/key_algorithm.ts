import { JOSENotSupported } from '../util/errors.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { maybeJWSAlgorithm } from './jws_algorithms.js'
import { maybeJWEAlgorithm } from './jwe_algorithms.js'

function unsupportedAlgorithm(): JOSENotSupported {
  return new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
}

/**
 * Resolves an identifier from either family. Only the key material APIs need this - an operation
 * knows which family it is in and resolves against that registry alone.
 */
export function keyAlgorithm(alg: string): KeyDescriptor {
  if (typeof alg !== 'string') {
    throw unsupportedAlgorithm()
  }
  const entry = maybeJWSAlgorithm(alg) ?? maybeJWEAlgorithm(alg)
  if (!entry) {
    throw unsupportedAlgorithm()
  }
  return entry
}
