"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const get_named_curve_js_1 = require("./get_named_curve.js");
const errors_js_1 = require("../util/errors.js");
const check_modulus_length_js_1 = require("./check_modulus_length.js");
const ecCurveAlgMap = new Map([
    ['ES256', 'P-256'],
    ['ES256K', 'secp256k1'],
    ['ES384', 'P-384'],
    ['ES512', 'P-521'],
]);
function keyForCrypto(alg, key) {
    switch (alg) {
        case 'EdDSA':
            if (!['ed25519', 'ed448'].includes(key.asymmetricKeyType)) {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448');
            }
            return key;
        case 'RS256':
        case 'RS384':
        case 'RS512':
            if (key.asymmetricKeyType !== 'rsa') {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa');
            }
            check_modulus_length_js_1.default(key, alg);
            return key;
        case 'PS256':
        case 'PS384':
        case 'PS512':
            if (key.asymmetricKeyType !== 'rsa') {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa');
            }
            check_modulus_length_js_1.default(key, alg);
            return {
                key,
                padding: crypto_1.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: crypto_1.constants.RSA_PSS_SALTLEN_DIGEST,
            };
        case 'ES256':
        case 'ES256K':
        case 'ES384':
        case 'ES512': {
            if (key.asymmetricKeyType !== 'ec') {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be ec');
            }
            const actual = get_named_curve_js_1.default(key);
            const expected = ecCurveAlgMap.get(alg);
            if (actual !== expected) {
                throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
            }
            return { dsaEncoding: 'ieee-p1363', key };
        }
        default:
            throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
exports.default = keyForCrypto;
