import { JOSENotSupported } from '../util/errors.js';
export async function jwkToKey(entry, jwk) {
    if (jwk.kty === 'RSA' && 'oth' in jwk && jwk.oth !== undefined) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
    }
    if (!entry.kty.includes(jwk.kty)) {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle;
    const isPrivate = !!(jwk.d || jwk.priv);
    const keyData = { ...jwk };
    if (keyData.kty !== 'AKP') {
        delete keyData.alg;
    }
    delete keyData.use;
    return crypto.subtle.importKey('jwk', keyData, algorithm, jwk.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
