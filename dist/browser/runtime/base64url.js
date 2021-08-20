import { encoder, decoder } from '../lib/buffer_utils.js';
import globalThis from './global.js';
export const encode = (input) => {
    let unencoded = input;
    if (typeof unencoded === 'string') {
        unencoded = encoder.encode(unencoded);
    }
    const CHUNK_SIZE = 0x8000;
    const arr = [];
    for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
        arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
    }
    const base64string = globalThis.btoa(arr.join(''));
    return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};
export const decode = (input) => {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    try {
        return new Uint8Array(globalThis
            .atob(encoded)
            .split('')
            .map((c) => c.charCodeAt(0)));
    }
    catch (_a) {
        throw new TypeError('The input to be decoded is not correctly encoded.');
    }
};
