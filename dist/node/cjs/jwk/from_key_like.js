"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromKeyLike = void 0;
const export_js_1 = require("../key/export.js");
async function fromKeyLike(key) {
    return (0, export_js_1.exportJWK)(key);
}
exports.fromKeyLike = fromKeyLike;
exports.default = fromKeyLike;
