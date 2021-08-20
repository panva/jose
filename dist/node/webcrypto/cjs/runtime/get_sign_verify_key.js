"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webcrypto_js_1 = require("./webcrypto.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
function getCryptoKey(alg, key, usage) {
    if (webcrypto_js_1.isCryptoKey(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey'));
        }
        return webcrypto_js_1.default.subtle.importKey('raw', key, { hash: { name: `SHA-${alg.substr(-3)}` }, name: 'HMAC' }, false, [usage]);
    }
    throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey', 'Uint8Array'));
}
exports.default = getCryptoKey;
