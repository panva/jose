import { createCompactSignature } from "../../lib/jws_sign.js";
import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
class CompactSign {
  #payload;
  #protectedHeader;
  constructor(payload) {
    assertUint8Array(payload, "payload"), this.#payload = payload;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  async sign(key, options) {
    return createCompactSignature(this.#payload, this.#protectedHeader, options?.crit, key, () => {
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    });
  }
}
export {
  CompactSign
};
