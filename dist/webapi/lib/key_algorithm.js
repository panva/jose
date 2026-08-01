import { JOSENotSupported } from '../util/errors.js';
import { maybeJWSAlgorithm } from './jws_algorithms.js';
import { maybeJWEAlgorithm } from './jwe_algorithms.js';
export function keyAlgorithm(alg) {
    const entry = typeof alg === 'string' ? (maybeJWSAlgorithm(alg) ?? maybeJWEAlgorithm(alg)) : undefined;
    if (!entry) {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return entry;
}
