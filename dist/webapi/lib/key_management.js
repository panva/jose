import { encode as b64u } from '../util/base64url.js';
import { prepareKey } from './key.js';
import { jwkToKey } from './jwk_to_key.js';
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js';
import { JOSENotSupported, JWEInvalid } from '../util/errors.js';
import { decodeBase64url, digest } from './helpers.js';
import { generateCek, encrypt, decrypt } from './content_encryption.js';
import { isObject } from './type_checks.js';
import { checkCryptoKey, checkModulusLength, checkUsage } from './crypto_key.js';
import { concat, encode, uint32be } from './buffer_utils.js';
import { assertCryptoKey } from './is_key_like.js';
function checkEcdhCryptoKey(key, usage) {
    if (key.algorithm.name !== 'ECDH' && key.algorithm.name !== 'X25519') {
        throw new TypeError('CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519');
    }
    checkUsage(key, usage);
}
async function aeskwCryptoKey(key, alg, usage) {
    const expected = jweAlgorithm(alg).subtle;
    const cryptoKey = key instanceof Uint8Array
        ? await crypto.subtle.importKey('raw', key, 'AES-KW', true, [
            usage,
        ])
        : key;
    checkCryptoKey(cryptoKey, expected, usage);
    return cryptoKey;
}
async function aeskwWrap(alg, key, cek) {
    const cryptoKey = await aeskwCryptoKey(key, alg, 'wrapKey');
    const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, { hash: 'SHA-256', name: 'HMAC' }, true, ['sign']);
    return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'));
}
async function aeskwUnwrap(alg, key, encryptedKey) {
    const cryptoKey = await aeskwCryptoKey(key, alg, 'unwrapKey');
    const cryptoKeyCek = await crypto.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', { hash: 'SHA-256', name: 'HMAC' }, true, ['sign']);
    return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek));
}
function checkRsaKey(alg, key, usage) {
    checkCryptoKey(key, jweAlgorithm(alg).subtle, usage);
    checkModulusLength(alg, key);
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
async function deriveKey(p2s, alg, p2c, key) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
        throw new JWEInvalid('PBES2 Salt Input must be 8 or more octets');
    }
    if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
        throw new JWEInvalid('PBES2 Count Input must be a positive integer');
    }
    const salt = concat(encode(alg), Uint8Array.of(0), p2s);
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
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(Z, L, OtherInfo) {
    const dkLen = L >> 3;
    const hashLen = 32;
    const reps = Math.ceil(dkLen / hashLen);
    const dk = new Uint8Array(reps * hashLen);
    for (let i = 1; i <= reps; i++) {
        const hashResult = await digest('sha256', concat(uint32be(i), Z, OtherInfo));
        dk.set(hashResult, (i - 1) * hashLen);
    }
    return dk.slice(0, dkLen);
}
async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
    checkEcdhCryptoKey(publicKey);
    checkEcdhCryptoKey(privateKey, 'deriveBits');
    const otherInfo = concat(lengthAndInput(encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength));
    const Z = new Uint8Array(await crypto.subtle.deriveBits({
        name: publicKey.algorithm.name,
        public: publicKey,
    }, privateKey, publicKey.algorithm.name === 'X25519'
        ? 256
        : Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3));
    return concatKdf(Z, keyLength, otherInfo);
}
function assertEcdhKey(key) {
    assertCryptoKey(key);
    const curve = key.algorithm.namedCurve;
    if (curve !== 'P-256' &&
        curve !== 'P-384' &&
        curve !== 'P-521' &&
        key.algorithm.name !== 'X25519') {
        throw new JOSENotSupported('ECDH with the provided key is not allowed or not supported by your javascript runtime');
    }
}
function assertEncryptedKey(encryptedKey) {
    if (encryptedKey === undefined)
        throw new JWEInvalid('JWE Encrypted Key missing');
}
function assertNoEncryptedKey(encryptedKey) {
    if (encryptedKey !== undefined)
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key');
}
export async function decryptKeyManagement(alg, enc, key, encryptedKey, joseHeader, options) {
    const entry = jweAlgorithm(alg);
    if (alg === 'dir') {
        assertNoEncryptedKey(encryptedKey);
        return key;
    }
    switch (entry.subtle.name) {
        case 'ECDH': {
            if (alg === 'ECDH-ES')
                assertNoEncryptedKey(encryptedKey);
            if (!isObject(joseHeader.epk))
                throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
            assertEcdhKey(key);
            const epk = await jwkToKey(entry, joseHeader.epk);
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
        case 'RSA-OAEP': {
            assertEncryptedKey(encryptedKey);
            assertCryptoKey(key);
            checkRsaKey(alg, key, 'decrypt');
            return new Uint8Array(await crypto.subtle.decrypt('RSA-OAEP', key, encryptedKey));
        }
        case 'PBKDF2': {
            assertEncryptedKey(encryptedKey);
            if (typeof joseHeader.p2c !== 'number')
                throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
            const p2cLimit = options?.maxPBES2Count || 10_000;
            if (joseHeader.p2c > p2cLimit)
                throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
            if (typeof joseHeader.p2s !== 'string')
                throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
            const p2s = decodeBase64url(joseHeader.p2s, 'p2s', JWEInvalid);
            const derived = await deriveKey(p2s, alg, joseHeader.p2c, key);
            return aeskwUnwrap(alg.slice(-6), derived, encryptedKey);
        }
        case 'AES-KW': {
            assertEncryptedKey(encryptedKey);
            return aeskwUnwrap(alg, key, encryptedKey);
        }
        case 'AES-GCM': {
            assertEncryptedKey(encryptedKey);
            if (typeof joseHeader.iv !== 'string')
                throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
            if (typeof joseHeader.tag !== 'string')
                throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
            let iv;
            iv = decodeBase64url(joseHeader.iv, 'iv', JWEInvalid);
            let tag;
            tag = decodeBase64url(joseHeader.tag, 'tag', JWEInvalid);
            return decrypt(jweEncryption(alg.slice(0, -2)), key, encryptedKey, iv, tag, new Uint8Array());
        }
    }
}
export async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    const entry = jweAlgorithm(alg);
    if (alg === 'dir')
        return [key, undefined, undefined];
    switch (entry.subtle.name) {
        case 'ECDH': {
            assertEcdhKey(key);
            const { apu, apv } = providedParameters;
            let ephemeralKey;
            if (providedParameters.epk) {
                ephemeralKey = (await prepareKey(entry, providedParameters.epk, 'decrypt'));
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
        case 'RSA-OAEP': {
            cek = providedCek || generateCek(enc);
            assertCryptoKey(key);
            checkRsaKey(alg, key, 'encrypt');
            encryptedKey = new Uint8Array(await crypto.subtle.encrypt('RSA-OAEP', key, cek));
            break;
        }
        case 'PBKDF2': {
            cek = providedCek || generateCek(enc);
            const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters;
            const derived = await deriveKey(p2s, alg, p2c, key);
            encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek);
            parameters = { p2c, p2s: b64u(p2s) };
            break;
        }
        case 'AES-KW': {
            cek = providedCek || generateCek(enc);
            encryptedKey = await aeskwWrap(alg, key, cek);
            break;
        }
        case 'AES-GCM': {
            cek = providedCek || generateCek(enc);
            const { iv } = providedParameters;
            const wrapped = await encrypt(jweEncryption(alg.slice(0, -2)), cek, key, iv, new Uint8Array());
            encryptedKey = wrapped.ciphertext;
            parameters = { iv: b64u(wrapped.iv), tag: b64u(wrapped.tag) };
            break;
        }
    }
    return [cek, encryptedKey, parameters];
}
