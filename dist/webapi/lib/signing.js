import { checkCryptoKey } from './crypto_key.js';
export function checkModulusLength(alg, key) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
}
function checkSigCryptoKey(entry, key, usage) {
    checkCryptoKey(key, entry.subtle, usage);
    if (entry.minModulusLength) {
        checkModulusLength(entry.alg, key);
    }
}
async function getSigKey(entry, key, usage) {
    if (key instanceof Uint8Array) {
        return crypto.subtle.importKey('raw', key, entry.subtle, false, [
            usage,
        ]);
    }
    checkSigCryptoKey(entry, key, usage);
    return key;
}
export async function sign(entry, key, data) {
    const cryptoKey = await getSigKey(entry, key, 'sign');
    const signature = await crypto.subtle.sign(entry.operation, cryptoKey, data);
    return new Uint8Array(signature);
}
export async function verify(entry, key, signature, data) {
    const cryptoKey = await getSigKey(entry, key, 'verify');
    try {
        return await crypto.subtle.verify(entry.operation, cryptoKey, signature, data);
    }
    catch {
        return false;
    }
}
