import { JOSENotSupported } from '../util/errors.js';
import { maybeJWSAlgorithm } from './jws_algorithms.js';
import { maybeJWEAlgorithm } from './jwe_algorithms.js';
function unsupportedAlgorithm() {
    return new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
}
export function keyAlgorithm(alg) {
    if (typeof alg !== 'string') {
        throw unsupportedAlgorithm();
    }
    const entry = maybeJWSAlgorithm(alg) ?? maybeJWEAlgorithm(alg);
    if (!entry) {
        throw unsupportedAlgorithm();
    }
    return entry;
}
