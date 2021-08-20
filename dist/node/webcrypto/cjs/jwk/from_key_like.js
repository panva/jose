"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromKeyLike = void 0;
const key_to_jwk_js_1 = require("../runtime/key_to_jwk.js");
async function fromKeyLike(key) {
    return key_to_jwk_js_1.default(key);
}
exports.fromKeyLike = fromKeyLike;
exports.default = fromKeyLike;
