import { prepareDecrypt, decryptCompact } from "../lib/jwe_decrypt.js";
import { validateClaimsSet } from "../lib/jwt_claims_set.js";
import { JWTClaimValidationFailed } from "../util/errors.js";
async function jwtDecrypt(jwt, key, options) {
  const decrypted = await decryptCompact(jwt, prepareDecrypt(options), key), protectedHeader = decrypted[1], payload = validateClaimsSet(protectedHeader, decrypted[0], options);
  for (const claim of ["iss", "sub", "aud"])
    if (protectedHeader[claim] !== void 0 && (claim === "aud" ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud) : protectedHeader[claim] !== payload[claim]))
      throw new JWTClaimValidationFailed(`replicated "${claim}" claim header parameter mismatch`, payload, claim, "mismatch");
  const result = { payload, protectedHeader };
  return typeof key == "function" ? { ...result, key: decrypted[2] } : result;
}
export {
  jwtDecrypt
};
