import { encoder, decoder } from '../lib/buffer_utils.js';
import { encodeBase64, decodeBase64 } from '../lib/base64.js';
const invalid = 'The input to be decoded is not correctly encoded.';
export function decode(input) {
    if (Uint8Array.fromBase64) {
        try {
            return Uint8Array.fromBase64(typeof input === 'string' ? input : decoder.decode(input), {
                alphabet: 'base64url',
            });
        }
        catch (cause) {
            throw new TypeError(invalid, { cause });
        }
    }
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    if (encoded.includes('+') || encoded.includes('/')) {
        throw new TypeError(invalid);
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    try {
        return decodeBase64(encoded);
    }
    catch {
        throw new TypeError(invalid);
    }
}
export function encode(input) {
    let unencoded = input;
    if (typeof unencoded === 'string') {
        unencoded = encoder.encode(unencoded);
    }
    if (Uint8Array.prototype.toBase64) {
        return unencoded.toBase64({ alphabet: 'base64url', omitPadding: true });
    }
    return encodeBase64(unencoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
