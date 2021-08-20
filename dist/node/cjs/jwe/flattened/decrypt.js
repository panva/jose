"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenedDecrypt = void 0;
const errors_js_1 = require("../../util/errors.js");
const is_disjoint_js_1 = require("../../lib/is_disjoint.js");
const is_object_js_1 = require("../../lib/is_object.js");
const base64url_js_1 = require("../../runtime/base64url.js");
const decrypt_js_1 = require("../../runtime/decrypt.js");
const zlib_js_1 = require("../../runtime/zlib.js");
const decrypt_key_management_js_1 = require("../../lib/decrypt_key_management.js");
const buffer_utils_js_1 = require("../../lib/buffer_utils.js");
const cek_js_1 = require("../../lib/cek.js");
const random_js_1 = require("../../runtime/random.js");
const validate_crit_js_1 = require("../../lib/validate_crit.js");
const validate_algorithms_js_1 = require("../../lib/validate_algorithms.js");
const generateCek = cek_js_1.default(random_js_1.default);
const checkExtensions = validate_crit_js_1.default.bind(undefined, errors_js_1.JWEInvalid, new Map());
const checkAlgOption = validate_algorithms_js_1.default.bind(undefined, 'keyManagementAlgorithms');
const checkEncOption = validate_algorithms_js_1.default.bind(undefined, 'contentEncryptionAlgorithms');
async function flattenedDecrypt(jwe, key, options) {
    var _a;
    if (!is_object_js_1.default(jwe)) {
        throw new errors_js_1.JWEInvalid('Flattened JWE must be an object');
    }
    if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
        throw new errors_js_1.JWEInvalid('JOSE Header missing');
    }
    if (typeof jwe.iv !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE Initialization Vector missing or incorrect type');
    }
    if (typeof jwe.ciphertext !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE Ciphertext missing or incorrect type');
    }
    if (typeof jwe.tag !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE Authentication Tag missing or incorrect type');
    }
    if (jwe.protected !== undefined && typeof jwe.protected !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE Protected Header incorrect type');
    }
    if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE Encrypted Key incorrect type');
    }
    if (jwe.aad !== undefined && typeof jwe.aad !== 'string') {
        throw new errors_js_1.JWEInvalid('JWE AAD incorrect type');
    }
    if (jwe.header !== undefined && !is_object_js_1.default(jwe.header)) {
        throw new errors_js_1.JWEInvalid('JWE Shared Unprotected Header incorrect type');
    }
    if (jwe.unprotected !== undefined && !is_object_js_1.default(jwe.unprotected)) {
        throw new errors_js_1.JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type');
    }
    let parsedProt;
    if (jwe.protected) {
        const protectedHeader = base64url_js_1.decode(jwe.protected);
        try {
            parsedProt = JSON.parse(buffer_utils_js_1.decoder.decode(protectedHeader));
        }
        catch {
            throw new errors_js_1.JWEInvalid('JWE Protected Header is invalid');
        }
    }
    if (!is_disjoint_js_1.default(parsedProt, jwe.header, jwe.unprotected)) {
        throw new errors_js_1.JWEInvalid('JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint');
    }
    const joseHeader = {
        ...parsedProt,
        ...jwe.header,
        ...jwe.unprotected,
    };
    checkExtensions(options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
    if (joseHeader.zip !== undefined) {
        if (!parsedProt || !parsedProt.zip) {
            throw new errors_js_1.JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
        }
        if (joseHeader.zip !== 'DEF') {
            throw new errors_js_1.JOSENotSupported('unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
        }
    }
    const { alg, enc } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new errors_js_1.JWEInvalid('missing JWE Algorithm (alg) in JWE Header');
    }
    if (typeof enc !== 'string' || !enc) {
        throw new errors_js_1.JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header');
    }
    const keyManagementAlgorithms = options && checkAlgOption(options.keyManagementAlgorithms);
    const contentEncryptionAlgorithms = options && checkEncOption(options.contentEncryptionAlgorithms);
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) {
        throw new errors_js_1.JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
        throw new errors_js_1.JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter not allowed');
    }
    let encryptedKey;
    if (jwe.encrypted_key !== undefined) {
        encryptedKey = base64url_js_1.decode(jwe.encrypted_key);
    }
    if (typeof key === 'function') {
        key = await key(parsedProt, jwe);
    }
    let cek;
    try {
        cek = await decrypt_key_management_js_1.default(alg, key, encryptedKey, joseHeader);
    }
    catch (err) {
        if (err instanceof TypeError) {
            throw err;
        }
        cek = generateCek(enc);
    }
    const iv = base64url_js_1.decode(jwe.iv);
    const tag = base64url_js_1.decode(jwe.tag);
    const protectedHeader = buffer_utils_js_1.encoder.encode((_a = jwe.protected) !== null && _a !== void 0 ? _a : '');
    let additionalData;
    if (jwe.aad !== undefined) {
        additionalData = buffer_utils_js_1.concat(protectedHeader, buffer_utils_js_1.encoder.encode('.'), buffer_utils_js_1.encoder.encode(jwe.aad));
    }
    else {
        additionalData = protectedHeader;
    }
    let plaintext = await decrypt_js_1.default(enc, cek, base64url_js_1.decode(jwe.ciphertext), iv, tag, additionalData);
    if (joseHeader.zip === 'DEF') {
        plaintext = await ((options === null || options === void 0 ? void 0 : options.inflateRaw) || zlib_js_1.inflate)(plaintext);
    }
    const result = { plaintext };
    if (jwe.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jwe.aad !== undefined) {
        result.additionalAuthenticatedData = base64url_js_1.decode(jwe.aad);
    }
    if (jwe.unprotected !== undefined) {
        result.sharedUnprotectedHeader = jwe.unprotected;
    }
    if (jwe.header !== undefined) {
        result.unprotectedHeader = jwe.header;
    }
    return result;
}
exports.flattenedDecrypt = flattenedDecrypt;
exports.default = flattenedDecrypt;
