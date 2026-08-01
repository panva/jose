import { prepareDecrypt, decryptCompact } from '../lib/jwe_decrypt.js';
import { validateClaimsSet } from '../lib/jwt_claims_set.js';
import { JWTClaimValidationFailed } from '../util/errors.js';
export async function jwtDecrypt(jwt, key, options) {
    const decrypted = await decryptCompact(jwt, prepareDecrypt(options), key);
    const protectedHeader = decrypted[1];
    const payload = validateClaimsSet(protectedHeader, decrypted[0], options);
    if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
        throw new JWTClaimValidationFailed('replicated "iss" claim header parameter mismatch', payload, 'iss', 'mismatch');
    }
    if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
        throw new JWTClaimValidationFailed('replicated "sub" claim header parameter mismatch', payload, 'sub', 'mismatch');
    }
    if (protectedHeader.aud !== undefined &&
        JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)) {
        throw new JWTClaimValidationFailed('replicated "aud" claim header parameter mismatch', payload, 'aud', 'mismatch');
    }
    const result = { payload, protectedHeader };
    if (typeof key === 'function') {
        return { ...result, key: decrypted[2] };
    }
    return result;
}
