import { jwkToKey } from '../lib/jwk_to_key.js';
import { jwsAlgorithm } from '../lib/jws_algorithms.js';
import { isObject } from '../lib/type_checks.js';
import { JWSInvalid } from '../util/errors.js';
export async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token?.header,
    };
    if (!isObject(joseHeader.jwk)) {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const entry = jwsAlgorithm(joseHeader.alg);
    const key = await jwkToKey(entry, { ...joseHeader.jwk, ext: true });
    if (key.type !== 'public') {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
