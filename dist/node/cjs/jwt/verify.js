"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = void 0;
const verify_js_1 = require("../jws/compact/verify.js");
const jwt_claims_set_js_1 = require("../lib/jwt_claims_set.js");
const errors_js_1 = require("../util/errors.js");
async function jwtVerify(jwt, key, options) {
    var _a;
    const verified = await verify_js_1.default(jwt, key, options);
    if (((_a = verified.protectedHeader.crit) === null || _a === void 0 ? void 0 : _a.includes('b64')) && verified.protectedHeader.b64 === false) {
        throw new errors_js_1.JWTInvalid('JWTs MUST NOT use unencoded payload');
    }
    const payload = jwt_claims_set_js_1.default(verified.protectedHeader, verified.payload, options);
    return { payload, protectedHeader: verified.protectedHeader };
}
exports.jwtVerify = jwtVerify;
exports.default = jwtVerify;
