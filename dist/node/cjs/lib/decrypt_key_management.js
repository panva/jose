"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aeskw_js_1 = require("../runtime/aeskw.js");
const ECDH = require("../runtime/ecdhes.js");
const pbes2kw_js_1 = require("../runtime/pbes2kw.js");
const rsaes_js_1 = require("../runtime/rsaes.js");
const aesgcmkw_js_1 = require("../runtime/aesgcmkw.js");
const base64url_js_1 = require("../runtime/base64url.js");
const errors_js_1 = require("../util/errors.js");
const cek_js_1 = require("../lib/cek.js");
const import_js_1 = require("../key/import.js");
const check_key_type_js_1 = require("./check_key_type.js");
const is_object_js_1 = require("./is_object.js");
async function decryptKeyManagement(alg, key, encryptedKey, joseHeader, options) {
    check_key_type_js_1.default(alg, key, 'decrypt');
    switch (alg) {
        case 'dir': {
            if (encryptedKey !== undefined)
                throw new errors_js_1.JWEInvalid('Encountered unexpected JWE Encrypted Key');
            return key;
        }
        case 'ECDH-ES':
            if (encryptedKey !== undefined)
                throw new errors_js_1.JWEInvalid('Encountered unexpected JWE Encrypted Key');
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW': {
            if (!is_object_js_1.default(joseHeader.epk))
                throw new errors_js_1.JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
            if (!ECDH.ecdhAllowed(key))
                throw new errors_js_1.JOSENotSupported('ECDH-ES with the provided key is not allowed or not supported by your javascript runtime');
            const epk = await import_js_1.importJWK(joseHeader.epk, alg);
            let partyUInfo;
            let partyVInfo;
            if (joseHeader.apu !== undefined) {
                if (typeof joseHeader.apu !== 'string')
                    throw new errors_js_1.JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
                partyUInfo = base64url_js_1.decode(joseHeader.apu);
            }
            if (joseHeader.apv !== undefined) {
                if (typeof joseHeader.apv !== 'string')
                    throw new errors_js_1.JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
                partyVInfo = base64url_js_1.decode(joseHeader.apv);
            }
            const sharedSecret = await ECDH.deriveKey(epk, key, alg === 'ECDH-ES' ? joseHeader.enc : alg, parseInt(alg.substr(-5, 3), 10) || cek_js_1.bitLengths.get(joseHeader.enc), partyUInfo, partyVInfo);
            if (alg === 'ECDH-ES')
                return sharedSecret;
            if (encryptedKey === undefined)
                throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
            return aeskw_js_1.unwrap(alg.substr(-6), sharedSecret, encryptedKey);
        }
        case 'RSA1_5':
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512': {
            if (encryptedKey === undefined)
                throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
            return rsaes_js_1.decrypt(alg, key, encryptedKey);
        }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW': {
            if (encryptedKey === undefined)
                throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
            if (typeof joseHeader.p2c !== 'number')
                throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
            const p2cLimit = (options === null || options === void 0 ? void 0 : options.maxPBES2Count) || 10000;
            if (joseHeader.p2c > p2cLimit)
                throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
            if (typeof joseHeader.p2s !== 'string')
                throw new errors_js_1.JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
            return pbes2kw_js_1.decrypt(alg, key, encryptedKey, joseHeader.p2c, base64url_js_1.decode(joseHeader.p2s));
        }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW': {
            if (encryptedKey === undefined)
                throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
            return aeskw_js_1.unwrap(alg, key, encryptedKey);
        }
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW': {
            if (encryptedKey === undefined)
                throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
            if (typeof joseHeader.iv !== 'string')
                throw new errors_js_1.JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
            if (typeof joseHeader.tag !== 'string')
                throw new errors_js_1.JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
            const iv = base64url_js_1.decode(joseHeader.iv);
            const tag = base64url_js_1.decode(joseHeader.tag);
            return aesgcmkw_js_1.unwrap(alg, key, encryptedKey, iv, tag);
        }
        default: {
            throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
    }
}
exports.default = decryptKeyManagement;
