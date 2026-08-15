import { prepareDecrypt, decryptCompact } from '../../lib/jwe_decrypt.js';
export async function compactDecrypt(jwe, key, options) {
    const decrypted = await decryptCompact(jwe, prepareDecrypt(options), key);
    const result = { plaintext: decrypted[0], protectedHeader: decrypted[1] };
    if (typeof key === 'function') {
        return { ...result, key: decrypted[2] };
    }
    return result;
}
