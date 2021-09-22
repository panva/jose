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
const parse_js_1 = require("../jwk/parse.js");
const check_key_type_js_1 = require("./check_key_type.js");
function assertEnryptedKey(encryptedKey) {
    if (!encryptedKey) {
        throw new errors_js_1.JWEInvalid('JWE Encrypted Key missing');
    }
}
function assertHeaderParameter(joseHeader, parameter, name) {
    if (joseHeader[parameter] === undefined) {
        throw new errors_js_1.JWEInvalid(`JOSE Header ${name} (${parameter}) missing`);
    }
}
async function decryptKeyManagement(alg, key, encryptedKey, joseHeader) {
    (0, check_key_type_js_1.default)(alg, key, 'decrypt');
    switch (alg) {
        case 'dir': {
            if (encryptedKey !== undefined) {
                throw new errors_js_1.JWEInvalid('Encountered unexpected JWE Encrypted Key');
            }
            return key;
        }
        case 'ECDH-ES':
            if (encryptedKey !== undefined) {
                throw new errors_js_1.JWEInvalid('Encountered unexpected JWE Encrypted Key');
            }
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW': {
            assertHeaderParameter(joseHeader, 'epk', 'Ephemeral Public Key');
            if (!ECDH.ecdhAllowed(key)) {
                throw new errors_js_1.JOSENotSupported('ECDH-ES with the provided key is not allowed or not supported by your javascript runtime');
            }
            const epk = await (0, parse_js_1.parseJwk)(joseHeader.epk, alg);
            let partyUInfo;
            let partyVInfo;
            if (joseHeader.apu !== undefined)
                partyUInfo = (0, base64url_js_1.decode)(joseHeader.apu);
            if (joseHeader.apv !== undefined)
                partyVInfo = (0, base64url_js_1.decode)(joseHeader.apv);
            const sharedSecret = await ECDH.deriveKey(epk, key, alg === 'ECDH-ES' ? joseHeader.enc : alg, parseInt(alg.substr(-5, 3), 10) || cek_js_1.bitLengths.get(joseHeader.enc), partyUInfo, partyVInfo);
            if (alg === 'ECDH-ES') {
                return sharedSecret;
            }
            assertEnryptedKey(encryptedKey);
            const kwAlg = alg.substr(-6);
            return (0, aeskw_js_1.unwrap)(kwAlg, sharedSecret, encryptedKey);
        }
        case 'RSA1_5':
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512': {
            assertEnryptedKey(encryptedKey);
            return (0, rsaes_js_1.decrypt)(alg, key, encryptedKey);
        }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW': {
            assertEnryptedKey(encryptedKey);
            assertHeaderParameter(joseHeader, 'p2c', 'PBES2 Count');
            assertHeaderParameter(joseHeader, 'p2s', 'PBES2 Salt');
            const { p2c } = joseHeader;
            const p2s = (0, base64url_js_1.decode)(joseHeader.p2s);
            return (0, pbes2kw_js_1.decrypt)(alg, key, encryptedKey, p2c, p2s);
        }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW': {
            assertEnryptedKey(encryptedKey);
            return (0, aeskw_js_1.unwrap)(alg, key, encryptedKey);
        }
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW': {
            assertEnryptedKey(encryptedKey);
            assertHeaderParameter(joseHeader, 'iv', 'Initialization Vector');
            assertHeaderParameter(joseHeader, 'tag', 'Authentication Tag');
            const iv = (0, base64url_js_1.decode)(joseHeader.iv);
            const tag = (0, base64url_js_1.decode)(joseHeader.tag);
            return (0, aesgcmkw_js_1.unwrap)(alg, key, encryptedKey, iv, tag);
        }
        default: {
            throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
    }
}
exports.default = decryptKeyManagement;
