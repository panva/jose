import { prepareDecrypt, shareJWE, decryptRecipient, decryptResult, checkRecipient, snapshotSharedJWE, snapshotRecipientJWE, } from '../../lib/jwe_decrypt.js';
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
export async function generalDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
        throw new JWEInvalid('General JWE must be an object');
    }
    const inputRecipients = jwe.recipients;
    if (!Array.isArray(inputRecipients)) {
        throw new JWEInvalid('JWE Recipients missing or incorrect type');
    }
    const recipients = Array.from(inputRecipients);
    if (!recipients.every(isObject)) {
        throw new JWEInvalid('JWE Recipients missing or incorrect type');
    }
    if (!recipients.length) {
        throw new JWEInvalid('JWE Recipients has no members');
    }
    let shared;
    let sharedJwe;
    let token;
    try {
        shared = prepareDecrypt(options);
        sharedJwe = snapshotSharedJWE(jwe);
        token = shareJWE(sharedJwe);
    }
    catch {
        throw new JWEDecryptionFailed();
    }
    const recipientSnapshots = recipients.map((recipient) => snapshotRecipientJWE(recipient));
    if (recipients.length > 1) {
        for (const [, headerAlg] of recipientSnapshots) {
            const alg = token[0]?.alg ?? headerAlg ?? sharedJwe.unprotected?.alg;
            if (alg === 'dir' || alg === 'ECDH-ES') {
                throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
            }
        }
    }
    for (const [recipient] of recipientSnapshots) {
        if (!recipient)
            continue;
        try {
            const flattened = { ...sharedJwe, ...recipient };
            checkRecipient(flattened);
            return decryptResult(flattened, await decryptRecipient(flattened, token, shared, key));
        }
        catch {
        }
    }
    throw new JWEDecryptionFailed();
}
