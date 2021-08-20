import { diffieHellman, generateKeyPair as generateKeyPairCb } from 'crypto';
import { promisify } from 'util';
import getNamedCurve from './get_named_curve.js';
import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../lib/buffer_utils.js';
import digest from './digest.js';
import { JOSENotSupported } from '../util/errors.js';
import { isCryptoKey, getKeyObject } from './webcrypto.js';
import isKeyObject from './is_key_object.js';
import invalidKeyInput from './invalid_key_input.js';
const generateKeyPair = promisify(generateKeyPairCb);
export const deriveKey = async (publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) => {
    const value = concat(lengthAndInput(encoder.encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength));
    if (isCryptoKey(publicKey)) {
        publicKey = getKeyObject(publicKey, 'ECDH-ES');
    }
    if (!isKeyObject(publicKey)) {
        throw new TypeError(invalidKeyInput(publicKey, 'KeyObject', 'CryptoKey'));
    }
    if (isCryptoKey(privateKey)) {
        privateKey = getKeyObject(privateKey, 'ECDH-ES', new Set(['deriveBits', 'deriveKey']));
    }
    if (!isKeyObject(privateKey)) {
        throw new TypeError(invalidKeyInput(privateKey, 'KeyObject', 'CryptoKey'));
    }
    const sharedSecret = diffieHellman({ privateKey, publicKey });
    return concatKdf(digest, sharedSecret, keyLength, value);
};
export const generateEpk = async (key) => {
    if (isCryptoKey(key)) {
        key = getKeyObject(key);
    }
    if (!isKeyObject(key)) {
        throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey'));
    }
    switch (key.asymmetricKeyType) {
        case 'x25519':
            return (await generateKeyPair('x25519')).privateKey;
        case 'x448': {
            return (await generateKeyPair('x448')).privateKey;
        }
        case 'ec': {
            const namedCurve = getNamedCurve(key);
            return (await generateKeyPair('ec', { namedCurve })).privateKey;
        }
        default:
            throw new JOSENotSupported('unsupported or invalid EPK');
    }
};
export const ecdhAllowed = (key) => ['P-256', 'P-384', 'P-521', 'X25519', 'X448'].includes(getNamedCurve(key));
