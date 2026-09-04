import { encode as b64u } from "../util/base64url.js";
import { checkCekLength, encrypt, generateCek } from "./content_encryption.js";
import { encryptKeyManagement } from "./key_management.js";
import { JWEInvalid } from "../util/errors.js";
import { assertUint8Array, isDisjoint, isObject } from "./type_checks.js";
import { concat, encode } from "./buffer_utils.js";
import { serializeJoseHeader, validateCrit, validateCritDuplicates, JWE_RECOGNIZED } from "./options.js";
import { prepareKey } from "./key.js";
import { JWE, invalidJWEKeyManagementMode, isJWECEKTransport, jweAlgorithm, jweEncryption } from "./jwe_algorithms.js";
import { compress, validateZip } from "./deflate.js";
import { unprotected } from "./helpers.js";
function checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader) {
  if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader))
    throw new JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
}
function checkEncryptHeaders(input) {
  let [, protectedHeader, unprotectedHeader, sharedUnprotectedHeader, aad, cek, iv, keyManagementParameters, crit] = input;
  if (aad !== void 0 && assertUint8Array(aad, "JWE Additional Authenticated Data"), cek !== void 0 && assertUint8Array(cek, "JWE Content Encryption Key"), iv !== void 0 && assertUint8Array(iv, "JWE Initialization Vector"), protectedHeader !== void 0 && (protectedHeader = serializeJoseHeader(JWEInvalid, protectedHeader)[0], input[1] = protectedHeader), unprotectedHeader !== void 0 && (unprotectedHeader = serializeJoseHeader(JWEInvalid, unprotectedHeader)[0], input[2] = unprotectedHeader), sharedUnprotectedHeader !== void 0 && (sharedUnprotectedHeader = serializeJoseHeader(JWEInvalid, sharedUnprotectedHeader)[0], input[3] = sharedUnprotectedHeader), keyManagementParameters !== void 0 && !isObject(keyManagementParameters))
    throw new TypeError("JWE Key Management Parameters must be an object");
  checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
  const joseHeader = {
    ...protectedHeader,
    ...unprotectedHeader,
    ...sharedUnprotectedHeader
  };
  validateCritDuplicates(JWEInvalid, protectedHeader), validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, protectedHeader, joseHeader), validateZip(joseHeader, protectedHeader);
  const { alg, enc } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
  if (JWE[alg]?.mode === "integrated-encryption") {
    if (enc !== void 0)
      throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
    if (cek !== void 0)
      throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
    if (iv !== void 0)
      throw new TypeError(`setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
    return [joseHeader, alg, void 0, void 0];
  }
  if (typeof enc != "string" || !enc)
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
  return [joseHeader, alg, enc, jweEncryption(enc)];
}
function checkProducedEncryptedKey(encryptedKey) {
  if (!(encryptedKey instanceof Uint8Array) || !encryptedKey.byteLength)
    throw new TypeError("JWE key management algorithm did not produce an Encrypted Key");
}
async function transportCek(algEntry, encEntry, key, providedCek, joseHeader, providedParameters) {
  const preparedKey = await prepareKey(algEntry, key, "encrypt"), cek = providedCek ?? generateCek(encEntry);
  checkCekLength(cek, encEntry.cekBits);
  const [, encryptedKey, parameters] = await encryptKeyManagement(algEntry, encEntry, preparedKey, joseHeader, cek, providedParameters);
  return checkProducedEncryptedKey(encryptedKey), [cek, encryptedKey, parameters];
}
async function encryptJWE(input, checked, key, resolvedAlgEntry) {
  const [joseHeader, alg, , encEntry] = checked, [inputPlaintext, inputProtectedHeader, inputUnprotectedHeader, sharedUnprotectedHeader, aad, providedCek, inputIv, keyManagementParameters, , unprotectedParameters] = input;
  let protectedHeader = inputProtectedHeader, unprotectedHeader = inputUnprotectedHeader;
  const algEntry = resolvedAlgEntry ?? jweAlgorithm(alg);
  if (providedCek !== void 0 && !isJWECEKTransport(algEntry))
    throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
  let encryptedKey, parameters, cek, integratedKey;
  const mode = algEntry.mode;
  switch (mode) {
    case "direct-encryption":
      cek = await prepareKey(encEntry, key, "encrypt");
      break;
    case "direct-key-agreement": {
      const preparedKey = await prepareKey(algEntry, key, "encrypt");
      [cek, , parameters] = await encryptKeyManagement(algEntry, encEntry, preparedKey, joseHeader, void 0, keyManagementParameters);
      break;
    }
    case "key-wrapping":
    case "key-encryption":
    case "key-agreement-with-key-wrapping":
      [cek, encryptedKey, parameters] = await transportCek(algEntry, encEntry, key, providedCek, joseHeader, keyManagementParameters);
      break;
    case "integrated-encryption":
      integratedKey = await prepareKey(algEntry, key, "encrypt");
      break;
    default:
      invalidJWEKeyManagementMode(mode);
  }
  parameters && (unprotectedParameters ? unprotectedHeader = unprotectedHeader ? { ...unprotectedHeader, ...parameters } : parameters : protectedHeader = protectedHeader ? { ...protectedHeader, ...parameters } : parameters, checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader));
  let protectedHeaderS, protectedHeaderB;
  protectedHeader ? (protectedHeaderS = b64u(JSON.stringify(protectedHeader)), protectedHeaderB = encode(protectedHeaderS)) : (protectedHeaderS = "", protectedHeaderB = new Uint8Array());
  let additionalData, aadMember;
  aad?.byteLength ? (aadMember = b64u(aad), additionalData = concat(protectedHeaderB, encode("."), encode(aadMember))) : additionalData = protectedHeaderB;
  let plaintext = inputPlaintext;
  joseHeader.zip === "DEF" && (plaintext = await compress(plaintext).catch((cause) => {
    throw new JWEInvalid("Failed to compress plaintext", { cause });
  }));
  let ciphertext, tag, iv;
  algEntry.mode === "integrated-encryption" ? [encryptedKey, ciphertext] = await algEntry.encrypt(integratedKey, plaintext, additionalData, protectedHeader, joseHeader, keyManagementParameters) : { ciphertext, tag, iv } = await encrypt(encEntry, plaintext, cek, inputIv, additionalData);
  const jwe = {
    ciphertext: b64u(ciphertext)
  };
  return iv && (jwe.iv = b64u(iv)), tag && (jwe.tag = b64u(tag)), encryptedKey?.byteLength && (jwe.encrypted_key = b64u(encryptedKey)), aadMember && (jwe.aad = aadMember), protectedHeader && (jwe.protected = protectedHeaderS), sharedUnprotectedHeader && (jwe.unprotected = sharedUnprotectedHeader), unprotectedHeader && (jwe.header = unprotectedHeader), jwe;
}
async function createJWE(input, key, options) {
  if (!input[1] && !input[2] && !input[3])
    throw new JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
  return options !== void 0 && (input[8] = options?.crit, input[9] = options ? unprotected in options : !1), encryptJWE(input, checkEncryptHeaders(input), key);
}
export {
  checkDisjoint,
  checkEncryptHeaders,
  createJWE,
  encryptJWE,
  transportCek
};
