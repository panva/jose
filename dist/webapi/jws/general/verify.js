import { prepareVerify, verifySignature, verifyResult } from '../../lib/jws_verify.js';
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
export async function generalVerify(jws, key, options) {
    if (!isObject(jws)) {
        throw new JWSInvalid('General JWS must be an object');
    }
    const { signatures, payload } = jws;
    if (!Array.isArray(signatures) || !signatures.every(isObject)) {
        throw new JWSInvalid('JWS Signatures missing or incorrect type');
    }
    let shared;
    try {
        if (payload === undefined)
            throw new Error();
        shared = prepareVerify(options);
    }
    catch {
        throw new JWSSignatureVerificationFailed();
    }
    for (const signature of signatures) {
        try {
            const { protected: encodedProtected, header, signature: encodedSignature } = signature;
            if (encodedProtected === undefined && header === undefined)
                throw new Error();
            if (encodedProtected !== undefined && typeof encodedProtected !== 'string') {
                throw new Error();
            }
            if (typeof encodedSignature !== 'string')
                throw new Error();
            if (header !== undefined && !isObject(header))
                throw new Error();
            return verifyResult(signature, await verifySignature({
                header,
                payload,
                protected: encodedProtected,
                signature: encodedSignature,
            }, shared, key));
        }
        catch {
        }
    }
    throw new JWSSignatureVerificationFailed();
}
