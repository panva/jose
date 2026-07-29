import { encode as b64u } from '../util/base64url.js';
import { prepareKey } from './key.js';
import { jwkToKey } from './jwk_to_key.js';
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js';
import { JOSENotSupported, JWEInvalid } from '../util/errors.js';
import { decodeBase64url, digest } from './helpers.js';
import { generateCek, encrypt, decrypt } from './content_encryption.js';
import { isObject } from './type_checks.js';
import { checkCryptoKey, checkUsage } from './crypto_key.js';
import { checkModulusLength } from './signing.js';
import { concat, encode, uint32be } from './buffer_utils.js';
import { assertCryptoKey } from './is_key_like.js';
function checkEcdhCryptoKey(key, usage) {
    switch (key.algorithm.name) {
        case 'ECDH':
        case 'X25519':
            break;
        default:
            throw new TypeError('CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519');
    }
    checkUsage(key, usage);
}
function checkKeySize(key, alg) {
    if (key.algorithm.length !== parseInt(alg.slice(1, 4), 10)) {
        throw new TypeError(`Invalid key size for alg: ${alg}`);
    }
}
function aeskwCryptoKey(key, alg, usage) {
    if (key instanceof Uint8Array) {
        return crypto.subtle.importKey('raw', key, 'AES-KW', true, [usage]);
    }
    checkCryptoKey(key, jweAlgorithm(alg).subtle, usage);
    return key;
}
async function aeskwWrap(alg, key, cek) {
    const cryptoKey = await aeskwCryptoKey(key, alg, 'wrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, { hash: 'SHA-256', name: 'HMAC' }, true, ['sign']);
    return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'));
}
async function aeskwUnwrap(alg, key, encryptedKey) {
    const cryptoKey = await aeskwCryptoKey(key, alg, 'unwrapKey');
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await crypto.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', { hash: 'SHA-256', name: 'HMAC' }, true, ['sign']);
    return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek));
}
async function aesGcmKwWrap(gcm, key, cek, iv) {
    const wrapped = await encrypt(gcm, cek, key, iv, new Uint8Array());
    return {
        encryptedKey: wrapped.ciphertext,
        iv: b64u(wrapped.iv),
        tag: b64u(wrapped.tag),
    };
}
async function aesGcmKwUnwrap(gcm, key, encryptedKey, iv, tag) {
    return decrypt(gcm, key, encryptedKey, iv, tag, new Uint8Array());
}
const subtleAlgorithm = (alg) => {
    switch (alg) {
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            return 'RSA-OAEP';
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
};
async function rsaesEncrypt(alg, key, cek) {
    checkCryptoKey(key, jweAlgorithm(alg).subtle, 'encrypt');
    checkModulusLength(alg, key);
    return new Uint8Array(await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek));
}
async function rsaesDecrypt(alg, key, encryptedKey) {
    checkCryptoKey(key, jweAlgorithm(alg).subtle, 'decrypt');
    checkModulusLength(alg, key);
    return new Uint8Array(await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey));
}
function pbes2CryptoKey(key, alg) {
    if (key instanceof Uint8Array) {
        return crypto.subtle.importKey('raw', key, 'PBKDF2', false, [
            'deriveBits',
        ]);
    }
    checkCryptoKey(key, jweAlgorithm(alg).subtle, 'deriveBits');
    return key;
}
const concatSalt = (alg, p2sInput) => concat(encode(alg), Uint8Array.of(0x00), p2sInput);
async function deriveKey(p2s, alg, p2c, key) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
        throw new JWEInvalid('PBES2 Salt Input must be 8 or more octets');
    }
    if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
        throw new JWEInvalid('PBES2 Count Input must be a positive integer');
    }
    const salt = concatSalt(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10);
    const subtleAlg = {
        hash: `SHA-${alg.slice(8, 11)}`,
        iterations: p2c,
        name: 'PBKDF2',
        salt,
    };
    const cryptoKey = await pbes2CryptoKey(key, alg);
    return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
}
async function pbes2kwWrap(alg, key, cek, p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16))) {
    const derived = await deriveKey(p2s, alg, p2c, key);
    const encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek);
    return { encryptedKey, p2c, p2s: b64u(p2s) };
}
async function pbes2kwUnwrap(alg, key, encryptedKey, p2c, p2s) {
    const derived = await deriveKey(p2s, alg, p2c, key);
    return aeskwUnwrap(alg.slice(-6), derived, encryptedKey);
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(Z, L, OtherInfo) {
    const dkLen = L >> 3;
    const hashLen = 32;
    const reps = Math.ceil(dkLen / hashLen);
    const dk = new Uint8Array(reps * hashLen);
    for (let i = 1; i <= reps; i++) {
        const hashInput = new Uint8Array(4 + Z.length + OtherInfo.length);
        hashInput.set(uint32be(i), 0);
        hashInput.set(Z, 4);
        hashInput.set(OtherInfo, 4 + Z.length);
        const hashResult = await digest('sha256', hashInput);
        dk.set(hashResult, (i - 1) * hashLen);
    }
    return dk.slice(0, dkLen);
}
async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
    checkEcdhCryptoKey(publicKey);
    checkEcdhCryptoKey(privateKey, 'deriveBits');
    const algorithmID = lengthAndInput(encode(algorithm));
    const partyUInfo = lengthAndInput(apu);
    const partyVInfo = lengthAndInput(apv);
    const suppPubInfo = uint32be(keyLength);
    const suppPrivInfo = new Uint8Array();
    const otherInfo = concat(algorithmID, partyUInfo, partyVInfo, suppPubInfo, suppPrivInfo);
    const Z = new Uint8Array(await crypto.subtle.deriveBits({
        name: publicKey.algorithm.name,
        public: publicKey,
    }, privateKey, getEcdhBitLength(publicKey)));
    return concatKdf(Z, keyLength, otherInfo);
}
function getEcdhBitLength(publicKey) {
    if (publicKey.algorithm.name === 'X25519') {
        return 256;
    }
    return (Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3);
}
function ecdhesAllowed(key) {
    switch (key.algorithm.namedCurve) {
        case 'P-256':
        case 'P-384':
        case 'P-521':
            return true;
        default:
            return key.algorithm.name === 'X25519';
    }
}
const unsupportedAlgHeader = 'Invalid or unsupported "alg" (JWE Algorithm) header value';
function assertEncryptedKey(encryptedKey) {
    if (encryptedKey === undefined)
        throw new JWEInvalid('JWE Encrypted Key missing');
}
export async function decryptKeyManagement(alg, enc, key, encryptedKey, joseHeader, options) {
    switch (alg) {
        case 'dir': {
            if (encryptedKey !== undefined)
                throw new JWEInvalid('Encountered unexpected JWE Encrypted Key');
            return key;
        }
        case 'ECDH-ES':
            if (encryptedKey !== undefined)
                throw new JWEInvalid('Encountered unexpected JWE Encrypted Key');
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW': {
            if (!isObject(joseHeader.epk))
                throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
            assertCryptoKey(key);
            if (!ecdhesAllowed(key))
                throw new JOSENotSupported('ECDH with the provided key is not allowed or not supported by your javascript runtime');
            const epk = await jwkToKey(jweAlgorithm(alg), joseHeader.epk);
            let partyUInfo;
            let partyVInfo;
            if (joseHeader.apu !== undefined) {
                if (typeof joseHeader.apu !== 'string')
                    throw new JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
                partyUInfo = decodeBase64url(joseHeader.apu, 'apu', JWEInvalid);
            }
            if (joseHeader.apv !== undefined) {
                if (typeof joseHeader.apv !== 'string')
                    throw new JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
                partyVInfo = decodeBase64url(joseHeader.apv, 'apv', JWEInvalid);
            }
            const sharedSecret = await ecdhesDeriveKey(epk, key, alg === 'ECDH-ES' ? enc.alg : alg, alg === 'ECDH-ES' ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
            if (alg === 'ECDH-ES')
                return sharedSecret;
            assertEncryptedKey(encryptedKey);
            return aeskwUnwrap(alg.slice(-6), sharedSecret, encryptedKey);
        }
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512': {
            assertEncryptedKey(encryptedKey);
            assertCryptoKey(key);
            return rsaesDecrypt(alg, key, encryptedKey);
        }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW': {
            assertEncryptedKey(encryptedKey);
            if (typeof joseHeader.p2c !== 'number')
                throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
            const p2cLimit = options?.maxPBES2Count || 10_000;
            if (joseHeader.p2c > p2cLimit)
                throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
            if (typeof joseHeader.p2s !== 'string')
                throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
            let p2s;
            p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid);
            return pbes2kwUnwrap(alg, key, encryptedKey, joseHeader.p2c, p2s);
        }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW': {
            assertEncryptedKey(encryptedKey);
            return aeskwUnwrap(alg, key, encryptedKey);
        }
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW': {
            assertEncryptedKey(encryptedKey);
            if (typeof joseHeader.iv !== 'string')
                throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
            if (typeof joseHeader.tag !== 'string')
                throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
            let iv;
            iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid);
            let tag;
            tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid);
            return aesGcmKwUnwrap(jweEncryption(jweAlgorithm(alg).gcmkw), key, encryptedKey, iv, tag);
        }
        default: {
            throw new JOSENotSupported(unsupportedAlgHeader);
        }
    }
}
export async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    switch (alg) {
        case 'dir': {
            cek = key;
            break;
        }
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW': {
            assertCryptoKey(key);
            if (!ecdhesAllowed(key)) {
                throw new JOSENotSupported('ECDH with the provided key is not allowed or not supported by your javascript runtime');
            }
            const { apu, apv } = providedParameters;
            let ephemeralKey;
            if (providedParameters.epk) {
                ephemeralKey = (await prepareKey(jweAlgorithm(alg), providedParameters.epk, 'decrypt'));
            }
            else {
                ephemeralKey = (await crypto.subtle.generateKey(key.algorithm, true, ['deriveBits'])).privateKey;
            }
            const subtle = crypto.subtle;
            let exportableEpk = ephemeralKey;
            if (!exportableEpk.extractable) {
                if (typeof subtle.getPublicKey !== 'function') {
                    throw new TypeError('CryptoKey for "epk" must be extractable');
                }
                exportableEpk = await subtle.getPublicKey(ephemeralKey, []);
            }
            const { x, y, crv, kty } = (await subtle.exportKey('jwk', exportableEpk));
            const sharedSecret = await ecdhesDeriveKey(key, ephemeralKey, alg === 'ECDH-ES' ? enc.alg : alg, alg === 'ECDH-ES' ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), apu, apv);
            parameters = { epk: { x, crv, kty } };
            if (kty === 'EC')
                parameters.epk.y = y;
            if (apu)
                parameters.apu = b64u(apu);
            if (apv)
                parameters.apv = b64u(apv);
            if (alg === 'ECDH-ES') {
                cek = sharedSecret;
                break;
            }
            cek = providedCek || generateCek(enc);
            const kwAlg = alg.slice(-6);
            encryptedKey = await aeskwWrap(kwAlg, sharedSecret, cek);
            break;
        }
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512': {
            cek = providedCek || generateCek(enc);
            assertCryptoKey(key);
            encryptedKey = await rsaesEncrypt(alg, key, cek);
            break;
        }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW': {
            cek = providedCek || generateCek(enc);
            const { p2c, p2s } = providedParameters;
            ({ encryptedKey, ...parameters } = await pbes2kwWrap(alg, key, cek, p2c, p2s));
            break;
        }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW': {
            cek = providedCek || generateCek(enc);
            encryptedKey = await aeskwWrap(alg, key, cek);
            break;
        }
        case 'A128GCMKW':
        case 'A192GCMKW':
        case 'A256GCMKW': {
            cek = providedCek || generateCek(enc);
            const { iv } = providedParameters;
            ({ encryptedKey, ...parameters } = await aesGcmKwWrap(jweEncryption(jweAlgorithm(alg).gcmkw), key, cek, iv));
            break;
        }
        default: {
            throw new JOSENotSupported(unsupportedAlgHeader);
        }
    }
    return { cek, encryptedKey, parameters };
}
