"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function getSecretKey(key) {
    let keyObject;
    if (key instanceof Uint8Array) {
        keyObject = crypto_1.createSecretKey(key);
    }
    else {
        keyObject = key;
    }
    return keyObject;
}
exports.default = getSecretKey;
