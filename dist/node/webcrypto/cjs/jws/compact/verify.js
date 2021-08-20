"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactVerify = void 0;
const verify_js_1 = require("../flattened/verify.js");
const errors_js_1 = require("../../util/errors.js");
const buffer_utils_js_1 = require("../../lib/buffer_utils.js");
async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = buffer_utils_js_1.decoder.decode(jws);
    }
    if (typeof jws !== 'string') {
        throw new errors_js_1.JWSInvalid('Compact JWS must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
    if (length !== 3) {
        throw new errors_js_1.JWSInvalid('Invalid Compact JWS');
    }
    const verified = await verify_js_1.default({
        payload: (payload || undefined),
        protected: protectedHeader || undefined,
        signature: (signature || undefined),
    }, key, options);
    return { payload: verified.payload, protectedHeader: verified.protectedHeader };
}
exports.compactVerify = compactVerify;
exports.default = compactVerify;
