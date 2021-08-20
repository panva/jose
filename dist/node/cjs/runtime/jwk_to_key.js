"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const base64url_js_1 = require("./base64url.js");
const errors_js_1 = require("../util/errors.js");
const get_named_curve_js_1 = require("./get_named_curve.js");
const check_modulus_length_js_1 = require("./check_modulus_length.js");
const asn1_sequence_encoder_js_1 = require("./asn1_sequence_encoder.js");
const [major, minor] = process.version
    .substr(1)
    .split('.')
    .map((str) => parseInt(str, 10));
const jwkImportSupported = major >= 16 || (major === 15 && minor >= 12);
const parse = (jwk) => {
    if (jwkImportSupported && jwk.kty !== 'oct') {
        return jwk.d
            ? crypto_1.createPrivateKey({ format: 'jwk', key: jwk })
            : crypto_1.createPublicKey({ format: 'jwk', key: jwk });
    }
    switch (jwk.kty) {
        case 'oct': {
            return crypto_1.createSecretKey(base64url_js_1.decode(jwk.k));
        }
        case 'RSA': {
            const enc = new asn1_sequence_encoder_js_1.default();
            const isPrivate = jwk.d !== undefined;
            const modulus = Buffer.from(jwk.n, 'base64');
            const exponent = Buffer.from(jwk.e, 'base64');
            if (isPrivate) {
                enc.zero();
                enc.unsignedInteger(modulus);
                enc.unsignedInteger(exponent);
                enc.unsignedInteger(Buffer.from(jwk.d, 'base64'));
                enc.unsignedInteger(Buffer.from(jwk.p, 'base64'));
                enc.unsignedInteger(Buffer.from(jwk.q, 'base64'));
                enc.unsignedInteger(Buffer.from(jwk.dp, 'base64'));
                enc.unsignedInteger(Buffer.from(jwk.dq, 'base64'));
                enc.unsignedInteger(Buffer.from(jwk.qi, 'base64'));
            }
            else {
                enc.unsignedInteger(modulus);
                enc.unsignedInteger(exponent);
            }
            const der = enc.end();
            const createInput = {
                key: der,
                format: 'der',
                type: 'pkcs1',
            };
            const keyObject = isPrivate ? crypto_1.createPrivateKey(createInput) : crypto_1.createPublicKey(createInput);
            check_modulus_length_js_1.setModulusLength(keyObject, modulus.length << 3);
            return keyObject;
        }
        case 'EC': {
            const enc = new asn1_sequence_encoder_js_1.default();
            const isPrivate = jwk.d !== undefined;
            const pub = Buffer.concat([
                Buffer.alloc(1, 4),
                Buffer.from(jwk.x, 'base64'),
                Buffer.from(jwk.y, 'base64'),
            ]);
            if (isPrivate) {
                enc.zero();
                const enc$1 = new asn1_sequence_encoder_js_1.default();
                enc$1.oidFor('ecPublicKey');
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                const enc$2 = new asn1_sequence_encoder_js_1.default();
                enc$2.one();
                enc$2.octStr(Buffer.from(jwk.d, 'base64'));
                const enc$3 = new asn1_sequence_encoder_js_1.default();
                enc$3.bitStr(pub);
                const f2 = enc$3.end(Buffer.from([0xa1]));
                enc$2.add(f2);
                const f = enc$2.end();
                const enc$4 = new asn1_sequence_encoder_js_1.default();
                enc$4.add(f);
                const f3 = enc$4.end(Buffer.from([0x04]));
                enc.add(f3);
                const der = enc.end();
                const keyObject = crypto_1.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
                get_named_curve_js_1.setCurve(keyObject, jwk.crv);
                return keyObject;
            }
            const enc$1 = new asn1_sequence_encoder_js_1.default();
            enc$1.oidFor('ecPublicKey');
            enc$1.oidFor(jwk.crv);
            enc.add(enc$1.end());
            enc.bitStr(pub);
            const der = enc.end();
            const keyObject = crypto_1.createPublicKey({ key: der, format: 'der', type: 'spki' });
            get_named_curve_js_1.setCurve(keyObject, jwk.crv);
            return keyObject;
        }
        case 'OKP': {
            const enc = new asn1_sequence_encoder_js_1.default();
            const isPrivate = jwk.d !== undefined;
            if (isPrivate) {
                enc.zero();
                const enc$1 = new asn1_sequence_encoder_js_1.default();
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                const enc$2 = new asn1_sequence_encoder_js_1.default();
                enc$2.octStr(Buffer.from(jwk.d, 'base64'));
                const f = enc$2.end(Buffer.from([0x04]));
                enc.add(f);
                const der = enc.end();
                return crypto_1.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
            }
            const enc$1 = new asn1_sequence_encoder_js_1.default();
            enc$1.oidFor(jwk.crv);
            enc.add(enc$1.end());
            enc.bitStr(Buffer.from(jwk.x, 'base64'));
            const der = enc.end();
            return crypto_1.createPublicKey({ key: der, format: 'der', type: 'spki' });
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "kty" (Key Type) Parameter value');
    }
};
exports.default = parse;
