import * as crypto from 'crypto';
import { isCryptoKey, getKeyObject } from './webcrypto.js';
import getSecretKey from './secret_key.js';
import invalidKeyInput from './invalid_key_input.js';
export default function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey'));
        }
        return getSecretKey(key);
    }
    if (key instanceof crypto.KeyObject) {
        return key;
    }
    if (isCryptoKey(key)) {
        return getKeyObject(key, alg, new Set([usage]));
    }
    throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
}
