import { JOSENotSupported } from '../util/errors.js';
import { JWS } from './jws_algorithms.js';
import { JWE } from './jwe_algorithms.js';
export const algArgument = '"alg" (Algorithm)';
export function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter') {
    throw new JOSENotSupported(`Invalid or unsupported ${source} value`);
}
export function keyAlgorithm(alg, source) {
    return (typeof alg === 'string' ? (JWS[alg] ?? JWE[alg]) : undefined) ?? unsupportedAlg(source);
}
