import { assertNotSet } from "../../lib/helpers.js";
import { assertUint8Array } from "../../lib/type_checks.js";
import { createJWE } from "../../lib/jwe_encrypt.js";
class CompactEncrypt {
  #plaintext;
  #protectedHeader;
  #cek;
  #iv;
  #keyManagementParameters;
  constructor(plaintext) {
    assertUint8Array(plaintext, "plaintext"), this.#plaintext = plaintext;
  }
  setContentEncryptionKey(cek) {
    return assertNotSet(this.#cek, "setContentEncryptionKey"), this.#cek = cek, this;
  }
  setInitializationVector(iv) {
    return assertNotSet(this.#iv, "setInitializationVector"), this.#iv = iv, this;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters"), this.#keyManagementParameters = parameters, this;
  }
  async encrypt(key, options) {
    const jwe = await createJWE([
      this.#plaintext,
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
  CompactEncrypt
};
