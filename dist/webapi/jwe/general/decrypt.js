import { prepareDecrypt, shareJWE, decryptRecipient, decryptResult, checkShared, checkRecipient, } from '../../lib/jwe_decrypt.js';
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
export async function generalDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
        throw new JWEInvalid('General JWE must be an object');
    }
    if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
        throw new JWEInvalid('JWE Recipients missing or incorrect type');
    }
    if (!jwe.recipients.length) {
        throw new JWEInvalid('JWE Recipients has no members');
    }
    let shared;
    let token;
    try {
        checkShared(jwe);
        shared = prepareDecrypt(options);
        token = shareJWE(jwe);
    }
    catch {
        throw new JWEDecryptionFailed();
    }
    if (jwe.recipients.length > 1) {
        for (const { header } of jwe.recipients) {
            const alg = token[0]?.alg ?? header?.alg ?? jwe.unprotected?.alg;
            if (alg === 'dir' || alg === 'ECDH-ES') {
                throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
            }
        }
    }
    for (const recipient of jwe.recipients) {
        try {
            const flattened = {
                aad: jwe.aad,
                ciphertext: jwe.ciphertext,
                encrypted_key: recipient.encrypted_key,
                header: recipient.header,
                iv: jwe.iv,
                protected: jwe.protected,
                tag: jwe.tag,
                unprotected: jwe.unprotected,
            };
            checkRecipient(flattened);
            return decryptResult(flattened, await decryptRecipient(flattened, token, shared, key));
        }
        catch {
        }
    }
    throw new JWEDecryptionFailed();
}
