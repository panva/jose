"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const check_iv_length_js_1 = require("../lib/check_iv_length.js");
const check_cek_length_js_1 = require("./check_cek_length.js");
const timing_safe_equal_js_1 = require("./timing_safe_equal.js");
const errors_js_1 = require("../util/errors.js");
const webcrypto_js_1 = require("./webcrypto.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
async function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.substr(1, 3), 10);
    const encKey = await webcrypto_js_1.default.subtle.importKey('raw', cek.subarray(keySize >> 3), 'AES-CBC', false, ['decrypt']);
    const macKey = await webcrypto_js_1.default.subtle.importKey('raw', cek.subarray(0, keySize >> 3), {
        hash: { name: `SHA-${keySize << 1}` },
        name: 'HMAC',
    }, false, ['sign']);
    const macData = buffer_utils_js_1.concat(aad, iv, ciphertext, buffer_utils_js_1.uint64be(aad.length << 3));
    const expectedTag = new Uint8Array((await webcrypto_js_1.default.subtle.sign('HMAC', macKey, macData)).slice(0, keySize >> 3));
    let macCheckPassed;
    try {
        macCheckPassed = timing_safe_equal_js_1.default(tag, expectedTag);
    }
    catch {
    }
    if (!macCheckPassed) {
        throw new errors_js_1.JWEDecryptionFailed();
    }
    let plaintext;
    try {
        plaintext = new Uint8Array(await webcrypto_js_1.default.subtle.decrypt({ iv, name: 'AES-CBC' }, encKey, ciphertext));
    }
    catch {
    }
    if (!plaintext) {
        throw new errors_js_1.JWEDecryptionFailed();
    }
    return plaintext;
}
async function gcmDecrypt(cek, ciphertext, iv, tag, aad) {
    const encKey = cek instanceof Uint8Array
        ? await webcrypto_js_1.default.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt'])
        : cek;
    try {
        return new Uint8Array(await webcrypto_js_1.default.subtle.decrypt({
            additionalData: aad,
            iv,
            name: 'AES-GCM',
            tagLength: 128,
        }, encKey, buffer_utils_js_1.concat(ciphertext, tag)));
    }
    catch {
        throw new errors_js_1.JWEDecryptionFailed();
    }
}
const decrypt = async (enc, cek, ciphertext, iv, tag, aad) => {
    if (!webcrypto_js_1.isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
        throw new TypeError(invalid_key_input_js_1.default(cek, 'CryptoKey', 'Uint8Array'));
    }
    check_cek_length_js_1.default(enc, cek);
    check_iv_length_js_1.default(enc, iv);
    switch (enc) {
        case 'A128CBC-HS256':
        case 'A192CBC-HS384':
        case 'A256CBC-HS512':
            return cbcDecrypt(enc, cek, ciphertext, iv, tag, aad);
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            return gcmDecrypt(cek, ciphertext, iv, tag, aad);
        default:
            throw new errors_js_1.JOSENotSupported('unsupported JWE Content Encryption Algorithm');
    }
};
exports.default = decrypt;
