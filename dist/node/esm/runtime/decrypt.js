import { createDecipheriv } from 'crypto';
import checkIvLength from '../lib/check_iv_length.js';
import checkCekLength from './check_cek_length.js';
import { concat } from '../lib/buffer_utils.js';
import { JOSENotSupported, JWEDecryptionFailed } from '../util/errors.js';
import timingSafeEqual from './timing_safe_equal.js';
import cbcTag from './cbc_tag.js';
import { isCryptoKey, getKeyObject } from './webcrypto.js';
import isKeyObject from './is_key_object.js';
import invalidKeyInput from './invalid_key_input.js';
import supported from './ciphers.js';
async function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.substr(1, 3), 10);
    if (isKeyObject(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const macSize = parseInt(enc.substr(-3), 10);
    const algorithm = `aes-${keySize}-cbc`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const expectedTag = cbcTag(aad, iv, ciphertext, macSize, macKey, keySize);
    let macCheckPassed;
    try {
        macCheckPassed = timingSafeEqual(tag, expectedTag);
    }
    catch {
    }
    if (!macCheckPassed) {
        throw new JWEDecryptionFailed();
    }
    let plaintext;
    try {
        const cipher = createDecipheriv(algorithm, encKey, iv);
        plaintext = concat(cipher.update(ciphertext), cipher.final());
    }
    catch {
    }
    if (!plaintext) {
        throw new JWEDecryptionFailed();
    }
    return plaintext;
}
async function gcmDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.substr(1, 3), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    try {
        const cipher = createDecipheriv(algorithm, cek, iv, { authTagLength: 16 });
        cipher.setAuthTag(tag);
        if (aad.byteLength) {
            cipher.setAAD(aad, { plaintextLength: ciphertext.length });
        }
        return concat(cipher.update(ciphertext), cipher.final());
    }
    catch {
        throw new JWEDecryptionFailed();
    }
}
const decrypt = async (enc, cek, ciphertext, iv, tag, aad) => {
    let key;
    if (isCryptoKey(cek)) {
        key = getKeyObject(cek, enc, new Set(['decrypt']));
    }
    else if (cek instanceof Uint8Array || isKeyObject(cek)) {
        key = cek;
    }
    else {
        throw new TypeError(invalidKeyInput(cek, 'KeyObject', 'CryptoKey', 'Uint8Array'));
    }
    checkCekLength(enc, key);
    checkIvLength(enc, iv);
    switch (enc) {
        case 'A128CBC-HS256':
        case 'A192CBC-HS384':
        case 'A256CBC-HS512':
            return cbcDecrypt(enc, key, ciphertext, iv, tag, aad);
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            return gcmDecrypt(enc, key, ciphertext, iv, tag, aad);
        default:
            throw new JOSENotSupported('Unsupported JWE Content Encryption Algorithm');
    }
};
export default decrypt;
