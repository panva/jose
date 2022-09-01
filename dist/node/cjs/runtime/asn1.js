"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSPKI = exports.fromPKCS8 = exports.toPKCS8 = exports.toSPKI = void 0;
const crypto_1 = require("crypto");
const webcrypto_js_1 = require("./webcrypto.js");
const is_key_object_js_1 = require("./is_key_object.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const genericExport = (keyType, keyFormat, key) => {
    let keyObject;
    if (webcrypto_js_1.isCryptoKey(key)) {
        if (!key.extractable) {
            throw new TypeError('CryptoKey is not extractable');
        }
        keyObject = webcrypto_js_1.getKeyObject(key);
    }
    else if (is_key_object_js_1.default(key)) {
        keyObject = key;
    }
    else {
        throw new TypeError(invalid_key_input_js_1.default(key, 'KeyObject', 'CryptoKey'));
    }
    if (keyObject.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({ format: 'pem', type: keyFormat });
};
const toSPKI = (key) => {
    return genericExport('public', 'spki', key);
};
exports.toSPKI = toSPKI;
const toPKCS8 = (key) => {
    return genericExport('private', 'pkcs8', key);
};
exports.toPKCS8 = toPKCS8;
const fromPKCS8 = (pem) => crypto_1.createPrivateKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''), 'base64'),
    type: 'pkcs8',
    format: 'der',
});
exports.fromPKCS8 = fromPKCS8;
const fromSPKI = (pem) => crypto_1.createPublicKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''), 'base64'),
    type: 'spki',
    format: 'der',
});
exports.fromSPKI = fromSPKI;
