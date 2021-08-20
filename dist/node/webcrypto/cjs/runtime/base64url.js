"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
let encodeImpl;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = buffer_utils_js_1.decoder.decode(encoded);
    }
    return encoded;
}
if (Buffer.isEncoding('base64url')) {
    encodeImpl = (input) => Buffer.from(input).toString('base64url');
}
else {
    encodeImpl = (input) => Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
exports.encode = encodeImpl;
const decode = (input) => Buffer.from(normalize(input), 'base64');
exports.decode = decode;
