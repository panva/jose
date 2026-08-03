import { invalidKeyInput } from './invalid_key_input.js';
import { encodeBase64, decodeBase64 } from '../lib/base64.js';
import { JOSENotSupported } from '../util/errors.js';
import { keyAlgorithm, unsupportedAlg, algArgument } from './key_algorithm.js';
import { isCryptoKey, isKeyObject } from './is_key_like.js';
const formatPEM = (b64, descriptor) => {
    const newlined = (b64.match(/.{1,64}/g) || []).join('\n');
    return `-----BEGIN ${descriptor}-----\n${newlined}\n-----END ${descriptor}-----`;
};
const genericExport = async (keyType, keyFormat, key) => {
    if (isKeyObject(key)) {
        if (key.type !== keyType) {
            throw new TypeError(`key is not a ${keyType} key`);
        }
        return key.export({ format: 'pem', type: keyFormat });
    }
    if (!isCryptoKey(key)) {
        throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject'));
    }
    if (!key.extractable) {
        throw new TypeError('CryptoKey is not extractable');
    }
    if (key.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return formatPEM(encodeBase64(new Uint8Array(await crypto.subtle.exportKey(keyFormat, key))), `${keyType.toUpperCase()} KEY`);
};
export const toSPKI = (key) => genericExport('public', 'spki', key);
export const toPKCS8 = (key) => genericExport('private', 'pkcs8', key);
const bytesEqual = (a, b) => {
    if (a.byteLength !== b.length)
        return false;
    for (let i = 0; i < a.byteLength; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
const createASN1State = (data) => ({ data, pos: 0 });
const readByte = (state) => {
    const byte = state.data[state.pos++];
    if (byte === undefined) {
        throw new Error('Unexpected end of ASN.1 input');
    }
    return byte;
};
const parseLength = (state) => {
    const first = readByte(state);
    if (first & 0x80) {
        const lengthOfLen = first & 0x7f;
        let length = 0;
        for (let i = 0; i < lengthOfLen; i++) {
            length = (length << 8) | readByte(state);
        }
        return length;
    }
    return first;
};
const skipElement = (state, count = 1) => {
    while (count-- > 0) {
        state.pos++;
        const length = parseLength(state);
        state.pos += length;
    }
};
const expectTag = (state, expectedTag, errorMessage) => {
    if (readByte(state) !== expectedTag) {
        throw new Error(errorMessage);
    }
};
const getSubarray = (state, length) => {
    if (length < 0 || state.pos + length > state.data.length) {
        throw new Error('Unexpected end of ASN.1 input');
    }
    const result = state.data.subarray(state.pos, state.pos + length);
    state.pos += length;
    return result;
};
const parseAlgorithmOID = (state) => {
    expectTag(state, 0x06, 'Expected algorithm OID');
    const oidLen = parseLength(state);
    return getSubarray(state, oidLen);
};
function parseKeyHeader(state, keyFormat) {
    expectTag(state, 0x30, `Invalid ${keyFormat === 'spki' ? 'SPKI' : 'PKCS#8'} structure`);
    parseLength(state);
    if (keyFormat === 'pkcs8') {
        expectTag(state, 0x02, 'Expected version field');
        const length = parseLength(state);
        state.pos += length;
    }
    expectTag(state, 0x30, 'Expected algorithm identifier');
    parseLength(state);
}
const parseECAlgorithmIdentifier = (state) => {
    const algOid = parseAlgorithmOID(state);
    if (bytesEqual(algOid, [0x2b, 0x65, 0x6e])) {
        return 'X25519';
    }
    if (!bytesEqual(algOid, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01])) {
        throw new Error('Unsupported key algorithm');
    }
    expectTag(state, 0x06, 'Expected curve OID');
    const curveOidLen = parseLength(state);
    const curveOid = getSubarray(state, curveOidLen);
    if (bytesEqual(curveOid, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]))
        return 'P-256';
    if (bytesEqual(curveOid, [0x2b, 0x81, 0x04, 0x00, 0x22]))
        return 'P-384';
    if (bytesEqual(curveOid, [0x2b, 0x81, 0x04, 0x00, 0x23]))
        return 'P-521';
    throw new Error('Unsupported named curve');
};
const genericImport = async (keyFormat, keyData, alg, options) => {
    const entry = keyAlgorithm(alg, algArgument);
    if (entry.secret) {
        unsupportedAlg(algArgument);
    }
    const isPublic = keyFormat === 'spki';
    let algorithm;
    if (entry.resolve) {
        try {
            const state = createASN1State(keyData);
            parseKeyHeader(state, keyFormat);
            algorithm = entry.resolve({ crv: parseECAlgorithmIdentifier(state) });
        }
        catch {
            throw new JOSENotSupported('Invalid or unsupported key format');
        }
    }
    else {
        algorithm = entry.subtle;
    }
    return crypto.subtle.importKey(keyFormat, keyData, algorithm, options?.extractable ?? isPublic, entry.usages[isPublic ? 0 : 1]);
};
const processPEMData = (pem, pattern) => {
    return decodeBase64(pem.replace(pattern, ''));
};
export const fromPKCS8 = (pem, alg, options) => {
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
    return genericImport('pkcs8', keyData, alg, options);
};
export const fromSPKI = (pem, alg, options) => {
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g);
    return genericImport('spki', keyData, alg, options);
};
function spkiFromX509(buf) {
    const state = createASN1State(buf);
    expectTag(state, 0x30, 'Invalid certificate structure');
    parseLength(state);
    expectTag(state, 0x30, 'Invalid tbsCertificate structure');
    parseLength(state);
    if (buf[state.pos] === 0xa0) {
        skipElement(state, 6);
    }
    else {
        skipElement(state, 5);
    }
    const spkiStart = state.pos;
    expectTag(state, 0x30, 'Invalid SPKI structure');
    const spkiContentLen = parseLength(state);
    return buf.subarray(spkiStart, spkiStart + spkiContentLen + (state.pos - spkiStart));
}
export const fromX509 = (pem, alg, options) => {
    let spki;
    try {
        const certificate = processPEMData(pem, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
        spki = spkiFromX509(certificate);
    }
    catch (cause) {
        throw new TypeError('Failed to parse the X.509 certificate', { cause });
    }
    return genericImport('spki', spki, alg, options);
};
