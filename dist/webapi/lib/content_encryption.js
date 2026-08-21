import { concat, uint64be } from './buffer_utils.js';
import { checkCryptoKey } from './crypto_key.js';
import { invalidKeyInput } from './invalid_key_input.js';
import { JWEDecryptionFailed, JWEInvalid } from '../util/errors.js';
import { isCryptoKey } from './is_key_like.js';
export const generateCek = (enc) => crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3));
function checkCekLength(cek, expected) {
    const actual = cek.byteLength << 3;
    if (actual !== expected) {
        throw new JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
    }
}
export const generateIv = (enc) => crypto.getRandomValues(new Uint8Array(enc.ivBits >> 3));
export function checkIvLength(enc, iv) {
    if (iv.length << 3 !== enc.ivBits) {
        throw new JWEInvalid('Invalid Initialization Vector length');
    }
}
async function cbcKeySetup(enc, cek, usage) {
    if (!(cek instanceof Uint8Array)) {
        throw new TypeError(invalidKeyInput(cek, 'Uint8Array'));
    }
    const keySize = enc.cekBits >> 1;
    const encKey = await crypto.subtle.importKey('raw', cek.subarray(keySize >> 3), 'AES-CBC', false, [usage]);
    const macKey = await crypto.subtle.importKey('raw', cek.subarray(0, keySize >> 3), {
        hash: `SHA-${keySize << 1}`,
        name: 'HMAC',
    }, false, ['sign']);
    return [encKey, macKey, keySize];
}
async function cbcHmacTag(macKey, macData, keySize) {
    return new Uint8Array((await crypto.subtle.sign('HMAC', macKey, macData)).slice(0, keySize >> 3));
}
async function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, 'encrypt');
    const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
        iv: iv,
        name: 'AES-CBC',
    }, encKey, plaintext));
    const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
    const tag = await cbcHmacTag(macKey, macData, keySize);
    return { ciphertext, tag, iv };
}
async function timingSafeEqual(a, b) {
    const algorithm = { name: 'HMAC', hash: 'SHA-256' };
    const key = (await crypto.subtle.generateKey(algorithm, false, ['sign', 'verify']));
    const aHmac = await crypto.subtle.sign(algorithm, key, a);
    return crypto.subtle.verify(algorithm, key, aHmac, b);
}
async function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, 'decrypt');
    const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
    const expectedTag = await cbcHmacTag(macKey, macData, keySize);
    try {
        if (await timingSafeEqual(tag, expectedTag)) {
            return new Uint8Array(await crypto.subtle.decrypt({ iv: iv, name: 'AES-CBC' }, encKey, ciphertext));
        }
    }
    catch {
    }
    throw new JWEDecryptionFailed();
}
async function gcmEncrypt(enc, plaintext, cek, iv, aad) {
    const encKey = cek instanceof Uint8Array
        ? await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, [
            'encrypt',
        ])
        : (checkCryptoKey(cek, enc.subtle, 'encrypt'), cek);
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({
        additionalData: aad,
        iv: iv,
        name: 'AES-GCM',
        tagLength: 128,
    }, encKey, plaintext));
    const tag = encrypted.slice(-16);
    const ciphertext = encrypted.slice(0, -16);
    return { ciphertext, tag, iv };
}
async function gcmDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const encKey = cek instanceof Uint8Array
        ? await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, [
            'decrypt',
        ])
        : (checkCryptoKey(cek, enc.subtle, 'decrypt'), cek);
    try {
        return new Uint8Array(await crypto.subtle.decrypt({
            additionalData: aad,
            iv: iv,
            name: 'AES-GCM',
            tagLength: 128,
        }, encKey, concat(ciphertext, tag)));
    }
    catch {
        throw new JWEDecryptionFailed();
    }
}
export async function encrypt(enc, plaintext, cek, iv, aad) {
    if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
        throw new TypeError(invalidKeyInput(cek, 'CryptoKey', 'KeyObject', 'Uint8Array', 'JSON Web Key'));
    }
    if (iv) {
        checkIvLength(enc, iv);
    }
    else {
        iv = generateIv(enc);
    }
    if (cek instanceof Uint8Array) {
        checkCekLength(cek, enc.cekBits);
    }
    return enc.cbc
        ? cbcEncrypt(enc, plaintext, cek, iv, aad)
        : gcmEncrypt(enc, plaintext, cek, iv, aad);
}
export async function decrypt(enc, cek, ciphertext, iv, tag, aad) {
    if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
        throw new TypeError(invalidKeyInput(cek, 'CryptoKey', 'KeyObject', 'Uint8Array', 'JSON Web Key'));
    }
    if (!iv) {
        throw new JWEInvalid('JWE Initialization Vector missing');
    }
    if (!tag) {
        throw new JWEInvalid('JWE Authentication Tag missing');
    }
    if (!enc.cbc && tag.length !== 16) {
        throw new JWEInvalid('Invalid Authentication Tag length');
    }
    checkIvLength(enc, iv);
    if (cek instanceof Uint8Array) {
        checkCekLength(cek, enc.cekBits);
    }
    return enc.cbc
        ? cbcDecrypt(enc, cek, ciphertext, iv, tag, aad)
        : gcmDecrypt(enc, cek, ciphertext, iv, tag, aad);
}
