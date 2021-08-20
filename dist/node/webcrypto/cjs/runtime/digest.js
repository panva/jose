"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webcrypto_js_1 = require("./webcrypto.js");
const digest = async (algorithm, data) => {
    const subtleDigest = `SHA-${algorithm.substr(-3)}`;
    return new Uint8Array(await webcrypto_js_1.default.subtle.digest(subtleDigest, data));
};
exports.default = digest;
