import { JOSENotSupported } from '../util/errors.js';
import { table } from './key_descriptor.js';
const wrap = {
    public: ['encrypt', 'wrapKey'],
    private: ['decrypt', 'unwrapKey'],
};
const derive = { public: [], private: ['deriveBits'] };
const none = { public: [], private: [] };
function rsaes(bits) {
    return {
        kty: ['RSA'],
        subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
        usages: wrap,
        minModulusLength: 2048,
        keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
    };
}
function ecdh(kwBits) {
    return {
        kty: ['EC', 'OKP'],
        subtle: { name: 'ECDH' },
        subtleFor: ({ kty, crv, asymmetricKeyType }) => {
            if (crv === 'X25519' || asymmetricKeyType === 'x25519') {
                return { name: 'X25519' };
            }
            if (kty === 'OKP') {
                throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            }
            return { name: 'ECDH', namedCurve: crv };
        },
        usages: derive,
        kwBits,
        keyOps: { decrypt: 'deriveBits' },
    };
}
function aeskw(bits) {
    return {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'AES-KW', length: bits },
        usages: none,
        keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
    };
}
function aesgcmkw(bits) {
    return {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'AES-GCM', length: bits },
        usages: none,
        gcmkw: `A${bits}GCM`,
        keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
    };
}
function pbes2(bits, kwBits) {
    return {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'PBKDF2' },
        usages: none,
        pbes2Hash: `SHA-${bits}`,
        kwBits,
        keyOps: { encrypt: 'deriveBits', decrypt: 'deriveBits' },
    };
}
const JWE = table({
    dir: {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'AES-GCM' },
        usages: none,
        keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
    },
    'RSA-OAEP': rsaes(1),
    'RSA-OAEP-256': rsaes(256),
    'RSA-OAEP-384': rsaes(384),
    'RSA-OAEP-512': rsaes(512),
    'ECDH-ES': ecdh(),
    'ECDH-ES+A128KW': ecdh(128),
    'ECDH-ES+A192KW': ecdh(192),
    'ECDH-ES+A256KW': ecdh(256),
    A128KW: aeskw(128),
    A192KW: aeskw(192),
    A256KW: aeskw(256),
    A128GCMKW: aesgcmkw(128),
    A192GCMKW: aesgcmkw(192),
    A256GCMKW: aesgcmkw(256),
    'PBES2-HS256+A128KW': pbes2(256, 128),
    'PBES2-HS384+A192KW': pbes2(384, 192),
    'PBES2-HS512+A256KW': pbes2(512, 256),
});
const content = { public: [], private: [] };
const contentOps = { encrypt: 'encrypt', decrypt: 'decrypt' };
function gcm(bits) {
    return {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'AES-GCM', length: bits },
        usages: content,
        keyOps: contentOps,
        cekBits: bits,
        ivBits: 96,
        cbc: false,
    };
}
function cbc(bits) {
    return {
        kty: ['oct'],
        symmetric: true,
        subtle: { name: 'AES-CBC', length: bits },
        usages: content,
        keyOps: contentOps,
        cekBits: bits,
        ivBits: 128,
        cbc: true,
    };
}
const ENC = table({
    A128GCM: gcm(128),
    A192GCM: gcm(192),
    A256GCM: gcm(256),
    'A128CBC-HS256': cbc(256),
    'A192CBC-HS384': cbc(384),
    'A256CBC-HS512': cbc(512),
});
const unsupportedAlgHeader = 'Invalid or unsupported "alg" (JWE Algorithm) header value';
export function jweAlgorithm(alg) {
    const entry = JWE[alg];
    if (!entry) {
        throw new JOSENotSupported(unsupportedAlgHeader);
    }
    return entry;
}
export function maybeJWEAlgorithm(alg) {
    return JWE[alg];
}
export function jweEncryption(enc) {
    const entry = ENC[enc];
    if (!entry) {
        throw new JOSENotSupported(`Unsupported JWE Algorithm: ${enc}`);
    }
    return entry;
}
