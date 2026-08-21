import { JOSENotSupported } from '../util/errors.js';
import { table } from './key_descriptor.js';
const wrap = [
    ['encrypt', 'wrapKey'],
    ['decrypt', 'unwrapKey'],
];
const derive = [[], ['deriveBits']];
const none = [[], []];
function rsaes(bits) {
    return {
        kty: ['RSA'],
        subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
        usages: wrap,
        ops: ['wrapKey', 'unwrapKey'],
    };
}
function ecdh() {
    return {
        kty: ['EC', 'OKP'],
        subtle: { name: 'ECDH' },
        resolve: ({ kty, crv, asymmetricKeyType }) => {
            if (crv === 'X25519' || asymmetricKeyType === 'x25519') {
                return { name: 'X25519' };
            }
            if (kty === 'OKP') {
                throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            }
            return { name: 'ECDH', namedCurve: crv };
        },
        usages: derive,
        ops: [undefined, 'deriveBits'],
    };
}
function aeskw(bits, gcm = false) {
    return {
        kty: ['oct'],
        secret: true,
        subtle: { name: gcm ? 'AES-GCM' : 'AES-KW', length: bits },
        usages: none,
        ops: gcm ? ['encrypt', 'decrypt'] : ['wrapKey', 'unwrapKey'],
    };
}
function pbes2() {
    return {
        kty: ['oct'],
        secret: true,
        subtle: { name: 'PBKDF2' },
        usages: none,
        ops: ['deriveBits', 'deriveBits'],
    };
}
export const JWE = table({
    dir: {
        kty: ['oct'],
        secret: true,
        subtle: { name: 'AES-GCM' },
        usages: none,
        ops: ['encrypt', 'decrypt'],
    },
    'RSA-OAEP': rsaes(1),
    'RSA-OAEP-256': rsaes(256),
    'RSA-OAEP-384': rsaes(384),
    'RSA-OAEP-512': rsaes(512),
    'ECDH-ES': ecdh(),
    'ECDH-ES+A128KW': ecdh(),
    'ECDH-ES+A192KW': ecdh(),
    'ECDH-ES+A256KW': ecdh(),
    A128KW: aeskw(128),
    A192KW: aeskw(192),
    A256KW: aeskw(256),
    A128GCMKW: aeskw(128, true),
    A192GCMKW: aeskw(192, true),
    A256GCMKW: aeskw(256, true),
    'PBES2-HS256+A128KW': pbes2(),
    'PBES2-HS384+A192KW': pbes2(),
    'PBES2-HS512+A256KW': pbes2(),
});
const contentOps = ['encrypt', 'decrypt'];
function contentEncryption(bits, cbc = false) {
    return {
        kty: ['oct'],
        secret: true,
        subtle: { name: cbc ? 'AES-CBC' : 'AES-GCM', length: bits },
        usages: none,
        ops: contentOps,
        cekBits: bits,
        ivBits: cbc ? 128 : 96,
        cbc,
    };
}
const ENC = table({
    A128GCM: contentEncryption(128),
    A192GCM: contentEncryption(192),
    A256GCM: contentEncryption(256),
    'A128CBC-HS256': contentEncryption(256, true),
    'A192CBC-HS384': contentEncryption(384, true),
    'A256CBC-HS512': contentEncryption(512, true),
});
function unsupported(parameter, name) {
    throw new JOSENotSupported(`Invalid or unsupported "${parameter}" (JWE ${name}) header value`);
}
export function jweAlgorithm(alg) {
    return (typeof alg === 'string' ? JWE[alg] : undefined) ?? unsupported('alg', 'Algorithm');
}
export function jweEncryption(enc) {
    return ((typeof enc === 'string' ? ENC[enc] : undefined) ?? unsupported('enc', 'Encryption Algorithm'));
}
