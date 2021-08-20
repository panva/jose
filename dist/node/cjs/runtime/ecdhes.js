"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecdhAllowed = exports.generateEpk = exports.deriveKey = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const get_named_curve_js_1 = require("./get_named_curve.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const digest_js_1 = require("./digest.js");
const errors_js_1 = require("../util/errors.js");
const webcrypto_js_1 = require("./webcrypto.js");
const is_key_object_js_1 = require("./is_key_object.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const generateKeyPair = util_1.promisify(crypto_1.generateKeyPair);
const deriveKey = async (publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) => {
    const value = buffer_utils_js_1.concat(buffer_utils_js_1.lengthAndInput(buffer_utils_js_1.encoder.encode(algorithm)), buffer_utils_js_1.lengthAndInput(apu), buffer_utils_js_1.lengthAndInput(apv), buffer_utils_js_1.uint32be(keyLength));
    if (webcrypto_js_1.isCryptoKey(publicKey)) {
        publicKey = webcrypto_js_1.getKeyObject(publicKey, 'ECDH-ES');
    }
    if (!is_key_object_js_1.default(publicKey)) {
        throw new TypeError(invalid_key_input_js_1.default(publicKey, 'KeyObject', 'CryptoKey'));
    }
    if (webcrypto_js_1.isCryptoKey(privateKey)) {
        privateKey = webcrypto_js_1.getKeyObject(privateKey, 'ECDH-ES', new Set(['deriveBits', 'deriveKey']));
    }
    if (!is_key_object_js_1.default(privateKey)) {
        throw new TypeError(invalid_key_input_js_1.default(privateKey, 'KeyObject', 'CryptoKey'));
    }
    const sharedSecret = crypto_1.diffieHellman({ privateKey, publicKey });
    return buffer_utils_js_1.concatKdf(digest_js_1.default, sharedSecret, keyLength, value);
};
exports.deriveKey = deriveKey;
const generateEpk = async (key) => {
    if (webcrypto_js_1.isCryptoKey(key)) {
        key = webcrypto_js_1.getKeyObject(key);
    }
    if (!is_key_object_js_1.default(key)) {
        throw new TypeError(invalid_key_input_js_1.default(key, 'KeyObject', 'CryptoKey'));
    }
    switch (key.asymmetricKeyType) {
        case 'x25519':
            return (await generateKeyPair('x25519')).privateKey;
        case 'x448': {
            return (await generateKeyPair('x448')).privateKey;
        }
        case 'ec': {
            const namedCurve = get_named_curve_js_1.default(key);
            return (await generateKeyPair('ec', { namedCurve })).privateKey;
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid EPK');
    }
};
exports.generateEpk = generateEpk;
const ecdhAllowed = (key) => ['P-256', 'P-384', 'P-521', 'X25519', 'X448'].includes(get_named_curve_js_1.default(key));
exports.ecdhAllowed = ecdhAllowed;
