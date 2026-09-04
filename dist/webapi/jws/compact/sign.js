import { createCompactSignature } from "../../lib/jws_sign.js";
import { assertNotSet } from "../../lib/helpers.js";
class CompactSign {
  #payload;
  #protectedHeader;
  constructor(payload) {
    if (!(payload instanceof Uint8Array))
      throw new TypeError("payload must be an instance of Uint8Array");
    this.#payload = payload;
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
