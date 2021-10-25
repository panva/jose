import { Buffer } from 'buffer';
import { decoder } from '../lib/buffer_utils.js';
let encodeImpl;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    return encoded;
}
if (Buffer.isEncoding('base64url')) {
    encodeImpl = (input) => Buffer.from(input).toString('base64url');
}
else {
    encodeImpl = (input) => Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
export const decodeBase64 = (input) => Buffer.from(input, 'base64');
export const encodeBase64 = (input) => Buffer.from(input).toString('base64');
export const encode = encodeImpl;
export const decode = (input) => Buffer.from(normalize(input), 'base64');
