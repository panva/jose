import { createSignature } from "../../lib/jws_sign.js";
import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
class FlattenedSign {
  #input;
  constructor(payload) {
    assertUint8Array(payload, "payload"), this.#input = [payload];
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    return assertNotSet(this.#input[2], "setUnprotectedHeader"), this.#input[2] = unprotectedHeader, this;
  }
  async sign(key, options) {
    const input = [...this.#input];
    input[3] = options?.crit;
    const [jws] = await createSignature(input, key);
    return jws;
  }
}
export {
  FlattenedSign
};
