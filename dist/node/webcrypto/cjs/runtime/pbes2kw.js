"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const random_js_1 = require("./random.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const base64url_js_1 = require("./base64url.js");
const aeskw_js_1 = require("./aeskw.js");
const check_p2s_js_1 = require("../lib/check_p2s.js");
const webcrypto_js_1 = require("./webcrypto.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
function getCryptoKey(key) {
    if (key instanceof Uint8Array) {
        return webcrypto_js_1.default.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits']);
    }
    if (webcrypto_js_1.isCryptoKey(key)) {
        return key;
    }
    throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey', 'Uint8Array'));
}
const encrypt = async (alg, key, cek, p2c = Math.floor(Math.random() * 2049) + 2048, p2s = random_js_1.default(new Uint8Array(16))) => {
    check_p2s_js_1.default(p2s);
    const salt = buffer_utils_js_1.p2s(alg, p2s);
    const keylen = parseInt(alg.substr(13, 3), 10);
    const subtleAlg = {
        hash: { name: `SHA-${alg.substr(8, 3)}` },
        iterations: p2c,
        name: 'PBKDF2',
        salt,
    };
    const wrapAlg = {
        length: keylen,
        name: 'AES-KW',
    };
    const cryptoKey = await getCryptoKey(key);
    let derived;
    if (cryptoKey.usages.includes('deriveBits')) {
        derived = new Uint8Array(await webcrypto_js_1.default.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
    }
    else if (cryptoKey.usages.includes('deriveKey')) {
        derived = await webcrypto_js_1.default.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['wrapKey']);
    }
    else {
        throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
    }
    const encryptedKey = await aeskw_js_1.wrap(alg.substr(-6), derived, cek);
    return { encryptedKey, p2c, p2s: base64url_js_1.encode(p2s) };
};
exports.encrypt = encrypt;
const decrypt = async (alg, key, encryptedKey, p2c, p2s) => {
    check_p2s_js_1.default(p2s);
    const salt = buffer_utils_js_1.p2s(alg, p2s);
    const keylen = parseInt(alg.substr(13, 3), 10);
    const subtleAlg = {
        hash: { name: `SHA-${alg.substr(8, 3)}` },
        iterations: p2c,
        name: 'PBKDF2',
        salt,
    };
    const wrapAlg = {
        length: keylen,
        name: 'AES-KW',
    };
    const cryptoKey = await getCryptoKey(key);
    let derived;
    if (cryptoKey.usages.includes('deriveBits')) {
        derived = new Uint8Array(await webcrypto_js_1.default.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
    }
    else if (cryptoKey.usages.includes('deriveKey')) {
        derived = await webcrypto_js_1.default.subtle.deriveKey(subtleAlg, cryptoKey, wrapAlg, false, ['unwrapKey']);
    }
    else {
        throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
    }
    return aeskw_js_1.unwrap(alg.substr(-6), derived, encryptedKey);
};
exports.decrypt = decrypt;
