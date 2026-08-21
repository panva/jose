import { jwkToKey } from '../lib/jwk_to_key.js';
import { JWS } from '../lib/jws_algorithms.js';
import { JWKSInvalid, JOSENotSupported, JWKSNoMatchingKey, JWKSMultipleMatchingKeys, } from '../util/errors.js';
import { isJwkSet } from '../lib/type_checks.js';
import { snapshotJwk } from '../lib/jwk_metadata.js';
function isUsableJWK(jwk, entry, alg, kid) {
    const { kty, key_ops, ext, kid: jwkKid, alg: jwkAlg, use, crv } = snapshotJwk(jwk);
    const keyOps = Array.isArray(key_ops) ? [...key_ops] : key_ops;
    return ((ext === undefined || typeof ext === 'boolean') &&
        (keyOps === undefined ||
            (Array.isArray(keyOps) &&
                keyOps.every((operation, index) => typeof operation === 'string' && keyOps.indexOf(operation) === index) &&
                keyOps.includes('verify'))) &&
        entry.kty.includes(kty) &&
        (kid === undefined || (typeof kid === 'string' && kid === jwkKid)) &&
        (jwkAlg === undefined ? kty !== 'AKP' : alg === jwkAlg) &&
        (use === undefined || use === 'sig') &&
        (!entry.crv || crv === entry.crv));
}
async function importWithAlgCache(cache, jwk, entry) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
    const { alg } = entry;
    if (cached[alg] === undefined) {
        const key = await jwkToKey(entry, { ...jwk, alg, ext: true });
        if (key.type !== 'public') {
            throw new JWKSInvalid('JSON Web Key Set members must be public keys');
        }
        cached[alg] = key;
    }
    return cached[alg];
}
export function createLocalJWKSet(jwks) {
    let snapshot;
    try {
        snapshot = structuredClone(jwks);
    }
    catch { }
    if (!isJwkSet(snapshot)) {
        throw new JWKSInvalid('JSON Web Key Set malformed');
    }
    const cached = new WeakMap();
    const localJWKSet = async (protectedHeader, token) => {
        const { alg, kid } = { ...protectedHeader, ...token?.header };
        const entry = typeof alg === 'string' ? JWS[alg] : undefined;
        if (!entry || entry.secret) {
            throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
        }
        const candidates = snapshot.keys.filter((jwk) => isUsableJWK(jwk, entry, alg, kid));
        const { 0: jwk, length } = candidates;
        if (!length) {
            throw new JWKSNoMatchingKey();
        }
        if (length !== 1) {
            const error = new JWKSMultipleMatchingKeys();
            error[Symbol.asyncIterator] = async function* () {
                for (const jwk of candidates) {
                    try {
                        yield await importWithAlgCache(cached, jwk, entry);
                    }
                    catch { }
                }
            };
            throw error;
        }
        return importWithAlgCache(cached, jwk, entry);
    };
    return Object.defineProperty(localJWKSet, 'jwks', {
        value: () => structuredClone(snapshot),
    });
}
