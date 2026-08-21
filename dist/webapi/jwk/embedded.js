import { jwkToKey } from '../lib/jwk_to_key.js';
import { jwsAlgorithm } from '../lib/jws_algorithms.js';
import { isObject } from '../lib/type_checks.js';
import { JWSInvalid } from '../util/errors.js';
import { normalizeJwk } from '../lib/jwk_metadata.js';
export async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token?.header,
    };
    if (!isObject(joseHeader.jwk)) {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    let jwk;
    try {
        jwk = normalizeJwk(joseHeader.jwk);
    }
    catch (cause) {
        throw new JWSInvalid('Invalid Embedded JWK', { cause });
    }
    const entry = jwsAlgorithm(joseHeader.alg);
    if (jwk.use !== undefined && jwk.use !== 'sig') {
        throw new JWSInvalid('Invalid Embedded JWK, its "use" must be "sig" when present');
    }
    if (jwk.alg !== undefined && jwk.alg !== entry.alg) {
        throw new JWSInvalid(`Invalid Embedded JWK, its "alg" must be "${entry.alg}" when present`);
    }
    const key = await jwkToKey(entry, { ...jwk, ext: true });
    if (key.type !== 'public') {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
