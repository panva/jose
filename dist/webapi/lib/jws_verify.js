import { verify } from './signing.js';
import { jwsAlgorithm } from './jws_algorithms.js';
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js';
import { concat, decoder, encoder, encode } from './buffer_utils.js';
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js';
import { isDisjoint, isObject } from './type_checks.js';
import { validateB64, validateCrit, validateAlgorithms, JWS_RECOGNIZED } from './options.js';
import { prepareKey } from './key.js';
export function snapshotJws(jws, sharedPayload) {
    const encodedProtected = jws.protected;
    const inputHeader = jws.header;
    const header = isObject(inputHeader) ? { ...inputHeader } : inputHeader;
    let payload = sharedPayload ? sharedPayload[0] : jws.payload;
    if (!sharedPayload && payload instanceof Uint8Array) {
        payload = new Uint8Array(payload);
    }
    const signature = jws.signature;
    const snapshot = { payload, signature };
    if (encodedProtected !== undefined)
        snapshot.protected = encodedProtected;
    if (inputHeader !== undefined)
        snapshot.header = header;
    return snapshot;
}
export function verifyResult(jws, verified) {
    const [payload, parsedProt, , key, resolvedKey] = verified;
    const result = { payload };
    if (jws.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
        return { ...result, key };
    }
    return result;
}
export function prepareVerify(options) {
    return [options && validateAlgorithms('algorithms', options.algorithms), options?.crit];
}
export function parseProtectedHeader(encodedProtected, parsedProtected = encodedProtected === undefined
    ? {}
    : parseJoseHeader(encodedProtected, JWSInvalid, 'JWS Protected Header is invalid')) {
    return parsedProtected;
}
function validateJwsHeaders(parsedProt, joseHeader, shared) {
    const b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader));
    const alg = joseHeader.alg;
    if (typeof alg !== 'string' || !alg) {
        throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    if (shared[0] && !shared[0].has(alg)) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    return [b64, alg];
}
export function parseJwsHeaders(encodedProtected, header, shared, parsedProtected) {
    const parsedProt = parseProtectedHeader(encodedProtected, parsedProtected);
    let joseHeader;
    if (header !== undefined) {
        if (!isDisjoint(parsedProt, header)) {
            throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
        }
        joseHeader = { ...parsedProt, ...header };
    }
    else {
        joseHeader = parsedProt;
    }
    return [parsedProt, joseHeader, ...validateJwsHeaders(parsedProt, joseHeader, shared)];
}
export function encodeJsonUnencodedPayload(payload) {
    const invalid = /[\p{Cs}\p{Cn}]/u.exec(payload)?.[0];
    if (invalid !== undefined) {
        throw new JWSInvalid(/\p{Cs}/u.test(invalid)
            ? 'JWS Payload must be a well-formed Unicode string'
            : 'JWS Payload must not contain unassigned Unicode code points');
    }
    return encoder.encode(payload);
}
function encodeCompactUnencodedPayload(payload) {
    try {
        return encode(payload);
    }
    catch {
        throw new JWSInvalid('JWS Compact Serialization payload must use only ASCII characters');
    }
}
async function verifyPrepared(jws, shared, key, encodedProtected, parsedProt, alg, signingPayload) {
    let resolvedKey = false;
    if (typeof key === 'function') {
        key = await key(parsedProt, jws);
        resolvedKey = true;
    }
    const b64 = typeof signingPayload === 'string';
    const entry = jwsAlgorithm(alg);
    const data = concat(encodedProtected !== undefined ? encode(encodedProtected) : new Uint8Array(), encode('.'), b64
        ?
            (shared[2] ??= encodeBase64url(signingPayload, 'payload', JWSInvalid))
        : signingPayload);
    const signature = decodeBase64url(jws.signature, 'signature', JWSInvalid);
    const k = await prepareKey(entry, key, 'verify');
    if (!(await verify(entry, k, signature, data))) {
        throw new JWSSignatureVerificationFailed();
    }
    const payload = b64 ? decodeBase64url(signingPayload, 'payload', JWSInvalid) : signingPayload;
    return [payload, parsedProt, b64, k, resolvedKey];
}
export async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
    const { protected: encodedProtected, header, payload: inputPayload } = jws;
    const [parsedProt, , b64, alg] = parseJwsHeaders(encodedProtected, header, shared, parsedProtected);
    if (b64) {
        if (typeof inputPayload !== 'string') {
            throw new JWSInvalid('JWS Payload must be a string');
        }
    }
    else if (typeof inputPayload !== 'string' && !(inputPayload instanceof Uint8Array)) {
        throw new JWSInvalid('JWS Payload must be a string or an Uint8Array instance');
    }
    const signingPayload = b64 || typeof inputPayload !== 'string' ? inputPayload : encodeUnencodedPayload(inputPayload);
    return verifyPrepared(jws, shared, key, encodedProtected, parsedProt, alg, signingPayload);
}
export async function verifyCompact(jws, shared, key) {
    if (jws instanceof Uint8Array) {
        jws = decoder.decode(jws);
    }
    if (typeof jws !== 'string') {
        throw new JWSInvalid('Compact JWS must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
    if (length !== 3) {
        throw new JWSInvalid('Invalid Compact JWS');
    }
    const compactJws = { payload, protected: protectedHeader, signature };
    const parsedProt = parseProtectedHeader(protectedHeader);
    const [b64, alg] = validateJwsHeaders(parsedProt, parsedProt, shared);
    const signingPayload = b64 ? payload : encodeCompactUnencodedPayload(payload);
    return verifyPrepared(compactJws, shared, key, protectedHeader, parsedProt, alg, signingPayload);
}
