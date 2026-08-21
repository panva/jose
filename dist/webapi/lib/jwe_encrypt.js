import { encode as b64u } from '../util/base64url.js';
import { encrypt } from './content_encryption.js';
import { encryptKeyManagement } from './key_management.js';
import { JWEInvalid } from '../util/errors.js';
import { assertUint8Array, isDisjoint, isObject } from './type_checks.js';
import { concat, encode } from './buffer_utils.js';
import { serializeJoseHeader, validateCrit, validateCritDuplicates, JWE_RECOGNIZED, } from './options.js';
import { prepareKey } from './key.js';
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js';
import { compress, validateZip } from './deflate.js';
import { unprotected } from './helpers.js';
export function checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader) {
    if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) {
        throw new JWEInvalid('JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint');
    }
}
export function checkEncryptHeaders(input) {
    let [, protectedHeader, unprotectedHeader, sharedUnprotectedHeader, aad, cek, iv, keyManagementParameters, crit,] = input;
    if (aad !== undefined) {
        assertUint8Array(aad, 'JWE Additional Authenticated Data');
    }
    if (cek !== undefined) {
        assertUint8Array(cek, 'JWE Content Encryption Key');
    }
    if (iv !== undefined) {
        assertUint8Array(iv, 'JWE Initialization Vector');
    }
    if (protectedHeader !== undefined) {
        protectedHeader = serializeJoseHeader(JWEInvalid, protectedHeader)[0];
        input[1] = protectedHeader;
    }
    if (unprotectedHeader !== undefined) {
        unprotectedHeader = serializeJoseHeader(JWEInvalid, unprotectedHeader)[0];
        input[2] = unprotectedHeader;
    }
    if (sharedUnprotectedHeader !== undefined) {
        sharedUnprotectedHeader = serializeJoseHeader(JWEInvalid, sharedUnprotectedHeader)[0];
        input[3] = sharedUnprotectedHeader;
    }
    if (keyManagementParameters !== undefined && !isObject(keyManagementParameters)) {
        throw new TypeError('JWE Key Management Parameters must be an object');
    }
    checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
    const joseHeader = {
        ...protectedHeader,
        ...unprotectedHeader,
        ...sharedUnprotectedHeader,
    };
    validateCritDuplicates(JWEInvalid, protectedHeader);
    validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, protectedHeader, joseHeader);
    validateZip(joseHeader, protectedHeader);
    const { alg, enc } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
    }
    if (typeof enc !== 'string' || !enc) {
        throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
    }
    return [joseHeader, alg, enc, jweEncryption(enc)];
}
export async function encryptJWE(input, checked, key) {
    const [joseHeader, alg, , encEntry] = checked;
    const [inputPlaintext, inputProtectedHeader, inputUnprotectedHeader, sharedUnprotectedHeader, aad, providedCek, inputIv, keyManagementParameters, , unprotectedParameters,] = input;
    let protectedHeader = inputProtectedHeader;
    let unprotectedHeader = inputUnprotectedHeader;
    if (providedCek && (alg === 'dir' || alg === 'ECDH-ES')) {
        throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
    }
    const algEntry = jweAlgorithm(alg);
    const k = await prepareKey(alg === 'dir' ? encEntry : algEntry, key, 'encrypt');
    const [cek, encryptedKey, parameters] = await encryptKeyManagement(alg, encEntry, k, providedCek, keyManagementParameters);
    if (parameters) {
        if (unprotectedParameters) {
            unprotectedHeader = unprotectedHeader ? { ...unprotectedHeader, ...parameters } : parameters;
        }
        else {
            protectedHeader = protectedHeader ? { ...protectedHeader, ...parameters } : parameters;
        }
        checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
    }
    let protectedHeaderS;
    let protectedHeaderB;
    if (protectedHeader) {
        protectedHeaderS = b64u(JSON.stringify(protectedHeader));
        protectedHeaderB = encode(protectedHeaderS);
    }
    else {
        protectedHeaderS = '';
        protectedHeaderB = new Uint8Array();
    }
    let additionalData;
    let aadMember;
    if (aad?.byteLength) {
        aadMember = b64u(aad);
        additionalData = concat(protectedHeaderB, encode('.'), encode(aadMember));
    }
    else {
        additionalData = protectedHeaderB;
    }
    let plaintext = inputPlaintext;
    if (joseHeader.zip === 'DEF') {
        plaintext = await compress(plaintext).catch((cause) => {
            throw new JWEInvalid('Failed to compress plaintext', { cause });
        });
    }
    const { ciphertext, tag, iv } = await encrypt(encEntry, plaintext, cek, inputIv, additionalData);
    const jwe = {
        ciphertext: b64u(ciphertext),
    };
    if (iv) {
        jwe.iv = b64u(iv);
    }
    if (tag) {
        jwe.tag = b64u(tag);
    }
    if (encryptedKey) {
        jwe.encrypted_key = b64u(encryptedKey);
    }
    if (aadMember) {
        jwe.aad = aadMember;
    }
    if (protectedHeader) {
        jwe.protected = protectedHeaderS;
    }
    if (sharedUnprotectedHeader) {
        jwe.unprotected = sharedUnprotectedHeader;
    }
    if (unprotectedHeader) {
        jwe.header = unprotectedHeader;
    }
    return jwe;
}
export async function createJWE(input, key, options) {
    if (!input[1] && !input[2] && !input[3]) {
        throw new JWEInvalid('either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()');
    }
    if (options !== undefined) {
        input[8] = options?.crit;
        input[9] = options ? unprotected in options : false;
    }
    return encryptJWE(input, checkEncryptHeaders(input), key);
}
