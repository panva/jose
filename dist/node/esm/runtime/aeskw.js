import { Buffer } from 'buffer';
import { KeyObject, createDecipheriv, createCipheriv } from 'crypto';
import { JOSENotSupported } from '../util/errors.js';
import { concat } from '../lib/buffer_utils.js';
import getSecretKey from './secret_key.js';
import { isCryptoKey } from './webcrypto.js';
import { checkEncCryptoKey } from '../lib/crypto_key.js';
import isKeyObject from './is_key_object.js';
import invalidKeyInput from '../lib/invalid_key_input.js';
import supported from './ciphers.js';
function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`Invalid key size for alg: ${alg}`);
    }
}
function ensureKeyObject(key, alg, usage) {
    if (isKeyObject(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        return getSecretKey(key);
    }
    if (isCryptoKey(key)) {
        checkEncCryptoKey(key, alg, usage);
        return KeyObject.from(key);
    }
    throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
}
export const wrap = async (alg, key, cek) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, 'wrapKey');
    checkKeySize(keyObject, alg);
    const cipher = createCipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return concat(cipher.update(cek), cipher.final());
};
export const unwrap = async (alg, key, encryptedKey) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!supported(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, 'unwrapKey');
    checkKeySize(keyObject, alg);
    const cipher = createDecipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return concat(cipher.update(encryptedKey), cipher.final());
};
