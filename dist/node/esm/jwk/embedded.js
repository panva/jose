import parseJwk from './parse.js';
import isObject from '../lib/is_object.js';
import { JWSInvalid } from '../util/errors.js';
async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token.header,
    };
    if (!isObject(joseHeader.jwk)) {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = await parseJwk(joseHeader.jwk, joseHeader.alg, true);
    if (key.type !== 'public') {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
export { EmbeddedJWK };
export default EmbeddedJWK;
