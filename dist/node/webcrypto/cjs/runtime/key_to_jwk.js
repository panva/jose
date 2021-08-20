"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webcrypto_js_1 = require("./webcrypto.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const base64url_js_1 = require("./base64url.js");
const keyToJWK = async (key) => {
    if (key instanceof Uint8Array) {
        return {
            kty: 'oct',
            k: base64url_js_1.encode(key),
        };
    }
    if (!webcrypto_js_1.isCryptoKey(key)) {
        throw new TypeError(invalid_key_input_js_1.default(key, 'CryptoKey', 'Uint8Array'));
    }
    if (!key.extractable) {
        throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK');
    }
    const { ext, key_ops, alg, use, ...jwk } = await webcrypto_js_1.default.subtle.exportKey('jwk', key);
    return jwk;
};
exports.default = keyToJWK;
