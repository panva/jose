import { createPrivateKey, createPublicKey } from 'crypto';
import { isCryptoKey, getKeyObject } from './webcrypto.js';
import isKeyObject from './is_key_object.js';
import invalidKeyInput from './invalid_key_input.js';
const genericExport = (keyType, keyFormat, key) => {
    let keyObject;
    if (isCryptoKey(key)) {
        if (!key.extractable) {
            throw new TypeError('CryptoKey is not extractable');
        }
        keyObject = getKeyObject(key);
    }
    else if (isKeyObject(key)) {
        keyObject = key;
    }
    else {
        throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey'));
    }
    if (keyObject.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({ format: 'pem', type: keyFormat });
};
export const toSPKI = (key) => {
    return genericExport('public', 'spki', key);
};
export const toPKCS8 = (key) => {
    return genericExport('private', 'pkcs8', key);
};
export const fromPKCS8 = (pem) => createPrivateKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''), 'base64'),
    type: 'pkcs8',
    format: 'der',
});
export const fromSPKI = (pem) => createPublicKey({
    key: Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''), 'base64'),
    type: 'spki',
    format: 'der',
});
