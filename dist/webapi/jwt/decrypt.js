import { prepareDecrypt, decryptCompact } from '../lib/jwe_decrypt.js';
import { validateClaimsSet } from '../lib/jwt_claims_set.js';
import { JWTClaimValidationFailed } from '../util/errors.js';
export async function jwtDecrypt(jwt, key, options) {
    const decrypted = await decryptCompact(jwt, prepareDecrypt(options), key);
    const protectedHeader = decrypted[1];
    const payload = validateClaimsSet(protectedHeader, decrypted[0], options);
    for (const claim of ['iss', 'sub', 'aud']) {
        if (protectedHeader[claim] !== undefined &&
            (claim === 'aud'
                ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
                : protectedHeader[claim] !== payload[claim])) {
            throw new JWTClaimValidationFailed(`replicated "${claim}" claim header parameter mismatch`, payload, claim, 'mismatch');
        }
    }
    const result = { payload, protectedHeader };
    if (typeof key === 'function') {
        return { ...result, key: decrypted[2] };
    }
    return result;
}
