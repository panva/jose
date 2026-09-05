import { createSignature } from "../../lib/jws_sign.js";
import { JWSInvalid } from "../../util/errors.js";
import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
class IndividualSignature {
  #parent;
  state;
  constructor(sig, key, options) {
    this.#parent = sig, this.state = [void 0, void 0, key, options?.crit];
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.state[0], "setProtectedHeader"), this.state[0] = protectedHeader, this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    return assertNotSet(this.state[1], "setUnprotectedHeader"), this.state[1] = unprotectedHeader, this;
  }
  addSignature(...args) {
    return this.#parent.addSignature(...args);
  }
  sign(...args) {
    return this.#parent.sign(...args);
  }
  done() {
    return this.#parent;
  }
}
class GeneralSign {
  #payload;
  #signatures = [];
  constructor(payload) {
    this.#payload = payload;
  }
  addSignature(key, options) {
    const signature = new IndividualSignature(this, key, options);
    return this.#signatures.push(signature), signature;
  }
  async sign() {
    if (!this.#signatures.length)
      throw new JWSInvalid("at least one signature must be added");
    assertUint8Array(this.#payload, "payload");
    const jws = {
      signatures: [],
      payload: ""
    }, encoded = [];
    let b64;
    for (const signature of this.#signatures) {
      const [protectedHeader, unprotectedHeader, key, crit] = signature.state, [{ payload, ...rest }, signatureB64] = await createSignature([this.#payload, protectedHeader, unprotectedHeader, crit, encoded], key);
      if (b64 === void 0)
        b64 = signatureB64, jws.payload = payload;
      else if (b64 !== signatureB64)
        throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
      jws.signatures.push(rest);
    }
    return jws;
  }
}
export {
  GeneralSign
};
