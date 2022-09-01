"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalDecrypt = void 0;
const decrypt_js_1 = require("../flattened/decrypt.js");
const errors_js_1 = require("../../util/errors.js");
const is_object_js_1 = require("../../lib/is_object.js");
async function generalDecrypt(jwe, key, options) {
    if (!is_object_js_1.default(jwe)) {
        throw new errors_js_1.JWEInvalid('General JWE must be an object');
    }
    if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(is_object_js_1.default)) {
        throw new errors_js_1.JWEInvalid('JWE Recipients missing or incorrect type');
    }
    for (const recipient of jwe.recipients) {
        try {
            return await decrypt_js_1.default({
                aad: jwe.aad,
                ciphertext: jwe.ciphertext,
                encrypted_key: recipient.encrypted_key,
                header: recipient.header,
                iv: jwe.iv,
                protected: jwe.protected,
                tag: jwe.tag,
                unprotected: jwe.unprotected,
            }, key, options);
        }
        catch {
        }
    }
    throw new errors_js_1.JWEDecryptionFailed();
}
exports.generalDecrypt = generalDecrypt;
exports.default = generalDecrypt;
