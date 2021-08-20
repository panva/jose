"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecdhAllowed = exports.generateEpk = exports.deriveKey = void 0;
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const webcrypto_js_1 = require("./webcrypto.js");
const digest_js_1 = require("./digest.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const deriveKey = async (publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) => {
    if (!webcrypto_js_1.isCryptoKey(publicKey)) {
        throw new TypeError(invalid_key_input_js_1.default(publicKey, 'CryptoKey'));
    }
    if (!webcrypto_js_1.isCryptoKey(privateKey)) {
        throw new TypeError(invalid_key_input_js_1.default(privateKey, 'CryptoKey'));
    }
    const value = buffer_utils_js_1.concat(buffer_utils_js_1.lengthAndInput(buffer_utils_js_1.encoder.encode(algorithm)), buffer_utils_js_1.lengthAndInput(apu), buffer_utils_js_1.lengthAndInput(apv), buffer_utils_js_1.uint32be(keyLength));
    if (!privateKey.usages.includes('deriveBits')) {
        throw new TypeError('ECDH-ES private key "usages" must include "deriveBits"');
    }
    const sharedSecret = new Uint8Array(await webcrypto_js_1.default.subtle.deriveBits({
        name: 'ECDH',
        public: publicKey,
    }, privateKey, Math.ceil(parseInt(privateKey.algorithm.namedCurve.substr(-3), 10) / 8) <<
        3));
    return buffer_utils_js_1.concatKdf(digest_js_1.default, sharedSecret, keyLength, value);
};
exports.deriveKey = deriveKey;
const generateEpk = async (key) => {
    if (!webcrypto_js_1.isCryptoKey(key)) {
        throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey'));
    }
    return (await webcrypto_js_1.default.subtle.generateKey({ name: 'ECDH', namedCurve: key.algorithm.namedCurve }, true, ['deriveBits'])).privateKey;
};
exports.generateEpk = generateEpk;
const ecdhAllowed = (key) => {
    if (!webcrypto_js_1.isCryptoKey(key)) {
        throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey'));
    }
    return ['P-256', 'P-384', 'P-521'].includes(key.algorithm.namedCurve);
};
exports.ecdhAllowed = ecdhAllowed;
