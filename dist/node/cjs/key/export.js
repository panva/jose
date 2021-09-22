"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportJWK = exports.exportPKCS8 = exports.exportSPKI = void 0;
const asn1_js_1 = require("../runtime/asn1.js");
const asn1_js_2 = require("../runtime/asn1.js");
const from_key_like_js_1 = require("../jwk/from_key_like.js");
async function exportSPKI(key) {
    return (0, asn1_js_1.toSPKI)(key);
}
exports.exportSPKI = exportSPKI;
async function exportPKCS8(key) {
    return (0, asn1_js_2.toPKCS8)(key);
}
exports.exportPKCS8 = exportPKCS8;
const exportJWK = (...args) => (0, from_key_like_js_1.fromKeyLike)(...args);
exports.exportJWK = exportJWK;
