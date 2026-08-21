import { withAlg as invalidKeyInput } from './invalid_key_input.js';
import { isKeyLike, isCryptoKey } from './is_key_like.js';
import { isObject } from './type_checks.js';
import { decode } from '../util/base64url.js';
import { jwkToKey } from './jwk_to_key.js';
import { normalizeJwk } from './jwk_metadata.js';
const tag = (key) => key[Symbol.toStringTag];
const jwkMatchesOp = (entry, key, usage) => {
    const { alg } = entry;
    if (key.use !== undefined) {
        const expected = usage === 'sign' || usage === 'verify' ? 'sig' : 'enc';
        if (key.use !== expected) {
            throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
        }
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
    }
    if (Array.isArray(key.key_ops)) {
        const expectedKeyOp = usage === 'encrypt' || usage === 'decrypt' ? entry.ops?.[usage === 'encrypt' ? 0 : 1] : usage;
        if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) {
            throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
        }
    }
};
export function checkKeyType(entry, key, usage) {
    const { alg, secret } = entry;
    const privateKey = usage === 'decrypt' || usage === 'sign';
    if (secret && key instanceof Uint8Array)
        return [BYTES, key];
    if (isObject(key)) {
        const normalized = normalizeJwk(key);
        if (typeof normalized.kty !== 'string') {
            throw new TypeError(secret
                ? invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array')
                : invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
        }
        const valid = secret
            ? normalized.kty === 'oct' && typeof normalized.k === 'string'
            : normalized.kty !== 'oct' &&
                (privateKey
                    ? (normalized.kty === 'AKP' && typeof normalized.priv === 'string') ||
                        typeof normalized.d === 'string'
                    : normalized.d === undefined && normalized.priv === undefined);
        if (!valid) {
            throw new TypeError(secret
                ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`
                : `JSON Web Key for this operation must be a ${privateKey ? 'private' : 'public'} JWK`);
        }
        jwkMatchesOp(entry, normalized, usage);
        return [JWK, key, normalized];
    }
    if (!isKeyLike(key)) {
        throw new TypeError(secret
            ? invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array')
            : invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
    }
    if (secret) {
        if (key.type !== 'secret') {
            throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
        }
    }
    else {
        if (key.type === 'secret') {
            throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
        }
        const expectedType = privateKey ? 'private' : 'public';
        if ((key.type === 'public' || key.type === 'private') && key.type !== expectedType) {
            const operation = usage === 'sign'
                ? 'signing'
                : usage === 'verify'
                    ? 'verifying'
                    : `${usage.slice(0, -1)}tion`;
            throw new TypeError(`${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`);
        }
    }
    return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key];
}
const BYTES = 0;
const CRYPTO = 1;
const KEYOBJECT = 2;
const JWK = 3;
let cache;
const nist = {
    __proto__: null,
    prime256v1: 'P-256',
    secp384r1: 'P-384',
    secp521r1: 'P-521',
};
function cached(key, alg, value) {
    cache ||= new WeakMap();
    const entry = cache.get(key);
    if (value) {
        if (entry) {
            entry[alg] = value;
        }
        else {
            cache.set(key, { [alg]: value });
        }
    }
    return value ?? entry?.[alg];
}
const handleJWK = async (key, jwk, entry) => cached(key, entry.alg) ??
    cached(key, entry.alg, await jwkToKey(entry, { ...jwk, alg: entry.alg }));
const handleKeyObject = (keyObject, entry) => {
    const hit = cached(keyObject, entry.alg);
    if (hit)
        return hit;
    const isPublic = keyObject.type === 'public';
    const usages = entry.usages[isPublic ? 0 : 1];
    const { asymmetricKeyType } = keyObject;
    const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
    const params = entry.resolve?.({ crv, asymmetricKeyType }) ?? entry.subtle;
    return cached(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
export async function prepareKey(entry, key, usage) {
    const tagged = checkKeyType(entry, key, usage);
    switch (tagged[0]) {
        case BYTES:
        case CRYPTO:
            return tagged[1];
        case JWK: {
            const key = tagged[1];
            const normalized = tagged[2];
            if (normalized.kty === 'oct') {
                return decode(normalized.k);
            }
            if (!Object.isFrozen(key)) {
                const { key_ops } = key;
                if (Array.isArray(key_ops))
                    Object.freeze(key_ops);
                Object.freeze(key);
            }
            return handleJWK(key, normalized, entry);
        }
        case KEYOBJECT: {
            const keyObject = tagged[1];
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
