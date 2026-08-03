import { checkCryptoKey, checkModulusLength } from './crypto_key.js';
async function getSigKey(entry, key, usage) {
    if (key instanceof Uint8Array) {
        return crypto.subtle.importKey('raw', key, entry.subtle, false, [
            usage,
        ]);
    }
    checkCryptoKey(key, entry.subtle, usage);
    if (entry.minRsaBits)
        checkModulusLength(entry.alg, key);
    return key;
}
export async function sign(entry, key, data) {
    const cryptoKey = await getSigKey(entry, key, 'sign');
    const signature = await crypto.subtle.sign(entry.signing, cryptoKey, data);
    return new Uint8Array(signature);
}
export async function verify(entry, key, signature, data) {
    const cryptoKey = await getSigKey(entry, key, 'verify');
    try {
        return await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
    }
    catch {
        return false;
    }
}
