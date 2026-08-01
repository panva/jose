import { JWEInvalid } from '../../util/errors.js';
import { isObject } from '../../lib/type_checks.js';
import { prepareDecrypt, decryptJWE, decryptResult, checkShared, checkRecipient, } from '../../lib/jwe_decrypt.js';
export async function flattenedDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
        throw new JWEInvalid('Flattened JWE must be an object');
    }
    checkShared(jwe);
    checkRecipient(jwe);
    return decryptResult(jwe, await decryptJWE(jwe, prepareDecrypt(options), key));
}
