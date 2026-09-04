import { prepareVerify, verifyCompact } from "../lib/jws_verify.js";
import { validateClaimsSet } from "../lib/jwt_claims_set.js";
import { JWTInvalid } from "../util/errors.js";
async function jwtVerify(jwt, key, options) {
  const verified = await verifyCompact(jwt, prepareVerify(options), key);
  if (!verified[2])
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  const result = { payload: validateClaimsSet(verified[1], verified[0], options), protectedHeader: verified[1] };
  return typeof key == "function" ? { ...result, key: verified[3] } : result;
}
export {
  jwtVerify
};
