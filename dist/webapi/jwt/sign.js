import { createCompactSignature } from "../lib/jws_sign.js";
import { JWTInvalid } from "../util/errors.js";
import { JWTClaimsBuilder, jwtData } from "../lib/jwt_claims_set.js";
import { assertNotSet } from "../lib/helpers.js";
const SignJWT_base = JWTClaimsBuilder;
class SignJWT extends SignJWT_base {
  #protectedHeader;
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  async sign(key, options) {
    return createCompactSignature(jwtData(this), this.#protectedHeader, options?.crit, key, () => {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    });
  }
}
export {
  SignJWT
};
