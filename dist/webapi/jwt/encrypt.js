import { compactJWE, createJWE } from "../lib/jwe_encrypt.js";
import { JWTClaimsBuilder, jwtClaim, jwtClaimsSetBytes } from "../lib/jwt_claims_set.js";
import { assertNotSet } from "../lib/validate.js";
const EncryptJWT_base = JWTClaimsBuilder;
class EncryptJWT extends EncryptJWT_base {
  #input = [void 0];
  #replicateIssuerAsHeader;
  #replicateSubjectAsHeader;
  #replicateAudienceAsHeader;
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#input[7], "setKeyManagementParameters"), this.#input[7] = parameters, this;
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#input[5], "setContentEncryptionKey"), this.#input[5] = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#input[6], "setInitializationVector"), this.#input[6] = iv, this;
  }
  replicateIssuerAsHeader() {
    return this.#replicateIssuerAsHeader = !0, this;
  }
  replicateSubjectAsHeader() {
    return this.#replicateSubjectAsHeader = !0, this;
  }
  replicateAudienceAsHeader() {
    return this.#replicateAudienceAsHeader = !0, this;
  }
  async encrypt(key, options) {
    const input = [...this.#input];
    if (input[0] = jwtClaimsSetBytes(this), input[1] && (this.#replicateIssuerAsHeader || this.#replicateSubjectAsHeader || this.#replicateAudienceAsHeader)) {
      const header = { ...input[1] };
      this.#replicateIssuerAsHeader && (header.iss = jwtClaim(this, "iss")), this.#replicateSubjectAsHeader && (header.sub = jwtClaim(this, "sub")), this.#replicateAudienceAsHeader && (header.aud = jwtClaim(this, "aud")), input[1] = header;
    }
    return compactJWE(await createJWE(input, key, options));
  }
}
export {
  EncryptJWT
};
