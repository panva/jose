"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subtle_dsa_js_1 = require("./subtle_dsa.js");
const webcrypto_js_1 = require("./webcrypto.js");
const check_key_length_js_1 = require("./check_key_length.js");
const get_sign_verify_key_js_1 = require("./get_sign_verify_key.js");
const verify = async (alg, key, signature, data) => {
    const cryptoKey = await get_sign_verify_key_js_1.default(alg, key, 'verify');
    check_key_length_js_1.default(alg, cryptoKey);
    const algorithm = subtle_dsa_js_1.default(alg);
    try {
        return await webcrypto_js_1.default.subtle.verify(algorithm, cryptoKey, signature, data);
    }
    catch {
        return false;
    }
};
exports.default = verify;
