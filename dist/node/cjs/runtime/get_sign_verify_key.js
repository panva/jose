"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const webcrypto_js_1 = require("./webcrypto.js");
const secret_key_js_1 = require("./secret_key.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError((0, invalid_key_input_js_1.default)(key, 'KeyObject', 'CryptoKey'));
        }
        return (0, secret_key_js_1.default)(key);
    }
    if (key instanceof crypto.KeyObject) {
        return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        return (0, webcrypto_js_1.getKeyObject)(key, alg, new Set([usage]));
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
}
exports.default = getSignVerifyKey;
