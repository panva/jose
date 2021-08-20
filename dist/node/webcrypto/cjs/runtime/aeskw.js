"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = exports.wrap = void 0;
const bogus_js_1 = require("./bogus.js");
const webcrypto_js_1 = require("./webcrypto.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
function checkKeySize(key, alg) {
    if (key.algorithm.length !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
function getCryptoKey(key, usage) {
    if (webcrypto_js_1.isCryptoKey(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        return webcrypto_js_1.default.subtle.importKey('raw', key, 'AES-KW', true, [usage]);
    }
    throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey', 'Uint8Array'));
}
const wrap = async (alg, key, cek) => {
    const cryptoKey = await getCryptoKey(key, 'wrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await webcrypto_js_1.default.subtle.importKey('raw', cek, ...bogus_js_1.default);
    return new Uint8Array(await webcrypto_js_1.default.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'));
};
exports.wrap = wrap;
const unwrap = async (alg, key, encryptedKey) => {
    const cryptoKey = await getCryptoKey(key, 'unwrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await webcrypto_js_1.default.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', ...bogus_js_1.default);
    return new Uint8Array(await webcrypto_js_1.default.subtle.exportKey('raw', cryptoKeyCek));
};
exports.unwrap = unwrap;
