import { createSecretKey } from 'crypto';
export default function getSecretKey(key) {
    let keyObject;
    if (key instanceof Uint8Array) {
        keyObject = createSecretKey(key);
    }
    else {
        keyObject = key;
    }
    return keyObject;
}
