import { jwkToKey } from '../lib/jwk_to_key.js';
import { JWS } from '../lib/jws_algorithms.js';
import { JWKSInvalid, JOSENotSupported, JWKSNoMatchingKey, JWKSMultipleMatchingKeys, } from '../util/errors.js';
import { isObject } from '../lib/type_checks.js';
function signatureAlgorithm(alg) {
    const entry = typeof alg === 'string' ? JWS[alg] : undefined;
    if (!entry || entry.secret) {
        throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    }
    return entry;
}
function isJWKSLike(jwks) {
    if (!jwks || typeof jwks !== 'object') {
        return false;
    }
    const { keys } = jwks;
    return Array.isArray(keys) && keys.every((isObject));
}
class LocalJWKSetImpl {
    #jwks;
    #cached = new WeakMap();
    constructor(jwks) {
        if (!isJWKSLike(jwks)) {
            throw new JWKSInvalid('JSON Web Key Set malformed');
        }
        this.#jwks = structuredClone(jwks);
    }
    jwks() {
        return this.#jwks;
    }
    async getKey(protectedHeader, token) {
        const { alg, kid } = { ...protectedHeader, ...token?.header };
        const entry = signatureAlgorithm(alg);
        const candidates = this.#jwks.keys.filter((jwk) => entry.kty.includes(jwk.kty) &&
            (typeof kid !== 'string' || kid === jwk.kid) &&
            (!(typeof jwk.alg === 'string' || jwk.kty === 'AKP') || alg === jwk.alg) &&
            (typeof jwk.use !== 'string' || jwk.use === 'sig') &&
            (!Array.isArray(jwk.key_ops) || jwk.key_ops.includes('verify')) &&
            (!entry.crv || jwk.crv === entry.crv));
        const { 0: jwk, length } = candidates;
        if (length === 0) {
            throw new JWKSNoMatchingKey();
        }
        if (length !== 1) {
            const error = new JWKSMultipleMatchingKeys();
            const _cached = this.#cached;
            error[Symbol.asyncIterator] = async function* () {
                for (const jwk of candidates) {
                    try {
                        yield await importWithAlgCache(_cached, jwk, entry);
                    }
                    catch { }
                }
            };
            throw error;
        }
        return importWithAlgCache(this.#cached, jwk, entry);
    }
}
async function importWithAlgCache(cache, jwk, entry) {
    const cached = cache.get(jwk) || cache.set(jwk, { __proto__: null }).get(jwk);
    if (cached[entry.alg] === undefined) {
        const key = await jwkToKey(entry, { ...jwk, alg: entry.alg, ext: true });
        if (key.type !== 'public') {
            throw new JWKSInvalid('JSON Web Key Set members must be public keys');
        }
        cached[entry.alg] = key;
    }
    return cached[entry.alg];
}
export function createLocalJWKSet(jwks) {
    const set = new LocalJWKSetImpl(jwks);
    const localJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
    Object.defineProperty(localJWKSet, 'jwks', {
        value: () => structuredClone(set.jwks()),
    });
    return localJWKSet;
}
