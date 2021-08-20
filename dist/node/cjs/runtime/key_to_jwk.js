"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const base64url_js_1 = require("./base64url.js");
const asn1_sequence_decoder_js_1 = require("./asn1_sequence_decoder.js");
const errors_js_1 = require("../util/errors.js");
const get_named_curve_js_1 = require("./get_named_curve.js");
const webcrypto_js_1 = require("./webcrypto.js");
const is_key_object_js_1 = require("./is_key_object.js");
const invalid_key_input_js_1 = require("./invalid_key_input.js");
const [major, minor] = process.version
    .substr(1)
    .split('.')
    .map((str) => parseInt(str, 10));
const jwkExportSupported = major >= 16 || (major === 15 && minor >= 9);
const keyToJWK = (key) => {
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
    else if (key instanceof Uint8Array) {
        return {
            kty: 'oct',
            k: base64url_js_1.encode(key),
        };
    }
    else {
        throw new TypeError(invalid_key_input_js_1.default(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
    }
    if (jwkExportSupported) {
        return keyObject.export({ format: 'jwk' });
    }
    switch (keyObject.type) {
        case 'secret':
            return {
                kty: 'oct',
                k: base64url_js_1.encode(keyObject.export()),
            };
        case 'private':
        case 'public': {
            switch (keyObject.asymmetricKeyType) {
                case 'rsa': {
                    const der = keyObject.export({ format: 'der', type: 'pkcs1' });
                    const dec = new asn1_sequence_decoder_js_1.default(der);
                    if (keyObject.type === 'private') {
                        dec.unsignedInteger();
                    }
                    const n = base64url_js_1.encode(dec.unsignedInteger());
                    const e = base64url_js_1.encode(dec.unsignedInteger());
                    let jwk;
                    if (keyObject.type === 'private') {
                        jwk = {
                            d: base64url_js_1.encode(dec.unsignedInteger()),
                            p: base64url_js_1.encode(dec.unsignedInteger()),
                            q: base64url_js_1.encode(dec.unsignedInteger()),
                            dp: base64url_js_1.encode(dec.unsignedInteger()),
                            dq: base64url_js_1.encode(dec.unsignedInteger()),
                            qi: base64url_js_1.encode(dec.unsignedInteger()),
                        };
                    }
                    dec.end();
                    return { kty: 'RSA', n, e, ...jwk };
                }
                case 'ec': {
                    const crv = get_named_curve_js_1.default(keyObject);
                    let len;
                    let offset;
                    let correction;
                    switch (crv) {
                        case 'secp256k1':
                            len = 64;
                            offset = 31 + 2;
                            correction = -1;
                            break;
                        case 'P-256':
                            len = 64;
                            offset = 34 + 2;
                            correction = -1;
                            break;
                        case 'P-384':
                            len = 96;
                            offset = 33 + 2;
                            correction = -3;
                            break;
                        case 'P-521':
                            len = 132;
                            offset = 33 + 2;
                            correction = -3;
                            break;
                        default:
                            throw new errors_js_1.JOSENotSupported('unsupported curve');
                    }
                    if (keyObject.type === 'public') {
                        const der = keyObject.export({ type: 'spki', format: 'der' });
                        return {
                            kty: 'EC',
                            crv,
                            x: base64url_js_1.encode(der.subarray(-len, -len / 2)),
                            y: base64url_js_1.encode(der.subarray(-len / 2)),
                        };
                    }
                    const der = keyObject.export({ type: 'pkcs8', format: 'der' });
                    if (der.length < 100) {
                        offset += correction;
                    }
                    return {
                        ...keyToJWK(crypto_1.createPublicKey(keyObject)),
                        d: base64url_js_1.encode(der.subarray(offset, offset + len / 2)),
                    };
                }
                case 'ed25519':
                case 'x25519': {
                    const crv = get_named_curve_js_1.default(keyObject);
                    if (keyObject.type === 'public') {
                        const der = keyObject.export({ type: 'spki', format: 'der' });
                        return {
                            kty: 'OKP',
                            crv,
                            x: base64url_js_1.encode(der.subarray(-32)),
                        };
                    }
                    const der = keyObject.export({ type: 'pkcs8', format: 'der' });
                    return {
                        ...keyToJWK(crypto_1.createPublicKey(keyObject)),
                        d: base64url_js_1.encode(der.subarray(-32)),
                    };
                }
                case 'ed448':
                case 'x448': {
                    const crv = get_named_curve_js_1.default(keyObject);
                    if (keyObject.type === 'public') {
                        const der = keyObject.export({ type: 'spki', format: 'der' });
                        return {
                            kty: 'OKP',
                            crv,
                            x: base64url_js_1.encode(der.subarray(crv === 'Ed448' ? -57 : -56)),
                        };
                    }
                    const der = keyObject.export({ type: 'pkcs8', format: 'der' });
                    return {
                        ...keyToJWK(crypto_1.createPublicKey(keyObject)),
                        d: base64url_js_1.encode(der.subarray(crv === 'Ed448' ? -57 : -56)),
                    };
                }
                default:
                    throw new errors_js_1.JOSENotSupported('unsupported key asymmetricKeyType');
            }
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported key type');
    }
};
exports.default = keyToJWK;
