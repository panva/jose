import { KeyObject } from 'crypto';
import { isCryptoKey } from './webcrypto.js';
import { checkSigCryptoKey } from '../lib/crypto_key.js';
import getSecretKey from './secret_key.js';
import invalidKeyInput from '../lib/invalid_key_input.js';
export default function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey'));
        }
        return getSecretKey(key);
    }
    if (key instanceof KeyObject) {
        return key;
    }
    if (isCryptoKey(key)) {
        checkSigCryptoKey(key, alg, usage);
        return KeyObject.from(key);
    }
    throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey', 'Uint8Array'));
}
