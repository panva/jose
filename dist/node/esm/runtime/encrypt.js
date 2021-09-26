import { createCipheriv } from 'crypto';
import checkIvLength from '../lib/check_iv_length.js';
import checkCekLength from './check_cek_length.js';
import { concat } from '../lib/buffer_utils.js';
import cbcTag from './cbc_tag.js';
import { isCryptoKey, getKeyObject } from './webcrypto.js';
import isKeyObject from './is_key_object.js';
import invalidKeyInput from './invalid_key_input.js';
import { JOSENotSupported } from '../util/errors.js';
import supported from './ciphers.js';
async function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.substr(1, 3), 10);
    if (isKeyObject(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const algorithm = `aes-${keySize}-cbc`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = createCipheriv(algorithm, encKey, iv);
    const ciphertext = concat(cipher.update(plaintext), cipher.final());
    const macSize = parseInt(enc.substr(-3), 10);
    const tag = cbcTag(aad, iv, ciphertext, macSize, macKey, keySize);
    return { ciphertext, tag };
}
async function gcmEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.substr(1, 3), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = createCipheriv(algorithm, cek, iv, { authTagLength: 16 });
    if (aad.byteLength) {
        cipher.setAAD(aad, { plaintextLength: plaintext.length });
    }
    const ciphertext = concat(cipher.update(plaintext), cipher.final());
    const tag = cipher.getAuthTag();
    return { ciphertext, tag };
}
const encrypt = async (enc, plaintext, cek, iv, aad) => {
    let key;
    if (isCryptoKey(cek)) {
        key = getKeyObject(cek, enc, new Set(['encrypt']));
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
            return cbcEncrypt(enc, plaintext, key, iv, aad);
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            return gcmEncrypt(enc, plaintext, key, iv, aad);
        default:
            throw new JOSENotSupported('Unsupported JWE Content Encryption Algorithm');
    }
};
export default encrypt;
