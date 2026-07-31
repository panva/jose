import { prepareVerify, verifySignature, verifyResult } from '../../lib/jws_verify.js';
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
export async function generalVerify(jws, key, options) {
    if (!isObject(jws)) {
        throw new JWSInvalid('General JWS must be an object');
    }
    if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
        throw new JWSInvalid('JWS Signatures missing or incorrect type');
    }
    let shared;
    try {
        if (jws.payload === undefined)
            throw new Error();
        shared = prepareVerify(options);
    }
    catch {
        throw new JWSSignatureVerificationFailed();
    }
    for (const signature of jws.signatures) {
        try {
            if (signature.protected === undefined && signature.header === undefined)
                throw new Error();
            if (signature.protected !== undefined && typeof signature.protected !== 'string') {
                throw new Error();
            }
            if (typeof signature.signature !== 'string')
                throw new Error();
            if (signature.header !== undefined && !isObject(signature.header))
                throw new Error();
            return verifyResult(signature, await verifySignature({
                header: signature.header,
                payload: jws.payload,
                protected: signature.protected,
                signature: signature.signature,
            }, shared, key));
        }
        catch {
        }
    }
    throw new JWSSignatureVerificationFailed();
}
