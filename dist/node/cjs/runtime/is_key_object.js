"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const util = require("util");
let impl;
if (util.types.isKeyObject) {
    impl = function isKeyObject(obj) {
        return util.types.isKeyObject(obj);
    };
}
else {
    impl = function isKeyObject(obj) {
        return obj != null && obj instanceof crypto_1.KeyObject;
    };
}
exports.default = impl;
