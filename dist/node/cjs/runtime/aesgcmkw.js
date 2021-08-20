"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = exports.wrap = void 0;
const encrypt_js_1 = require("./encrypt.js");
const decrypt_js_1 = require("./decrypt.js");
const iv_js_1 = require("../lib/iv.js");
const random_js_1 = require("./random.js");
const base64url_js_1 = require("./base64url.js");
const generateIv = iv_js_1.default(random_js_1.default);
const wrap = async (alg, key, cek, iv) => {
    const jweAlgorithm = alg.substr(0, 7);
    iv || (iv = generateIv(jweAlgorithm));
    const { ciphertext: encryptedKey, tag } = await encrypt_js_1.default(jweAlgorithm, cek, key, iv, new Uint8Array(0));
    return { encryptedKey, iv: base64url_js_1.encode(iv), tag: base64url_js_1.encode(tag) };
};
exports.wrap = wrap;
const unwrap = async (alg, key, encryptedKey, iv, tag) => {
    const jweAlgorithm = alg.substr(0, 7);
    return decrypt_js_1.default(jweAlgorithm, key, encryptedKey, iv, tag, new Uint8Array(0));
};
exports.unwrap = unwrap;
