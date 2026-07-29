import { prepareDecrypt, decryptCompact } from '../../lib/jwe_decrypt.js';
export async function compactDecrypt(jwe, key, options) {
    const decrypted = await decryptCompact(jwe, prepareDecrypt(options), key);
    const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.parsedProt };
    if (typeof key === 'function') {
        return { ...result, key: decrypted.key };
    }
    return result;
}
