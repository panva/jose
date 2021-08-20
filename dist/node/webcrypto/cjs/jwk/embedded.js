"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddedJWK = void 0;
const parse_js_1 = require("./parse.js");
const is_object_js_1 = require("../lib/is_object.js");
const errors_js_1 = require("../util/errors.js");
async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token.header,
    };
    if (!is_object_js_1.default(joseHeader.jwk)) {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = await parse_js_1.default(joseHeader.jwk, joseHeader.alg, true);
    if (key.type !== 'public') {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
exports.EmbeddedJWK = EmbeddedJWK;
exports.default = EmbeddedJWK;
