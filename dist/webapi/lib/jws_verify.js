import { verify } from './signing.js';
import { jwsAlgorithm } from './jws_algorithms.js';
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js';
import { concat, decoder, encoder, encode } from './buffer_utils.js';
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js';
import { isDisjoint } from './type_checks.js';
import { validateCrit, validateAlgorithms, JWS_RECOGNIZED } from './options.js';
import { prepareKey } from './key.js';
export function verifyResult(jws, verified) {
    const result = { payload: verified.payload };
    if (jws.protected !== undefined) {
        result.protectedHeader = verified.parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (verified.resolvedKey) {
        return { ...result, key: verified.key };
    }
    return result;
}
export function prepareVerify(options) {
    return {
        algorithms: options && validateAlgorithms('algorithms', options.algorithms),
        crit: options?.crit,
    };
}
export async function verifySignature(jws, shared, key) {
    let parsedProt = {};
    if (jws.protected) {
        parsedProt = parseJoseHeader(jws.protected, JWSInvalid, 'JWS Protected Header is invalid');
    }
    let joseHeader;
    if (jws.header !== undefined) {
        if (!isDisjoint(parsedProt, jws.header)) {
            throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
        }
        joseHeader = { ...parsedProt, ...jws.header };
    }
    else {
        joseHeader = parsedProt;
    }
    const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, shared.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has('b64')) {
        b64 = parsedProt.b64;
        if (typeof b64 !== 'boolean') {
            throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
    }
    const { alg } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    if (shared.algorithms && !shared.algorithms.has(alg)) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (b64) {
        if (typeof jws.payload !== 'string') {
            throw new JWSInvalid('JWS Payload must be a string');
        }
    }
    else if (typeof jws.payload !== 'string' && !(jws.payload instanceof Uint8Array)) {
        throw new JWSInvalid('JWS Payload must be a string or an Uint8Array instance');
    }
    let resolvedKey = false;
    if (typeof key === 'function') {
        key = await key(parsedProt, jws);
        resolvedKey = true;
    }
    const entry = jwsAlgorithm(alg);
    const data = concat(jws.protected !== undefined ? encode(jws.protected) : new Uint8Array(), encode('.'), typeof jws.payload === 'string'
        ? b64
            ?
                (shared.b64p ??= encodeBase64url(jws.payload, 'payload', JWSInvalid))
            : encoder.encode(jws.payload)
        : jws.payload);
    const signature = decodeBase64url(jws.signature, 'signature', JWSInvalid);
    const k = await prepareKey(entry, key, 'verify');
    const verified = await verify(entry, k, signature, data);
    if (!verified) {
        throw new JWSSignatureVerificationFailed();
    }
    let payload;
    if (b64) {
        payload = decodeBase64url(jws.payload, 'payload', JWSInvalid);
    }
    else if (typeof jws.payload === 'string') {
        payload = encoder.encode(jws.payload);
    }
    else {
        payload = jws.payload;
    }
    return { payload, parsedProt, b64, key: k, resolvedKey };
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
    return verifySignature({ payload, protected: protectedHeader, signature }, shared, key);
}
