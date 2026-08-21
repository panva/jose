import { encode as b64u } from '../util/base64url.js';
import { sign } from './signing.js';
import { jwsAlgorithm } from './jws_algorithms.js';
import { isDisjoint } from './type_checks.js';
import { JWSInvalid } from '../util/errors.js';
import { concat, encode } from './buffer_utils.js';
import { serializeJoseHeader, validateB64, validateCrit, validateCritDuplicates, JWS_RECOGNIZED, } from './options.js';
import { prepareKey } from './key.js';
function serializeProtectedHeader(protectedHeader) {
    if (protectedHeader === undefined)
        return [undefined, ''];
    const normalized = serializeJoseHeader(JWSInvalid, protectedHeader);
    return [normalized[0], b64u(normalized[1])];
}
function validateSignatureHeader(protectedHeader, joseHeader, crit) {
    validateCritDuplicates(JWSInvalid, protectedHeader);
    return validateB64(protectedHeader, validateCrit(JWSInvalid, JWS_RECOGNIZED, crit, protectedHeader, joseHeader));
}
function signatureAlgorithm(joseHeader) {
    const alg = joseHeader.alg;
    if (typeof alg !== 'string' || !alg) {
        throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    return jwsAlgorithm(alg);
}
async function signSignature(protectedHeader, payload, entry, key) {
    const data = concat(encode(protectedHeader), encode('.'), payload);
    const k = await prepareKey(entry, key, 'sign');
    return b64u(await sign(entry, k, data));
}
export async function createSignature(input, key, assertB64) {
    let { protectedHeader, unprotectedHeader } = input;
    let protectedHeaderString;
    [protectedHeader, protectedHeaderString] = serializeProtectedHeader(protectedHeader);
    if (unprotectedHeader !== undefined) {
        unprotectedHeader = serializeJoseHeader(JWSInvalid, unprotectedHeader)[0];
    }
    if (!protectedHeader && !unprotectedHeader) {
        throw new JWSInvalid('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
    }
    if (!isDisjoint(protectedHeader, unprotectedHeader)) {
        throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
    }
    const joseHeader = { ...protectedHeader, ...unprotectedHeader };
    const b64 = validateSignatureHeader(protectedHeader, joseHeader, input.crit);
    assertB64?.(b64);
    const entry = signatureAlgorithm(joseHeader);
    let payloadS;
    let payloadB;
    if (b64) {
        const encoded = (input.encoded ??= []);
        encoded[0] ??= b64u(input.payload);
        encoded[1] ??= encode(encoded[0]);
        payloadS = encoded[0];
        payloadB = encoded[1];
    }
    else {
        payloadB = input.payload;
        payloadS = '';
    }
    const jws = {
        signature: await signSignature(protectedHeaderString, payloadB, entry, key),
        payload: payloadS,
    };
    if (protectedHeader) {
        jws.protected = protectedHeaderString;
    }
    if (unprotectedHeader) {
        jws.header = unprotectedHeader;
    }
    return [jws, b64];
}
export async function createCompactSignature(payload, inputProtectedHeader, inputCrit, key, rejectUnencoded) {
    const [protectedHeader, protectedHeaderString] = serializeProtectedHeader(inputProtectedHeader);
    if (!protectedHeader) {
        throw new JWSInvalid('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
    }
    const b64 = validateSignatureHeader(protectedHeader, protectedHeader, inputCrit);
    if (!b64)
        rejectUnencoded();
    const entry = signatureAlgorithm(protectedHeader);
    const encodedPayload = b64u(payload);
    const signature = await signSignature(protectedHeaderString, encode(encodedPayload), entry, key);
    return `${protectedHeaderString}.${encodedPayload}.${signature}`;
}
