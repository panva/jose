import { assertNotSet, assertUint8Array } from "../../lib/validate.js";
import { JWEInvalid } from "../../util/errors.js";
import { generateCek } from "../../lib/content_encryption.js";
import { encode as b64u } from "../../util/base64url.js";
import { checkDisjoint, checkEncryptHeaders, encryptJWE } from "../../lib/jwe_encrypt.js";
import { encryptKeyManagement } from "../../lib/key_management.js";
import { isJWECEKTransport, jweAlgorithm } from "../../lib/jwe_algorithms.js";
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
    assertUint8Array(this.#plaintext, "plaintext");
    const multiple = this.#recipients.length > 1;
    let enc, protectedHeader = this.#protectedHeader, sharedUnprotectedHeader = this.#unprotectedHeader;
    const recipients = [];
    for (const recipient of this.#recipients) {
      const [unprotectedHeader, keyManagementParameters, key, crit] = recipient.state, input = [
        this.#plaintext,
        protectedHeader,
        unprotectedHeader,
        sharedUnprotectedHeader,
        this.#aad,
        void 0,
        void 0,
        keyManagementParameters,
        crit,
        multiple
      ], headers = checkEncryptHeaders(input, void 0, recipients.length > 0);
      recipients.length || (protectedHeader = input[1], sharedUnprotectedHeader = input[3]), recipients.push([input, headers, key]);
      const [{ alg, enc: recipientEnc }, , algEntry] = headers;
      if (multiple && algEntry && !isJWECEKTransport(algEntry))
        throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
      if (!enc)
        enc = recipientEnc;
      else if (enc !== recipientEnc)
        throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
    }
    for (const [, headers] of recipients)
      headers[2] ??= jweAlgorithm(headers[0].alg);
    const [firstInput, firstHeaders, firstKey] = recipients[0], cek = multiple ? generateCek(firstHeaders[1]) : void 0;
    firstInput[5] = cek;
    const { encrypted_key, header, ...shared } = await encryptJWE(firstInput, firstHeaders, firstKey), jwe = {
      ...shared,
      recipients: [{}]
    };
    encrypted_key && (jwe.recipients[0].encrypted_key = encrypted_key), header && (jwe.recipients[0].header = header);
    for (let i = 1; i < recipients.length; i++) {
      const [input, [joseHeader, encEntry, algEntry], key] = recipients[i], unprotectedHeader = input[2], [, encryptedKey, parameters] = await encryptKeyManagement(algEntry, encEntry, key, joseHeader, cek, input[7]), target = {
        encrypted_key: b64u(encryptedKey)
      };
      if (unprotectedHeader || parameters) {
        const header2 = { ...unprotectedHeader, ...parameters };
        parameters && checkDisjoint(input[1], header2, input[3]), target.header = header2;
      }
      jwe.recipients.push(target);
    }
    return jwe;
  }
}
export {
  GeneralEncrypt
};
