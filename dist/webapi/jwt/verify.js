import { prepareVerify, verifyCompact } from '../lib/jws_verify.js';
import { validateClaimsSet } from '../lib/jwt_claims_set.js';
import { JWTInvalid } from '../util/errors.js';
export async function jwtVerify(jwt, key, options) {
    const verified = await verifyCompact(jwt, prepareVerify(options), key);
    if (!verified.b64) {
        throw new JWTInvalid('JWTs MUST NOT use unencoded payload');
    }
    const payload = validateClaimsSet(verified.parsedProt, verified.payload, options);
    const result = { payload, protectedHeader: verified.parsedProt };
    if (typeof key === 'function') {
        return { ...result, key: verified.key };
    }
    return result;
}
