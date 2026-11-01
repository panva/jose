import { prepareDecrypt, decryptCompact } from "../lib/jwe_decrypt.js";
import { validateClaimsSet } from "../lib/jwt_claims_set.js";
import { JWTClaimValidationFailed } from "../util/errors.js";
async function jwtDecrypt(jwt, key, options) {
  const { plaintext, ...result } = await decryptCompact(jwt, prepareDecrypt(options), key), { protectedHeader } = result, payload = validateClaimsSet(protectedHeader, plaintext, options);
  for (const claim of ["iss", "sub", "aud"])
    if (protectedHeader[claim] !== void 0 && (claim === "aud" ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud) : protectedHeader[claim] !== payload[claim]))
      throw new JWTClaimValidationFailed(`replicated "${claim}" claim header parameter mismatch`, payload, claim, "mismatch");
  return { payload, ...result };
}
export {
  jwtDecrypt
};
