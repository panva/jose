"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSecretJWK = exports.isPublicJWK = exports.isPrivateJWK = exports.isJWK = void 0;
const is_object_js_1 = require("./is_object.js");
function isJWK(key) {
    return (0, is_object_js_1.default)(key) && typeof key.kty === 'string';
}
exports.isJWK = isJWK;
function isPrivateJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'string';
}
exports.isPrivateJWK = isPrivateJWK;
function isPublicJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'undefined';
}
exports.isPublicJWK = isPublicJWK;
function isSecretJWK(key) {
    return isJWK(key) && key.kty === 'oct' && typeof key.k === 'string';
}
exports.isSecretJWK = isSecretJWK;
