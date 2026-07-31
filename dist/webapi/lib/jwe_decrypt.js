import { decrypt, generateCek } from './content_encryption.js';
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js';
import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from '../util/errors.js';
import { isDisjoint, isObject } from './type_checks.js';
import { decryptKeyManagement } from './key_management.js';
import { concat, decoder, encode } from './buffer_utils.js';
import { validateCrit, validateAlgorithms, JWE_RECOGNIZED } from './options.js';
import { prepareKey } from './key.js';
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js';
import { decompress } from './deflate.js';
export function checkShared(jwe) {
    if (jwe.iv !== undefined && typeof jwe.iv !== 'string') {
        throw new JWEInvalid('JWE Initialization Vector incorrect type');
    }
    if (typeof jwe.ciphertext !== 'string') {
        throw new JWEInvalid('JWE Ciphertext missing or incorrect type');
    }
    if (jwe.tag !== undefined && typeof jwe.tag !== 'string') {
        throw new JWEInvalid('JWE Authentication Tag incorrect type');
    }
    if (jwe.protected !== undefined && typeof jwe.protected !== 'string') {
        throw new JWEInvalid('JWE Protected Header incorrect type');
    }
    if (jwe.aad !== undefined && typeof jwe.aad !== 'string') {
        throw new JWEInvalid('JWE AAD incorrect type');
    }
    if (jwe.unprotected !== undefined && !isObject(jwe.unprotected)) {
        throw new JWEInvalid('JWE Shared Unprotected Header incorrect type');
    }
}
export function checkRecipient(jwe) {
    if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== 'string') {
        throw new JWEInvalid('JWE Encrypted Key incorrect type');
    }
    if (jwe.header !== undefined && !isObject(jwe.header)) {
        throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type');
    }
    if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
        throw new JWEInvalid('JOSE Header missing');
    }
}
export function shareJWE(jwe) {
    let parsedProt;
    if (jwe.protected) {
        parsedProt = parseJoseHeader(jwe.protected, JWEInvalid, 'JWE Protected Header is invalid');
    }
    const protectedHeader = jwe.protected !== undefined ? encode(jwe.protected) : new Uint8Array();
    return {
        parsedProt,
        ciphertext: decodeBase64url(jwe.ciphertext, 'ciphertext', JWEInvalid),
        iv: jwe.iv !== undefined ? decodeBase64url(jwe.iv, 'iv', JWEInvalid) : undefined,
        tag: jwe.tag !== undefined ? decodeBase64url(jwe.tag, 'tag', JWEInvalid) : undefined,
        additionalData: jwe.aad !== undefined
            ? concat(protectedHeader, encode('.'), encodeBase64url(jwe.aad, 'aad', JWEInvalid))
            : protectedHeader,
    };
}
export function decryptResult(jwe, decrypted) {
    const result = { plaintext: decrypted.plaintext };
    if (jwe.protected !== undefined) {
        result.protectedHeader = decrypted.parsedProt;
    }
    if (jwe.aad !== undefined) {
        result.additionalAuthenticatedData = decodeBase64url(jwe.aad, 'aad', JWEInvalid);
    }
    if (jwe.unprotected !== undefined) {
        result.sharedUnprotectedHeader = jwe.unprotected;
    }
    if (jwe.header !== undefined) {
        result.unprotectedHeader = jwe.header;
    }
    if (decrypted.resolvedKey) {
        return { ...result, key: decrypted.key };
    }
    return result;
}
export function prepareDecrypt(options) {
    return {
        keyManagementAlgorithms: options && validateAlgorithms('keyManagementAlgorithms', options.keyManagementAlgorithms),
        contentEncryptionAlgorithms: options &&
            validateAlgorithms('contentEncryptionAlgorithms', options.contentEncryptionAlgorithms),
        options,
    };
}
export async function decryptRecipient(jwe, token, shared, key) {
    const { options } = shared;
    const { parsedProt } = token;
    let joseHeader;
    if (jwe.header !== undefined || jwe.unprotected !== undefined) {
        if (!isDisjoint(parsedProt, jwe.header, jwe.unprotected)) {
            throw new JWEInvalid('JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint');
        }
        joseHeader = { ...parsedProt, ...jwe.header, ...jwe.unprotected };
    }
    else {
        joseHeader = parsedProt ?? {};
    }
    validateCrit(JWEInvalid, JWE_RECOGNIZED, options?.crit, parsedProt, joseHeader);
    if (joseHeader.zip !== undefined && joseHeader.zip !== 'DEF') {
        throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
    }
    if (joseHeader.zip !== undefined && !parsedProt?.zip) {
        throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
    }
    const { alg, enc } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header');
    }
    if (typeof enc !== 'string' || !enc) {
        throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header');
    }
    const { keyManagementAlgorithms, contentEncryptionAlgorithms } = shared;
    if ((keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) ||
        (!keyManagementAlgorithms && alg.startsWith('PBES2'))) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
        throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
    }
    const encEntry = jweEncryption(enc);
    let encryptedKey;
    if (jwe.encrypted_key !== undefined) {
        encryptedKey = decodeBase64url(jwe.encrypted_key, 'encrypted_key', JWEInvalid);
    }
    let resolvedKey = false;
    if (typeof key === 'function') {
        key = await key(parsedProt, jwe);
        resolvedKey = true;
    }
    const algEntry = jweAlgorithm(alg);
    const k = await prepareKey(alg === 'dir' ? encEntry : algEntry, key, 'decrypt');
    let cek;
    try {
        cek = await decryptKeyManagement(alg, encEntry, k, encryptedKey, joseHeader, options);
    }
    catch (err) {
        if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
            throw err;
        }
        cek = generateCek(encEntry);
    }
    let plaintext = await decrypt(encEntry, cek, token.ciphertext, token.iv, token.tag, token.additionalData);
    if (joseHeader.zip === 'DEF') {
        const maxDecompressedLength = options?.maxDecompressedLength ?? 250_000;
        if (maxDecompressedLength === 0) {
            throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
        }
        if (maxDecompressedLength !== Infinity &&
            (!Number.isSafeInteger(maxDecompressedLength) || maxDecompressedLength < 1)) {
            throw new TypeError('maxDecompressedLength must be 0, a positive safe integer, or Infinity');
        }
        plaintext = await decompress(plaintext, maxDecompressedLength).catch((cause) => {
            if (cause instanceof JWEInvalid)
                throw cause;
            throw new JWEInvalid('Failed to decompress plaintext', { cause });
        });
    }
    return { plaintext, parsedProt, key: k, resolvedKey };
}
export async function decryptJWE(jwe, shared, key) {
    return decryptRecipient(jwe, shareJWE(jwe), shared, key);
}
export async function decryptCompact(jwe, shared, key) {
    if (jwe instanceof Uint8Array) {
        jwe = decoder.decode(jwe);
    }
    if (typeof jwe !== 'string') {
        throw new JWEInvalid('Compact JWE must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: encryptedKey, 2: iv, 3: ciphertext, 4: tag, length, } = jwe.split('.');
    if (length !== 5) {
        throw new JWEInvalid('Invalid Compact JWE');
    }
    return decryptJWE({
        ciphertext,
        iv: iv || undefined,
        protected: protectedHeader,
        tag: tag || undefined,
        encrypted_key: encryptedKey || undefined,
    }, shared, key);
}
