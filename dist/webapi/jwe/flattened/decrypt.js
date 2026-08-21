import { JWEInvalid } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
import { prepareDecrypt, decryptJWE, decryptResult, checkRecipient, snapshotSharedJWE, snapshotRecipientJWE, } from '../../lib/jwe_decrypt.js';
export async function flattenedDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
        throw new JWEInvalid('Flattened JWE must be an object');
    }
    const shared = snapshotSharedJWE(jwe);
    const [recipient, , error] = snapshotRecipientJWE(jwe);
    if (!recipient)
        throw error;
    const snapshot = { ...shared, ...recipient };
    checkRecipient(snapshot);
    return decryptResult(snapshot, await decryptJWE(snapshot, prepareDecrypt(options), key));
}
