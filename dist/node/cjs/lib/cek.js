"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitLengths = void 0;
const errors_js_1 = require("../util/errors.js");
const bitLengths = new Map([
    ['A128CBC-HS256', 256],
    ['A128GCM', 128],
    ['A192CBC-HS384', 384],
    ['A192GCM', 192],
    ['A256CBC-HS512', 512],
    ['A256GCM', 256],
]);
exports.bitLengths = bitLengths;
const factory = (random) => (alg) => {
    const bitLength = bitLengths.get(alg);
    if (!bitLength) {
        throw new errors_js_1.JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
    return random(new Uint8Array(bitLength >> 3));
};
exports.default = factory;
