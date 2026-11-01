import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
import { compactJWE, createJWE } from "../../lib/jwe_encrypt.js";
class CompactEncrypt {
  #input;
  constructor(plaintext) {
    assertUint8Array(plaintext, "plaintext"), this.#input = [plaintext];
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#input[5], "setContentEncryptionKey"), this.#input[5] = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#input[6], "setInitializationVector"), this.#input[6] = iv, this;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#input[7], "setKeyManagementParameters"), this.#input[7] = parameters, this;
  }
  async encrypt(key, options) {
    return compactJWE(await createJWE([...this.#input], key, options));
  }
}
export {
  CompactEncrypt
};
