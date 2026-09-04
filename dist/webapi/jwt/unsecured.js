import * as b64u from "../util/base64url.js";
import { decodeBase64url, parseJoseHeader } from "../lib/helpers.js";
import { JWSInvalid, JWTInvalid } from "../util/errors.js";
import { validateClaimsSet, JWTClaimsBuilder, jwtData } from "../lib/jwt_claims_set.js";
import { JWS_RECOGNIZED, validateB64, validateCrit } from "../lib/options.js";
const UnsecuredJWT_base = JWTClaimsBuilder;
class UnsecuredJWT extends UnsecuredJWT_base {
  encode() {
    const header = b64u.encode(JSON.stringify({ alg: "none" })), payload = b64u.encode(jwtData(this));
    return `${header}.${payload}.`;
  }
  static decode(jwt, options) {
    if (typeof jwt != "string")
      throw new JWTInvalid("Unsecured JWT must be a string");
    const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split(".");
    if (length !== 3 || signature !== "")
      throw new JWTInvalid("Invalid Unsecured JWT");
    let header, b64;
    try {
      header = parseJoseHeader(encodedHeader, JWSInvalid, "JWS Protected Header is invalid");
      const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, void 0, header, header);
      b64 = validateB64(header, extensions);
    } catch (cause) {
      throw cause instanceof JWSInvalid ? new JWTInvalid("Invalid Unsecured JWT", { cause }) : cause;
    }
    if (header.alg !== "none")
      throw new JWTInvalid("Invalid Unsecured JWT");
    if (!b64)
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    return { payload: validateClaimsSet(header, decodeBase64url(encodedPayload, "payload", JWTInvalid), options), header };
  }
}
export {
  UnsecuredJWT
};
