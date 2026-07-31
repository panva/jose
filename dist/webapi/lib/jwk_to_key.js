import { JOSENotSupported } from '../util/errors.js';
const unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
function subtleParams(entry, jwk) {
    if (!entry.kty.includes(jwk.kty)) {
        throw new JOSENotSupported(unsupportedAlg);
    }
    return entry.subtleFor?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle;
}
export async function jwkToKey(entry, jwk) {
    if (jwk.kty === 'RSA' && 'oth' in jwk && jwk.oth !== undefined) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
    }
    const algorithm = subtleParams(entry, jwk);
    const isPrivate = !!(jwk.d || jwk.priv);
    const keyUsages = isPrivate ? entry.usages.private : entry.usages.public;
    const keyData = { ...jwk };
    if (keyData.kty !== 'AKP') {
        delete keyData.alg;
    }
    delete keyData.use;
    return crypto.subtle.importKey('jwk', keyData, algorithm, jwk.ext ?? (isPrivate ? false : true), jwk.key_ops ?? keyUsages);
}
