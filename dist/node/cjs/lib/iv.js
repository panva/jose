"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitLengths = void 0;
const errors_js_1 = require("../util/errors.js");
const bitLengths = new Map([
    ['A128CBC-HS256', 128],
    ['A128GCM', 96],
    ['A128GCMKW', 96],
    ['A192CBC-HS384', 128],
    ['A192GCM', 96],
    ['A192GCMKW', 96],
    ['A256CBC-HS512', 128],
    ['A256GCM', 96],
    ['A256GCMKW', 96],
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
