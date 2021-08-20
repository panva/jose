"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateThumbprint = void 0;
const errors_js_1 = require("../util/errors.js");
const digest_js_1 = require("../runtime/digest.js");
const base64url_js_1 = require("../runtime/base64url.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const is_object_js_1 = require("../lib/is_object.js");
const check = (value, description) => {
    if (typeof value !== 'string' || !value) {
        throw new errors_js_1.JWKInvalid(`${description} missing or invalid`);
    }
};
async function calculateThumbprint(jwk, digestAlgorithm = 'sha256') {
    if (!is_object_js_1.default(jwk)) {
        throw new TypeError('JWK must be an object');
    }
    let components;
    switch (jwk.kty) {
        case 'EC':
            check(jwk.crv, '"crv" (Curve) Parameter');
            check(jwk.x, '"x" (X Coordinate) Parameter');
            check(jwk.y, '"y" (Y Coordinate) Parameter');
            components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
            break;
        case 'OKP':
            check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
            check(jwk.x, '"x" (Public Key) Parameter');
            components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
            break;
        case 'RSA':
            check(jwk.e, '"e" (Exponent) Parameter');
            check(jwk.n, '"n" (Modulus) Parameter');
            components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
            break;
        case 'oct':
            check(jwk.k, '"k" (Key Value) Parameter');
            components = { k: jwk.k, kty: jwk.kty };
            break;
        default:
            throw new errors_js_1.JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = buffer_utils_js_1.encoder.encode(JSON.stringify(components));
    return base64url_js_1.encode(await digest_js_1.default(digestAlgorithm, data));
}
exports.calculateThumbprint = calculateThumbprint;
exports.default = calculateThumbprint;
