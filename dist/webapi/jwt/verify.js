import { prepareVerify, verifyCompact } from "../lib/jws_verify.js";
import { validateClaimsSet } from "../lib/jwt_claims_set.js";
import { JWTInvalid } from "../util/errors.js";
async function jwtVerify(jwt, key, options) {
  const [verified, b64] = await verifyCompact(jwt, prepareVerify(options), key);
  if (!b64)
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  return { ...verified, payload };
}
export {
  jwtVerify
};
