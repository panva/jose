import { withAlg as invalidKeyInput } from './invalid_key_input.js';
import { isKeyLike, isCryptoKey } from './is_key_like.js';
import * as jwk from './type_checks.js';
import { decode } from '../util/base64url.js';
import { jwkToKey } from './jwk_to_key.js';
const tag = (key) => key[Symbol.toStringTag];
const jwkMatchesOp = (entry, key, usage) => {
    const { alg } = entry;
    if (key.use !== undefined) {
        let expected;
        switch (usage) {
            case 'sign':
            case 'verify':
                expected = 'sig';
                break;
            case 'encrypt':
            case 'decrypt':
                expected = 'enc';
                break;
        }
        if (key.use !== expected) {
            throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
        }
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
    }
    if (Array.isArray(key.key_ops)) {
        const expectedKeyOp = usage === 'encrypt' || usage === 'decrypt' ? entry.keyOps?.[usage] : usage;
        if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
            throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
        }
    }
    return true;
};
const symmetricTypeCheck = (entry, key, usage) => {
    const { alg } = entry;
    if (key instanceof Uint8Array)
        return { kind: BYTES, key };
    if (jwk.isJWK(key)) {
        if (jwk.isSecretJWK(key) && jwkMatchesOp(entry, key, usage))
            return { kind: JWK, key };
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!isKeyLike(key)) {
        throw new TypeError(invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array'));
    }
    if (key.type !== 'secret') {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
    return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key };
};
const asymmetricTypeCheck = (entry, key, usage) => {
    const { alg } = entry;
    if (jwk.isJWK(key)) {
        switch (usage) {
            case 'decrypt':
            case 'sign':
                if (jwk.isPrivateJWK(key) && jwkMatchesOp(entry, key, usage))
                    return { kind: JWK, key };
                throw new TypeError(`JSON Web Key for this operation must be a private JWK`);
            case 'encrypt':
            case 'verify':
                if (jwk.isPublicJWK(key) && jwkMatchesOp(entry, key, usage))
                    return { kind: JWK, key };
                throw new TypeError(`JSON Web Key for this operation must be a public JWK`);
        }
    }
    if (!isKeyLike(key)) {
        throw new TypeError(invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
    }
    if (key.type === 'secret') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (key.type === 'public') {
        switch (usage) {
            case 'sign':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
            case 'decrypt':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
        }
    }
    if (key.type === 'private') {
        switch (usage) {
            case 'verify':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
            case 'encrypt':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
        }
    }
    return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key };
};
const BYTES = Symbol();
const CRYPTO = Symbol();
const KEYOBJECT = Symbol();
const JWK = Symbol();
export function checkKeyType(entry, key, usage) {
    return entry.symmetric
        ? symmetricTypeCheck(entry, key, usage)
        : asymmetricTypeCheck(entry, key, usage);
}
let cache;
const nist = {
    __proto__: null,
    prime256v1: 'P-256',
    secp384r1: 'P-384',
    secp521r1: 'P-521',
};
function cached(key, alg) {
    cache ||= new WeakMap();
    return cache.get(key)?.[alg];
}
function store(key, alg, cryptoKey) {
    const entry = cache.get(key);
    if (entry) {
        entry[alg] = cryptoKey;
    }
    else {
        cache.set(key, { [alg]: cryptoKey });
    }
    return cryptoKey;
}
const handleJWK = async (key, jwk, entry) => {
    const hit = cached(key, entry.alg);
    if (hit)
        return hit;
    const cryptoKey = await jwkToKey(entry, { ...jwk, alg: entry.alg });
    return store(key, entry.alg, cryptoKey);
};
const handleKeyObject = (keyObject, entry) => {
    const hit = cached(keyObject, entry.alg);
    if (hit)
        return hit;
    const isPublic = keyObject.type === 'public';
    const usages = isPublic ? entry.usages.public : entry.usages.private;
    const { asymmetricKeyType } = keyObject;
    const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
    const params = entry.subtleFor?.({ crv, asymmetricKeyType }) ?? entry.subtle;
    return store(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
export async function prepareKey(entry, key, usage) {
    const tagged = checkKeyType(entry, key, usage);
    switch (tagged.kind) {
        case BYTES:
        case CRYPTO:
            return tagged.key;
        case JWK: {
            if (tagged.key.k) {
                return decode(tagged.key.k);
            }
            if (!Object.isFrozen(tagged.key)) {
                const { key_ops } = tagged.key;
                if (Array.isArray(key_ops))
                    Object.freeze(key_ops);
                Object.freeze(tagged.key);
            }
            return handleJWK(tagged.key, tagged.key, entry);
        }
        case KEYOBJECT: {
            const keyObject = tagged.key;
            if (keyObject.type === 'secret') {
                return keyObject.export();
            }
            if ('toCryptoKey' in keyObject && typeof keyObject.toCryptoKey === 'function') {
                return handleKeyObject(keyObject, entry);
            }
            return handleJWK(keyObject, keyObject.export({ format: 'jwk' }), entry);
        }
    }
}
