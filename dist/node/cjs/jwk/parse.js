"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwk = void 0;
const base64url_js_1 = require("../runtime/base64url.js");
const jwk_to_key_js_1 = require("../runtime/jwk_to_key.js");
const errors_js_1 = require("../util/errors.js");
const is_object_js_1 = require("../lib/is_object.js");
async function parseJwk(jwk, alg, octAsKeyObject) {
    if (!is_object_js_1.default(jwk)) {
        throw new TypeError('JWK must be an object');
    }
    alg || (alg = jwk.alg);
    if (typeof alg !== 'string' || !alg) {
        throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    }
    switch (jwk.kty) {
        case 'oct':
            if (typeof jwk.k !== 'string' || !jwk.k) {
                throw new TypeError('missing "k" (Key Value) Parameter value');
            }
            octAsKeyObject !== null && octAsKeyObject !== void 0 ? octAsKeyObject : (octAsKeyObject = jwk.ext !== true);
            if (octAsKeyObject) {
                return jwk_to_key_js_1.default({ ...jwk, alg, ext: false });
            }
            return base64url_js_1.decode(jwk.k);
        case 'RSA':
            if (jwk.oth !== undefined) {
                throw new errors_js_1.JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            }
        case 'EC':
        case 'OKP':
            return jwk_to_key_js_1.default({ ...jwk, alg });
        default:
            throw new errors_js_1.JOSENotSupported('unsupported "kty" (Key Type) Parameter value');
    }
}
exports.parseJwk = parseJwk;
exports.default = parseJwk;
