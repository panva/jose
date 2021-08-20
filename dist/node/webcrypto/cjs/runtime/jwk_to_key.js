"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webcrypto_js_1 = require("./webcrypto.js");
const errors_js_1 = require("../util/errors.js");
const base64url_js_1 = require("./base64url.js");
function subtleMapping(jwk) {
    let algorithm;
    let keyUsages;
    switch (jwk.kty) {
        case 'oct': {
            switch (jwk.alg) {
                case 'HS256':
                case 'HS384':
                case 'HS512':
                    algorithm = { name: 'HMAC', hash: { name: `SHA-${jwk.alg.substr(-3)}` } };
                    keyUsages = ['sign', 'verify'];
                    break;
                case 'A128CBC-HS256':
                case 'A192CBC-HS384':
                case 'A256CBC-HS512':
                    throw new errors_js_1.JOSENotSupported(`${jwk.alg} keys cannot be imported as CryptoKey instances`);
                case 'A128GCM':
                case 'A192GCM':
                case 'A256GCM':
                case 'A128GCMKW':
                case 'A192GCMKW':
                case 'A256GCMKW':
                    algorithm = { name: 'AES-GCM' };
                    keyUsages = ['encrypt', 'decrypt'];
                    break;
                case 'A128KW':
                case 'A192KW':
                case 'A256KW':
                    algorithm = { name: 'AES-KW' };
                    keyUsages = ['wrapKey', 'unwrapKey'];
                    break;
                case 'PBES2-HS256+A128KW':
                case 'PBES2-HS384+A192KW':
                case 'PBES2-HS512+A256KW':
                    algorithm = { name: 'PBKDF2' };
                    keyUsages = ['deriveBits'];
                    break;
                default:
                    throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "alg" (Algorithm) Parameter value');
            }
            break;
        }
        case 'RSA': {
            switch (jwk.alg) {
                case 'PS256':
                case 'PS384':
                case 'PS512':
                    algorithm = { name: 'RSA-PSS', hash: { name: `SHA-${jwk.alg.substr(-3)}` } };
                    keyUsages = jwk.d ? ['sign'] : ['verify'];
                    break;
                case 'RS256':
                case 'RS384':
                case 'RS512':
                    algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: { name: `SHA-${jwk.alg.substr(-3)}` } };
                    keyUsages = jwk.d ? ['sign'] : ['verify'];
                    break;
                case 'RSA-OAEP':
                case 'RSA-OAEP-256':
                case 'RSA-OAEP-384':
                case 'RSA-OAEP-512':
                    algorithm = {
                        name: 'RSA-OAEP',
                        hash: { name: `SHA-${parseInt(jwk.alg.substr(-3), 10) || 1}` },
                    };
                    keyUsages = jwk.d ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey'];
                    break;
                default:
                    throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "alg" (Algorithm) Parameter value');
            }
            break;
        }
        case 'EC': {
            switch (jwk.alg) {
                case 'ES256':
                case 'ES384':
                case 'ES512':
                    algorithm = { name: 'ECDSA', namedCurve: jwk.crv };
                    keyUsages = jwk.d ? ['sign'] : ['verify'];
                    break;
                case 'ECDH-ES':
                case 'ECDH-ES+A128KW':
                case 'ECDH-ES+A192KW':
                case 'ECDH-ES+A256KW':
                    algorithm = { name: 'ECDH', namedCurve: jwk.crv };
                    keyUsages = jwk.d ? ['deriveBits'] : [];
                    break;
                default:
                    throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "alg" (Algorithm) Parameter value');
            }
            break;
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "kty" (Key Type) Parameter value');
    }
    return { algorithm, keyUsages };
}
const parse = async (jwk) => {
    const { algorithm, keyUsages } = subtleMapping(jwk);
    let format = 'jwk';
    let keyData = { ...jwk };
    delete keyData.alg;
    if (algorithm.name === 'PBKDF2') {
        format = 'raw';
        keyData = base64url_js_1.decode(jwk.k);
    }
    return webcrypto_js_1.default.subtle.importKey(format, keyData, algorithm, jwk.ext ?? false, jwk.key_ops ?? keyUsages);
};
exports.default = parse;
