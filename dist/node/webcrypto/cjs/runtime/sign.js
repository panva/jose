"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subtle_dsa_js_1 = require("./subtle_dsa.js");
const webcrypto_js_1 = require("./webcrypto.js");
const check_key_length_js_1 = require("./check_key_length.js");
const get_sign_verify_key_js_1 = require("./get_sign_verify_key.js");
const sign = async (alg, key, data) => {
    const cryptoKey = await get_sign_verify_key_js_1.default(alg, key, 'sign');
    check_key_length_js_1.default(alg, cryptoKey);
    const signature = await webcrypto_js_1.default.subtle.sign(subtle_dsa_js_1.default(alg), cryptoKey, data);
    return new Uint8Array(signature);
};
exports.default = sign;
