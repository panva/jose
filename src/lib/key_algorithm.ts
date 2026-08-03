import { JOSENotSupported } from '../util/errors.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { JWS } from './jws_algorithms.js'
import { JWE } from './jwe_algorithms.js'

/** The PEM and key generation APIs take "alg" as an argument rather than reading it from a JWK. */
export const algArgument = '"alg" (Algorithm)'

export function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter'): never {
  throw new JOSENotSupported(`Invalid or unsupported ${source} value`)
}

/**
 * Resolves an identifier from either family. Only the key material APIs need this - an operation
 * knows which family it is in and resolves against that registry alone.
 */
export function keyAlgorithm(alg: unknown, source?: string): KeyDescriptor {
  return (typeof alg === 'string' ? (JWS[alg] ?? JWE[alg]) : undefined) ?? unsupportedAlg(source)
}
