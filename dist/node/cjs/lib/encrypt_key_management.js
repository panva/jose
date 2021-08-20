"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cek_js_1 = require("../lib/cek.js");
const errors_js_1 = require("../util/errors.js");
const random_js_1 = require("../runtime/random.js");
const aeskw_js_1 = require("../runtime/aeskw.js");
const ECDH = require("../runtime/ecdhes.js");
const pbes2kw_js_1 = require("../runtime/pbes2kw.js");
const rsaes_js_1 = require("../runtime/rsaes.js");
const aesgcmkw_js_1 = require("../runtime/aesgcmkw.js");
const base64url_js_1 = require("../runtime/base64url.js");
const from_key_like_js_1 = require("../jwk/from_key_like.js");
const check_key_type_js_1 = require("./check_key_type.js");
const generateCek = cek_js_1.default(random_js_1.default);
async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    check_key_type_js_1.default(alg, key, 'encrypt');
    switch (alg) {
        case 'dir': {
            cek = key;
            break;
        }
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW': {
            if (!ECDH.ecdhAllowed(key)) {
                throw new errors_js_1.JOSENotSupported('ECDH-ES with the provided key is not allowed or not supported by your javascript runtime');
            }
            const { apu, apv } = providedParameters;
            let { epk: ephemeralKey } = providedParameters;
            ephemeralKey || (ephemeralKey = await ECDH.generateEpk(key));
            const { x, y, crv, kty } = await from_key_like_js_1.fromKeyLike(ephemeralKey);
            const sharedSecret = await ECDH.deriveKey(key, ephemeralKey, alg === 'ECDH-ES' ? enc : alg, parseInt(alg.substr(-5, 3), 10) || cek_js_1.bitLengths.get(enc), apu, apv);
            parameters = { epk: { x, y, crv, kty } };
            if (apu)
                parameters.apu = base64url_js_1.encode(apu);
            if (apv)
                parameters.apv = base64url_js_1.encode(apv);
            if (alg === 'ECDH-ES') {
                cek = sharedSecret;
                break;
            }
            cek = providedCek || generateCek(enc);
            const kwAlg = alg.substr(-6);
            encryptedKey = await aeskw_js_1.wrap(kwAlg, sharedSecret, cek);
            break;
        }
        case 'RSA1_5':
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512': {
            cek = providedCek || generateCek(enc);
            encryptedKey = await rsaes_js_1.encrypt(alg, key, cek);
            break;
        }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW': {
            cek = providedCek || generateCek(enc);
            const { p2c, p2s } = providedParameters;
            ({ encryptedKey, ...parameters } = await pbes2kw_js_1.encrypt(alg, key, cek, p2c, p2s));
            break;
        }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW': {
            cek = providedCek || generateCek(enc);
            encryptedKey = await aeskw_js_1.wrap(alg, key, cek);
            break;
        }
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW': {
            cek = providedCek || generateCek(enc);
            const { iv } = providedParameters;
            ({ encryptedKey, ...parameters } = await aesgcmkw_js_1.wrap(alg, key, cek, iv));
            break;
        }
        default: {
            throw new errors_js_1.JOSENotSupported('unsupported or invalid "alg" (JWE Algorithm) header value');
        }
    }
    return { cek, encryptedKey, parameters };
}
exports.default = encryptKeyManagement;
