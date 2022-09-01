"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const util_1 = require("util");
const crypto_1 = require("crypto");
const random_js_1 = require("./random.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const base64url_js_1 = require("./base64url.js");
const aeskw_js_1 = require("./aeskw.js");
const check_p2s_js_1 = require("../lib/check_p2s.js");
const webcrypto_js_1 = require("./webcrypto.js");
const is_key_object_js_1 = require("./is_key_object.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const pbkdf2 = util_1.promisify(crypto_1.pbkdf2);
function getPassword(key, alg) {
    if (is_key_object_js_1.default(key)) {
        return key.export();
    }
    if (key instanceof Uint8Array) {
        return key;
    }
    if (webcrypto_js_1.isCryptoKey(key)) {
        return webcrypto_js_1.getKeyObject(key, alg, new Set(['deriveBits', 'deriveKey'])).export();
    }
    throw new TypeError(invalid_key_input_js_1.default(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
}
const encrypt = async (alg, key, cek, p2c = Math.floor(Math.random() * 2049) + 2048, p2s = random_js_1.default(new Uint8Array(16))) => {
    check_p2s_js_1.default(p2s);
    const salt = buffer_utils_js_1.p2s(alg, p2s);
    const keylen = parseInt(alg.substr(13, 3), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.substr(8, 3)}`);
    const encryptedKey = await aeskw_js_1.wrap(alg.substr(-6), derivedKey, cek);
    return { encryptedKey, p2c, p2s: base64url_js_1.encode(p2s) };
};
exports.encrypt = encrypt;
const decrypt = async (alg, key, encryptedKey, p2c, p2s) => {
    check_p2s_js_1.default(p2s);
    const salt = buffer_utils_js_1.p2s(alg, p2s);
    const keylen = parseInt(alg.substr(13, 3), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.substr(8, 3)}`);
    return aeskw_js_1.unwrap(alg.substr(-6), derivedKey, encryptedKey);
};
exports.decrypt = decrypt;
