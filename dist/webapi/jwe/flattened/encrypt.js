import { assertNotSet } from "../../lib/helpers.js";
import { createJWE } from "../../lib/jwe_encrypt.js";
import { assertUint8Array } from "../../lib/type_checks.js";
class FlattenedEncrypt {
  #plaintext;
  #protectedHeader;
  #sharedUnprotectedHeader;
  #unprotectedHeader;
  #aad;
  #cek;
  #iv;
  #keyManagementParameters;
  constructor(plaintext) {
    assertUint8Array(plaintext, "plaintext"), this.#plaintext = plaintext;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters"), this.#keyManagementParameters = parameters, this;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  setSharedUnprotectedHeader(sharedUnprotectedHeader) {
    return assertNotSet(this.#sharedUnprotectedHeader, "setSharedUnprotectedHeader"), this.#sharedUnprotectedHeader = sharedUnprotectedHeader, this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    return assertNotSet(this.#unprotectedHeader, "setUnprotectedHeader"), this.#unprotectedHeader = unprotectedHeader, this;
  }
  setAdditionalAuthenticatedData(aad) {
    return this.#aad = aad, this;
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#cek, "setContentEncryptionKey"), this.#cek = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#iv, "setInitializationVector"), this.#iv = iv, this;
  }
  async encrypt(key, options) {
    return createJWE([
      this.#plaintext,
      this.#protectedHeader,
      this.#unprotectedHeader,
      this.#sharedUnprotectedHeader,
      this.#aad,
      this.#cek,
      this.#iv,
      this.#keyManagementParameters,
      void 0,
      !1
    ], key, options);
  }
}
export {
  FlattenedEncrypt
};
