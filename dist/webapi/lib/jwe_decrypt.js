import { decrypt, generateCek } from "./content_encryption.js";
import { decodeBase64url, encodeBase64url, parseJoseHeader } from "./helpers.js";
import { JOSEAlgNotAllowed, JOSENotSupported, JWEInvalid } from "../util/errors.js";
import { isDisjoint, isObject } from "./type_checks.js";
import { decryptKeyManagement } from "./key_management.js";
import { concat, decoder, encode } from "./buffer_utils.js";
import { validateCrit, validateAlgorithms, JWE_RECOGNIZED } from "./options.js";
import { prepareKey } from "./key.js";
import { JWE, invalidJWEKeyManagementMode, isJWECEKTransport, jweAlgorithm, jweEncryption } from "./jwe_algorithms.js";
import { decompress, validateZip } from "./deflate.js";
function snapshotSharedJWE(jwe) {
  const { aad, ciphertext, iv, protected: encodedProtected, tag, unprotected } = jwe;
  if (iv !== void 0 && (typeof iv != "string" || !iv))
    throw new JWEInvalid("JWE Initialization Vector incorrect type");
  if (typeof ciphertext != "string")
    throw new JWEInvalid("JWE Ciphertext missing or incorrect type");
  if (tag !== void 0 && (typeof tag != "string" || !tag))
    throw new JWEInvalid("JWE Authentication Tag incorrect type");
  if (encodedProtected !== void 0 && typeof encodedProtected != "string")
    throw new JWEInvalid("JWE Protected Header incorrect type");
  if (aad !== void 0 && (typeof aad != "string" || !aad))
    throw new JWEInvalid("JWE AAD incorrect type");
  if (unprotected !== void 0 && !isObject(unprotected))
    throw new JWEInvalid("JWE Shared Unprotected Header incorrect type");
  return {
    aad,
    ciphertext,
    iv,
    protected: encodedProtected,
    tag,
    unprotected: unprotected === void 0 ? void 0 : { ...unprotected }
  };
}
function snapshotRecipientJWE(recipient) {
  let header, headerAlg;
  try {
    const { header: inputHeader } = recipient;
    if (isObject(inputHeader)) {
      headerAlg = inputHeader.alg;
      const parameters = Object.keys(inputHeader);
      parameters.includes("alg") || (headerAlg = void 0), header = Object.fromEntries(parameters.map((parameter) => [
        parameter,
        parameter === "alg" ? headerAlg : inputHeader[parameter]
      ]));
    } else
      header = inputHeader;
  } catch (error) {
    return [void 0, headerAlg, error];
  }
  try {
    const { encrypted_key: encryptedKey } = recipient;
    return [{ encrypted_key: encryptedKey, header }, headerAlg];
  } catch (error) {
    return [void 0, headerAlg, error];
  }
}
function checkRecipient(jwe) {
  const { encrypted_key: encryptedKey, header } = jwe;
  if (encryptedKey !== void 0 && typeof encryptedKey != "string")
    throw new JWEInvalid("JWE Encrypted Key incorrect type");
  if (header !== void 0 && !isObject(header))
    throw new JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
  if (jwe.protected === void 0 && header === void 0 && jwe.unprotected === void 0)
    throw new JWEInvalid("JOSE Header missing");
}
function shareJWE(jwe) {
  const { protected: encodedProtected, ciphertext, iv, tag, aad } = jwe;
  let parsedProt;
  encodedProtected !== void 0 && (parsedProt = parseJoseHeader(encodedProtected, JWEInvalid, "JWE Protected Header is invalid"));
  const protectedHeader = encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array();
  return [
    parsedProt,
    decodeBase64url(ciphertext, "ciphertext", JWEInvalid),
    iv !== void 0 ? decodeBase64url(iv, "iv", JWEInvalid) : void 0,
    tag !== void 0 ? decodeBase64url(tag, "tag", JWEInvalid) : void 0,
    aad !== void 0 ? concat(protectedHeader, encode("."), encodeBase64url(aad, "aad", JWEInvalid)) : protectedHeader
  ];
}
function decryptResult(jwe, decrypted) {
  const [plaintext, parsedProt, key, resolvedKey] = decrypted, { protected: encodedProtected, aad, unprotected, header } = jwe, result = { plaintext };
  return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), aad !== void 0 && (result.additionalAuthenticatedData = decodeBase64url(aad, "aad", JWEInvalid)), unprotected !== void 0 && (result.sharedUnprotectedHeader = unprotected), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? { ...result, key } : result;
}
function prepareDecrypt(options) {
  return [
    options && validateAlgorithms("keyManagementAlgorithms", options.keyManagementAlgorithms),
    options && validateAlgorithms("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms),
    options?.crit,
    options?.maxPBES2Count,
    options?.maxDecompressedLength
  ];
}
async function decryptRecipient(jwe, token, shared, key) {
  const [parsedProt] = token, { header, unprotected } = jwe;
  let joseHeader;
  if (header !== void 0 || unprotected !== void 0) {
    if (!isDisjoint(parsedProt, header, unprotected))
      throw new JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
    joseHeader = { ...parsedProt, ...header, ...unprotected };
  } else
    joseHeader = parsedProt ?? {};
  return decryptRecipientCore(jwe, token, shared, key, joseHeader);
}
async function decryptRecipientCore(jwe, token, shared, key, joseHeader) {
  const [keyManagementAlgorithms, contentEncryptionAlgorithms, crit, maxPBES2Count, maxDecompressedLength] = shared, [parsedProt, ciphertext, iv, tag, additionalData] = token, { encrypted_key: encodedKey } = jwe;
  validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, parsedProt, joseHeader), validateZip(joseHeader, parsedProt);
  const { alg, enc } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
  const selected = JWE[alg];
  if (encodedKey === "" && (!selected || !isJWECEKTransport(selected)))
    throw new JWEInvalid("JWE Encrypted Key incorrect type");
  const integrated = selected?.mode === "integrated-encryption";
  if (!integrated && (typeof enc != "string" || !enc))
    throw new JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
  if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg) || !keyManagementAlgorithms && alg.startsWith("PBES2"))
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  let encEntry;
  if (integrated) {
    if (enc !== void 0)
      throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
    if (iv?.byteLength)
      throw new JWEInvalid("JWE Initialization Vector must be empty for integrated encryption");
    if (tag?.byteLength)
      throw new JWEInvalid("JWE Authentication Tag must be empty for integrated encryption");
  } else {
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc))
      throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
    encEntry = jweEncryption(enc);
  }
  let encryptedKey;
  if (encodedKey !== void 0)
    try {
      encryptedKey = decodeBase64url(encodedKey, "encrypted_key", JWEInvalid);
    } catch (error) {
      if (!selected || !isJWECEKTransport(selected))
        throw error;
      encryptedKey = new Uint8Array();
    }
  let resolvedKey = !1;
  typeof key == "function" && (key = await key(parsedProt, jwe), resolvedKey = !0);
  const algEntry = selected ?? jweAlgorithm(alg);
  isJWECEKTransport(algEntry) && encryptedKey === void 0 && (encryptedKey = new Uint8Array());
  let k;
  const mode = algEntry.mode;
  switch (mode) {
    case "direct-encryption":
      k = await prepareKey(encEntry, key, "decrypt");
      break;
    case "direct-key-agreement":
    case "key-wrapping":
    case "key-encryption":
    case "key-agreement-with-key-wrapping":
    case "integrated-encryption":
      k = await prepareKey(algEntry, key, "decrypt");
      break;
    default:
      invalidJWEKeyManagementMode(mode);
  }
  let plaintext;
  if (algEntry.mode === "integrated-encryption")
    plaintext = await algEntry.decrypt(k, encryptedKey, ciphertext, additionalData, parsedProt, joseHeader);
  else {
    const encryption = encEntry;
    let cek;
    try {
      cek = await decryptKeyManagement(algEntry, encryption, k, encryptedKey, joseHeader, maxPBES2Count), isJWECEKTransport(algEntry) && cek instanceof Uint8Array && cek.byteLength << 3 !== encryption.cekBits && (cek = generateCek(encryption));
    } catch (err) {
      if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported)
        throw err;
      cek = generateCek(encryption);
    }
    plaintext = await decrypt(encryption, cek, ciphertext, iv, tag, additionalData);
  }
  if (joseHeader.zip === "DEF") {
    const decompressionLimit = maxDecompressedLength ?? 25e4;
    if (decompressionLimit === 0)
      throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    if (decompressionLimit !== 1 / 0 && (!Number.isSafeInteger(decompressionLimit) || decompressionLimit < 1))
      throw new TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
    plaintext = await decompress(plaintext, decompressionLimit).catch((cause) => {
      throw cause instanceof JWEInvalid ? cause : new JWEInvalid("Failed to decompress plaintext", { cause });
    });
  }
  return [plaintext, parsedProt, k, resolvedKey];
}
async function decryptJWE(jwe, shared, key) {
  return decryptRecipient(jwe, shareJWE(jwe), shared, key);
}
async function decryptCompact(jwe, shared, key) {
  if (jwe instanceof Uint8Array && (jwe = decoder.decode(jwe)), typeof jwe != "string")
    throw new JWEInvalid("Compact JWE must be a string or Uint8Array");
  const { 0: protectedHeader, 1: encryptedKey, 2: iv, 3: ciphertext, 4: tag, length } = jwe.split(".");
  if (length !== 5)
    throw new JWEInvalid("Invalid Compact JWE");
  const flattened = {
    ciphertext,
    iv: iv || void 0,
    protected: protectedHeader,
    tag: tag || void 0,
    encrypted_key: encryptedKey || void 0
  }, parsedProt = parseJoseHeader(protectedHeader, JWEInvalid, "JWE Protected Header is invalid"), protectedBytes = encode(protectedHeader), token = [
    parsedProt,
    decodeBase64url(ciphertext, "ciphertext", JWEInvalid),
    iv ? decodeBase64url(iv, "iv", JWEInvalid) : void 0,
    tag ? decodeBase64url(tag, "tag", JWEInvalid) : void 0,
    protectedBytes
  ];
  return decryptRecipientCore(flattened, token, shared, key, parsedProt);
}
export {
  checkRecipient,
  decryptCompact,
  decryptJWE,
  decryptRecipient,
  decryptResult,
  prepareDecrypt,
  shareJWE,
  snapshotRecipientJWE,
  snapshotSharedJWE
};
