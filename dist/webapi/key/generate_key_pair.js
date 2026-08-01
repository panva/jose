import { JOSENotSupported } from '../util/errors.js';
import { keyAlgorithm } from '../lib/key_algorithm.js';
function getModulusLengthOption(options) {
    const modulusLength = options?.modulusLength ?? 2048;
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
        throw new JOSENotSupported('Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used');
    }
    return modulusLength;
}
export async function generateKeyPair(alg, options) {
    const entry = keyAlgorithm(alg);
    if (entry.secret) {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    let algorithm;
    if (entry.resolve) {
        const crv = options?.crv ?? 'P-256';
        switch (crv) {
            case 'P-256':
            case 'P-384':
            case 'P-521':
                algorithm = { name: 'ECDH', namedCurve: crv };
                break;
            case 'X25519':
                algorithm = { name: 'X25519' };
                break;
            default:
                throw new JOSENotSupported('Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519');
        }
    }
    else {
        if (entry.crv !== undefined && options?.crv !== undefined && options.crv !== entry.crv) {
            throw new JOSENotSupported(`Invalid or unsupported crv option provided, the only supported value for ${alg} is ${entry.crv}`);
        }
        algorithm =
            entry.kty[0] === 'RSA'
                ? {
                    ...entry.subtle,
                    publicExponent: Uint8Array.of(0x01, 0x00, 0x01),
                    modulusLength: getModulusLengthOption(options),
                }
                : entry.subtle;
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
        ...entry.usages[1],
        ...entry.usages[0],
    ]);
}
