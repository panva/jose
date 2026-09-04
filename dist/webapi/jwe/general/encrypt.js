import { assertNotSet } from "../../lib/helpers.js";
import { JWEInvalid } from "../../util/errors.js";
import { generateCek } from "../../lib/content_encryption.js";
import { encode as b64u } from "../../util/base64url.js";
import { checkDisjoint, checkEncryptHeaders, createJWE, encryptJWE, transportCek } from "../../lib/jwe_encrypt.js";
import { JWE, isJWECEKTransport, jweAlgorithm } from "../../lib/jwe_algorithms.js";
import { assertUint8Array } from "../../lib/type_checks.js";
class IndividualRecipient {
  #parent;
  state;
  constructor(enc, key, crit) {
    this.#parent = enc, this.state = [void 0, void 0, key, crit];
  }
  setUnprotectedHeader(unprotectedHeader) {
    return assertNotSet(this.state[0], "setUnprotectedHeader"), this.state[0] = unprotectedHeader, this;
  }
  setKeyManagementParameters(parameters) {
    return assertNotSet(this.state[1], "setKeyManagementParameters"), this.state[1] = parameters, this;
  }
  addRecipient(...args) {
    return this.#parent.addRecipient(...args);
  }
  encrypt(...args) {
    return this.#parent.encrypt(...args);
  }
  done() {
    return this.#parent;
  }
}
function copyOptionalMembers(flattened, jwe, recipient) {
  const { aad, protected: protectedHeader, unprotected, header } = flattened;
  aad && (jwe.aad = aad), protectedHeader && (jwe.protected = protectedHeader), unprotected && (jwe.unprotected = unprotected), header && (recipient.header = header);
}
class GeneralEncrypt {
  #plaintext;
  #recipients = [];
  #protectedHeader;
  #unprotectedHeader;
  #aad;
  constructor(plaintext) {
    this.#plaintext = plaintext;
  }
  addRecipient(key, options) {
    const recipient = new IndividualRecipient(this, key, options?.crit);
    return this.#recipients.push(recipient), recipient;
  }
  setProtectedHeader(protectedHeader) {
    return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
  }
  setSharedUnprotectedHeader(sharedUnprotectedHeader) {
    return assertNotSet(this.#unprotectedHeader, "setSharedUnprotectedHeader"), this.#unprotectedHeader = sharedUnprotectedHeader, this;
  }
  setAdditionalAuthenticatedData(aad) {
    return this.#aad = aad, this;
  }
  async encrypt() {
    if (!this.#recipients.length)
      throw new JWEInvalid("at least one recipient must be added");
    if (assertUint8Array(this.#plaintext, "plaintext"), this.#recipients.length === 1) {
      const [unprotectedHeader, keyManagementParameters, key, crit] = this.#recipients[0].state, flattened = await createJWE([
        this.#plaintext,
        this.#protectedHeader,
        unprotectedHeader,
        this.#unprotectedHeader,
        this.#aad,
        void 0,
        void 0,
        keyManagementParameters,
        crit,
        !1
      ], key), jwe2 = {
        ciphertext: flattened.ciphertext,
        recipients: [{}]
      };
      return flattened.iv && (jwe2.iv = flattened.iv), flattened.tag && (jwe2.tag = flattened.tag), flattened.encrypted_key && (jwe2.recipients[0].encrypted_key = flattened.encrypted_key), copyOptionalMembers(flattened, jwe2, jwe2.recipients[0]), jwe2;
    }
    let enc, protectedHeader = this.#protectedHeader, sharedUnprotectedHeader = this.#unprotectedHeader;
    const inputs = [], checked = [];
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i], [unprotectedHeader, keyManagementParameters, , crit] = recipient.state, input = [
        this.#plaintext,
        protectedHeader,
        unprotectedHeader,
        sharedUnprotectedHeader,
        this.#aad,
        void 0,
        void 0,
        keyManagementParameters,
        crit,
        !0
      ], headers = checkEncryptHeaders(input);
      inputs.push(input), checked.push(headers), i === 0 && (protectedHeader = input[1], sharedUnprotectedHeader = input[3]);
      const algEntry = JWE[headers[1]];
      if (algEntry && !isJWECEKTransport(algEntry))
        throw new JWEInvalid(`"${headers[1]}" alg may only have a single recipient`);
      if (!enc)
        enc = headers[2];
      else if (enc !== headers[2])
        throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
    }
    const algEntries = checked.map(([, alg]) => {
      const algEntry = jweAlgorithm(alg);
      if (!isJWECEKTransport(algEntry))
        throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
      return algEntry;
    }), cek = generateCek(checked[0][3]), jwe = {
      ciphertext: "",
      recipients: []
    };
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i], [, keyManagementParameters, key] = recipient.state, target = {};
      if (jwe.recipients.push(target), i === 0) {
        inputs[0][5] = cek;
        const flattened = await encryptJWE(inputs[0], checked[0], key, algEntries[0]);
        jwe.ciphertext = flattened.ciphertext, flattened.iv && (jwe.iv = flattened.iv), flattened.tag && (jwe.tag = flattened.tag), flattened.encrypted_key && (target.encrypted_key = flattened.encrypted_key), copyOptionalMembers(flattened, jwe, target);
        continue;
      }
      const [joseHeader, , , encEntry] = checked[i], unprotectedHeader = inputs[i][2], [, encryptedKey, parameters] = await transportCek(algEntries[i], encEntry, key, cek, joseHeader, keyManagementParameters);
      if (target.encrypted_key = b64u(encryptedKey), unprotectedHeader || parameters) {
        const header = { ...unprotectedHeader, ...parameters };
        parameters && checkDisjoint(inputs[i][1], header, inputs[i][3]), target.header = header;
      }
    }
    return jwe;
  }
}
export {
  GeneralEncrypt
};
