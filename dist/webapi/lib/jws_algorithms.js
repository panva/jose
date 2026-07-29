import { JOSENotSupported } from '../util/errors.js';
import { table } from './key_descriptor.js';
const sig = { public: ['verify'], private: ['sign'] };
function hmac(bits) {
    const subtle = { name: 'HMAC', hash: `SHA-${bits}` };
    return { kty: ['oct'], symmetric: true, subtle, operation: subtle, usages: sig };
}
function rsa(name, bits, saltLength) {
    const subtle = { name, hash: `SHA-${bits}` };
    return {
        kty: ['RSA'],
        subtle,
        operation: saltLength ? { ...subtle, saltLength } : subtle,
        usages: sig,
        minModulusLength: 2048,
    };
}
function ecdsa(crv, bits) {
    return {
        kty: ['EC'],
        crv,
        subtle: { name: 'ECDSA', namedCurve: crv },
        operation: { name: 'ECDSA', hash: `SHA-${bits}` },
        usages: sig,
    };
}
function eddsa() {
    const subtle = { name: 'Ed25519' };
    return {
        kty: ['OKP'],
        crv: 'Ed25519',
        subtle,
        operation: subtle,
        usages: sig,
    };
}
function mldsa(name) {
    const subtle = { name };
    return {
        kty: ['AKP'],
        subtle,
        operation: subtle,
        usages: sig,
    };
}
const JWS = table({
    HS256: hmac(256),
    HS384: hmac(384),
    HS512: hmac(512),
    RS256: rsa('RSASSA-PKCS1-v1_5', 256),
    RS384: rsa('RSASSA-PKCS1-v1_5', 384),
    RS512: rsa('RSASSA-PKCS1-v1_5', 512),
    PS256: rsa('RSA-PSS', 256, 32),
    PS384: rsa('RSA-PSS', 384, 48),
    PS512: rsa('RSA-PSS', 512, 64),
    ES256: ecdsa('P-256', 256),
    ES384: ecdsa('P-384', 384),
    ES512: ecdsa('P-521', 512),
    EdDSA: eddsa(),
    Ed25519: eddsa(),
    'ML-DSA-44': mldsa('ML-DSA-44'),
    'ML-DSA-65': mldsa('ML-DSA-65'),
    'ML-DSA-87': mldsa('ML-DSA-87'),
});
export function jwsAlgorithm(alg) {
    const entry = JWS[alg];
    if (!entry) {
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    return entry;
}
export function maybeJWSAlgorithm(alg) {
    return JWS[alg];
}
