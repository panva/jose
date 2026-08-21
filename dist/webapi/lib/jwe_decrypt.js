import { decrypt, generateCek } from './content_encryption.js';
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js';
import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from '../util/errors.js';
import { isDisjoint, isObject } from './type_checks.js';
import { decryptKeyManagement } from './key_management.js';
import { concat, decoder, encode } from './buffer_utils.js';
import { validateCrit, validateAlgorithms, JWE_RECOGNIZED } from './options.js';
import { prepareKey } from './key.js';
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js';
import { decompress, validateZip } from './deflate.js';
export function snapshotSharedJWE(jwe) {
    const { aad, ciphertext, iv, protected: encodedProtected, tag, unprotected } = jwe;
    if (iv !== undefined && typeof iv !== 'string') {
        throw new JWEInvalid('JWE Initialization Vector incorrect type');
    }
    if (typeof ciphertext !== 'string') {
        throw new JWEInvalid('JWE Ciphertext missing or incorrect type');
    }
    if (tag !== undefined && typeof tag !== 'string') {
        throw new JWEInvalid('JWE Authentication Tag incorrect type');
    }
    if (encodedProtected !== undefined && typeof encodedProtected !== 'string') {
        throw new JWEInvalid('JWE Protected Header incorrect type');
    }
    if (aad !== undefined && (typeof aad !== 'string' || !aad)) {
        throw new JWEInvalid('JWE AAD incorrect type');
    }
    if (unprotected !== undefined && !isObject(unprotected)) {
        throw new JWEInvalid('JWE Shared Unprotected Header incorrect type');
    }
    return {
        aad,
        ciphertext,
        iv,
        protected: encodedProtected,
        tag,
        unprotected: unprotected === undefined ? undefined : { ...unprotected },
    };
}
export function snapshotRecipientJWE(recipient) {
    let header;
    let headerAlg;
    try {
        const { header: inputHeader } = recipient;
        if (isObject(inputHeader)) {
            headerAlg = inputHeader.alg;
            const parameters = Object.keys(inputHeader);
            if (!parameters.includes('alg'))
                headerAlg = undefined;
            header = Object.fromEntries(parameters.map((parameter) => [
                parameter,
                parameter === 'alg' ? headerAlg : inputHeader[parameter],
            ]));
        }
        else {
            header = inputHeader;
        }
    }
    catch (error) {
        return [undefined, headerAlg, error];
    }
    try {
        const { encrypted_key: encryptedKey } = recipient;
        return [{ encrypted_key: encryptedKey, header }, headerAlg];
    }
    catch (error) {
        return [undefined, headerAlg, error];
    }
}
export function checkRecipient(jwe) {
    const { encrypted_key: encryptedKey, header } = jwe;
    if (encryptedKey !== undefined && typeof encryptedKey !== 'string') {
        throw new JWEInvalid('JWE Encrypted Key incorrect type');
    }
    if (header !== undefined) {
        if (!isObject(header)) {
            throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type');
        }
    }
    if (jwe.protected === undefined && header === undefined && jwe.unprotected === undefined) {
        throw new JWEInvalid('JOSE Header missing');
    }
}
export function shareJWE(jwe) {
    const { protected: encodedProtected, ciphertext, iv, tag, aad } = jwe;
    let parsedProt;
    if (encodedProtected !== undefined) {
        parsedProt = parseJoseHeader(encodedProtected, JWEInvalid, 'JWE Protected Header is invalid');
    }
    const protectedHeader = encodedProtected !== undefined ? encode(encodedProtected) : new Uint8Array();
    return [
        parsedProt,
        decodeBase64url(ciphertext, 'ciphertext', JWEInvalid),
        iv !== undefined ? decodeBase64url(iv, 'iv', JWEInvalid) : undefined,
        tag !== undefined ? decodeBase64url(tag, 'tag', JWEInvalid) : undefined,
        aad !== undefined
            ? concat(protectedHeader, encode('.'), encodeBase64url(aad, 'aad', JWEInvalid))
            : protectedHeader,
    ];
}
export function decryptResult(jwe, decrypted) {
    const [plaintext, parsedProt, key, resolvedKey] = decrypted;
    const { protected: encodedProtected, aad, unprotected, header } = jwe;
    const result = { plaintext };
    if (encodedProtected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (aad !== undefined) {
        result.additionalAuthenticatedData = decodeBase64url(aad, 'aad', JWEInvalid);
    }
    if (unprotected !== undefined) {
        result.sharedUnprotectedHeader = unprotected;
    }
    if (header !== undefined) {
        result.unprotectedHeader = header;
    }
    if (resolvedKey) {
        return { ...result, key };
    }
    return result;
}
export function prepareDecrypt(options) {
    return [
        options && validateAlgorithms('keyManagementAlgorithms', options.keyManagementAlgorithms),
        options &&
            validateAlgorithms('contentEncryptionAlgorithms', options.contentEncryptionAlgorithms),
        options?.crit,
        options?.maxPBES2Count,
        options?.maxDecompressedLength,
    ];
}
export async function decryptRecipient(jwe, token, shared, key) {
    const [parsedProt] = token;
    const { header, unprotected } = jwe;
    let joseHeader;
    if (header !== undefined || unprotected !== undefined) {
        if (!isDisjoint(parsedProt, header, unprotected)) {
            throw new JWEInvalid('JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint');
        }
        joseHeader = { ...parsedProt, ...header, ...unprotected };
    }
    else {
        joseHeader = parsedProt ?? {};
    }
    return decryptRecipientCore(jwe, token, shared, key, joseHeader);
}
async function decryptRecipientCore(jwe, token, shared, key, joseHeader) {
    const [keyManagementAlgorithms, contentEncryptionAlgorithms, crit, maxPBES2Count, maxDecompressedLength,] = shared;
    const [parsedProt, ciphertext, iv, tag, additionalData] = token;
    const { encrypted_key: encodedKey } = jwe;
    validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, parsedProt, joseHeader);
    validateZip(joseHeader, parsedProt);
    const { alg, enc } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header');
    }
    if (typeof enc !== 'string' || !enc) {
        throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header');
    }
    if ((keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) ||
        (!keyManagementAlgorithms && alg.startsWith('PBES2'))) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
        throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
    }
    const encEntry = jweEncryption(enc);
    let encryptedKey;
    if (encodedKey !== undefined) {
        encryptedKey = decodeBase64url(encodedKey, 'encrypted_key', JWEInvalid);
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
        cek = await decryptKeyManagement(alg, encEntry, k, encryptedKey, joseHeader, maxPBES2Count);
        if (encodedKey !== undefined &&
            cek instanceof Uint8Array &&
            cek.byteLength << 3 !== encEntry.cekBits) {
            cek = generateCek(encEntry);
        }
    }
    catch (err) {
        if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
            throw err;
        }
        cek = generateCek(encEntry);
    }
    let plaintext = await decrypt(encEntry, cek, ciphertext, iv, tag, additionalData);
    if (joseHeader.zip === 'DEF') {
        const decompressionLimit = maxDecompressedLength ?? 250_000;
        if (decompressionLimit === 0) {
            throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
        }
        if (decompressionLimit !== Infinity &&
            (!Number.isSafeInteger(decompressionLimit) || decompressionLimit < 1)) {
            throw new TypeError('maxDecompressedLength must be 0, a positive safe integer, or Infinity');
        }
        plaintext = await decompress(plaintext, decompressionLimit).catch((cause) => {
            if (cause instanceof JWEInvalid)
                throw cause;
            throw new JWEInvalid('Failed to decompress plaintext', { cause });
        });
    }
    return [plaintext, parsedProt, k, resolvedKey];
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
    const flattened = {
        ciphertext,
        iv: iv || undefined,
        protected: protectedHeader,
        tag: tag || undefined,
        encrypted_key: encryptedKey || undefined,
    };
    const parsedProt = parseJoseHeader(protectedHeader, JWEInvalid, 'JWE Protected Header is invalid');
    const protectedBytes = encode(protectedHeader);
    const token = [
        parsedProt,
        decodeBase64url(ciphertext, 'ciphertext', JWEInvalid),
        iv ? decodeBase64url(iv, 'iv', JWEInvalid) : undefined,
        tag ? decodeBase64url(tag, 'tag', JWEInvalid) : undefined,
        protectedBytes,
    ];
    return decryptRecipientCore(flattened, token, shared, key, parsedProt);
}
