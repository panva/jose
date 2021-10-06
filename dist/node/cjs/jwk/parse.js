"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwk = void 0;
const import_js_1 = require("../key/import.js");
async function parseJwk(jwk, alg, octAsKeyObject) {
    return (0, import_js_1.importJWK)(jwk, alg, octAsKeyObject);
}
exports.parseJwk = parseJwk;
exports.default = parseJwk;
