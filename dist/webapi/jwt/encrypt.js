import { createJWE } from "../lib/jwe_encrypt.js";
import { JWTClaimsBuilder, jwtClaim, jwtData } from "../lib/jwt_claims_set.js";
import { assertNotSet } from "../lib/helpers.js";
const EncryptJWT_base = JWTClaimsBuilder;
class EncryptJWT extends EncryptJWT_base {
  #cek;
  #iv;
  #keyManagementParameters;
  #protectedHeader;
  #replicateIssuerAsHeader;
  #replicateSubjectAsHeader;
  #replicateAudienceAsHeader;
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters"), this.#keyManagementParameters = parameters, this;
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#cek, "setContentEncryptionKey"), this.#cek = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#iv, "setInitializationVector"), this.#iv = iv, this;
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
    const plaintext = jwtData(this);
    this.#protectedHeader && (this.#replicateIssuerAsHeader || this.#replicateSubjectAsHeader || this.#replicateAudienceAsHeader) && (this.#protectedHeader = {
      ...this.#protectedHeader,
      iss: this.#replicateIssuerAsHeader ? jwtClaim(this, "iss") : void 0,
      sub: this.#replicateSubjectAsHeader ? jwtClaim(this, "sub") : void 0,
      aud: this.#replicateAudienceAsHeader ? jwtClaim(this, "aud") : void 0
    });
    const jwe = await createJWE([
      plaintext,
      this.#protectedHeader,
      void 0,
      void 0,
      void 0,
      this.#cek,
      this.#iv,
      this.#keyManagementParameters,
      void 0,
      !1
    ], key, options);
    return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join(".");
  }
}
export {
  EncryptJWT
};
