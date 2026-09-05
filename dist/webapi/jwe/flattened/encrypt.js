import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
import { createJWE } from "../../lib/jwe_encrypt.js";
class FlattenedEncrypt {
  #input;
  constructor(plaintext) {
    assertUint8Array(plaintext, "plaintext"), this.#input = [plaintext];
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#input[7], "setKeyManagementParameters"), this.#input[7] = parameters, this;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
  }
  setSharedUnprotectedHeader(sharedUnprotectedHeader) {
    return assertNotSet(this.#input[3], "setSharedUnprotectedHeader"), this.#input[3] = sharedUnprotectedHeader, this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    return assertNotSet(this.#input[2], "setUnprotectedHeader"), this.#input[2] = unprotectedHeader, this;
  }
  setAdditionalAuthenticatedData(aad) {
    return this.#input[4] = aad, this;
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#input[5], "setContentEncryptionKey"), this.#input[5] = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#input[6], "setInitializationVector"), this.#input[6] = iv, this;
  }
  async encrypt(key, options) {
    return createJWE([...this.#input], key, options);
  }
}
export {
  FlattenedEncrypt
};
