import { encode as b64u } from "../util/base64url.js";
import { prepareKey } from "./key.js";
import { jwkToKey } from "./jwk_to_key.js";
import { jweAlgorithm, jweEncryption } from "./jwe_algorithms.js";
import { JOSENotSupported, JWEInvalid } from "../util/errors.js";
import { decodeBase64url, digest } from "./helpers.js";
import { generateCek, encrypt, decrypt } from "./content_encryption.js";
import { assertUint8Array, isObject } from "./type_checks.js";
import { checkCryptoKey, checkModulusLength, checkUsage } from "./crypto_key.js";
import { concat, encode, uint32be } from "./buffer_utils.js";
import { assertCryptoKey } from "./is_key_like.js";
function checkEcdhCryptoKey(key, usage) {
  if (key.algorithm.name !== "ECDH" && key.algorithm.name !== "X25519")
    throw new TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
  checkUsage(key, usage);
}
async function aeskwCryptoKey(key, alg, usage) {
  const expected = jweAlgorithm(alg).subtle, cryptoKey = key instanceof Uint8Array ? await crypto.subtle.importKey("raw", key, "AES-KW", !0, [
    usage
  ]) : key;
  return checkCryptoKey(cryptoKey, expected, usage), cryptoKey;
}
async function aeskwWrap(alg, key, cek) {
  const cryptoKey = await aeskwCryptoKey(key, alg, "wrapKey"), cryptoKeyCek = await crypto.subtle.importKey("raw", cek, { hash: "SHA-256", name: "HMAC" }, !0, ["sign"]);
  return new Uint8Array(await crypto.subtle.wrapKey("raw", cryptoKeyCek, cryptoKey, "AES-KW"));
}
async function aeskwUnwrap(alg, key, encryptedKey) {
  const cryptoKey = await aeskwCryptoKey(key, alg, "unwrapKey"), cryptoKeyCek = await crypto.subtle.unwrapKey("raw", encryptedKey, cryptoKey, "AES-KW", { hash: "SHA-256", name: "HMAC" }, !0, ["sign"]);
  return new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKeyCek));
}
function checkRsaKey(alg, key, usage) {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, usage), checkModulusLength(alg, key);
}
function pbes2CryptoKey(key, alg) {
  return key instanceof Uint8Array ? crypto.subtle.importKey("raw", key, "PBKDF2", !1, [
    "deriveBits"
  ]) : (checkCryptoKey(key, jweAlgorithm(alg).subtle, "deriveBits"), key);
}
async function deriveKey(p2s, alg, p2c, key) {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8)
    throw new JWEInvalid("PBES2 Salt Input must be 8 or more octets");
  if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1)
    throw new JWEInvalid("PBES2 Count Input must be a positive integer");
  const salt = concat(encode(alg), Uint8Array.of(0), p2s), keylen = parseInt(alg.slice(13, 16), 10), subtleAlg = {
    hash: `SHA-${alg.slice(8, 11)}`,
    iterations: p2c,
    name: "PBKDF2",
    salt
  }, cryptoKey = await pbes2CryptoKey(key, alg);
  return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
}
function lengthAndInput(input) {
  return concat(uint32be(input.length), input);
}
async function concatKdf(Z, L, OtherInfo) {
  const dkLen = L >> 3, hashLen = 32, reps = Math.ceil(dkLen / hashLen), dk = new Uint8Array(reps * hashLen);
  for (let i = 1; i <= reps; i++) {
    const hashResult = await digest("sha256", concat(uint32be(i), Z, OtherInfo));
    dk.set(hashResult, (i - 1) * hashLen);
  }
  return dk.slice(0, dkLen);
}
async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
  checkEcdhCryptoKey(publicKey), checkEcdhCryptoKey(privateKey, "deriveBits");
  const otherInfo = concat(lengthAndInput(encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength)), Z = new Uint8Array(await crypto.subtle.deriveBits({
    name: publicKey.algorithm.name,
    public: publicKey
  }, privateKey, publicKey.algorithm.name === "X25519" ? 256 : Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3));
  return concatKdf(Z, keyLength, otherInfo);
}
function assertEcdhKey(key) {
  assertCryptoKey(key);
  const curve = key.algorithm.namedCurve;
  if (curve !== "P-256" && curve !== "P-384" && curve !== "P-521" && key.algorithm.name !== "X25519")
    throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
}
function partyInfo(joseHeader, name) {
  const value = joseHeader[name];
  if (value !== void 0) {
    if (typeof value != "string")
      throw new JWEInvalid(`JOSE Header "${name}" (Agreement Party${name === "apu" ? "U" : "V"}Info) invalid`);
    return decodeBase64url(value, name, JWEInvalid);
  }
}
function checkPartyInfo(apu, apv) {
  if (!(apu === void 0 || apv === void 0 || apu.byteLength !== apv.byteLength)) {
    for (let i = 0; i < apu.byteLength; i++)
      if (apu[i] !== apv[i])
        return;
    throw new JWEInvalid('JOSE Header "apu" and "apv" values must be distinct');
  }
}
function assertEncryptedKey(encryptedKey) {
  if (encryptedKey === void 0)
    throw new JWEInvalid("JWE Encrypted Key missing");
}
function assertNoEncryptedKey(encryptedKey) {
  if (encryptedKey !== void 0)
    throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
}
function validateMaxPBES2Count(value) {
  if (value !== void 0 && value !== 1 / 0 && (!Number.isSafeInteger(value) || value < 1))
    throw new TypeError("maxPBES2Count must be a positive safe integer or Infinity");
}
async function decryptKeyManagement(entry, enc, key, encryptedKey, joseHeader, maxPBES2Count) {
  const { alg } = entry, mode = entry.mode;
  switch (mode) {
    case "direct-encryption":
      return assertNoEncryptedKey(encryptedKey), key;
    case "direct-key-agreement":
    case "key-wrapping":
    case "key-encryption":
    case "key-agreement-with-key-wrapping":
      break;
  }
  switch (entry.subtle.name) {
    case "ECDH": {
      const direct = mode === "direct-key-agreement";
      direct && assertNoEncryptedKey(encryptedKey);
      const { epk } = joseHeader;
      if (!isObject(epk) || ["d", "k", "p", "q", "dp", "dq", "qi", "oth", "priv"].some((parameter) => Object.hasOwn(epk, parameter)))
        throw new JWEInvalid('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
      assertEcdhKey(key);
      const ephemeralPublicKey = await jwkToKey(entry, epk), partyUInfo = partyInfo(joseHeader, "apu"), partyVInfo = partyInfo(joseHeader, "apv");
      checkPartyInfo(partyUInfo, partyVInfo);
      const sharedSecret = await ecdhesDeriveKey(ephemeralPublicKey, key, direct ? enc.alg : alg, direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
      return direct ? sharedSecret : (assertEncryptedKey(encryptedKey), aeskwUnwrap(alg.slice(-6), sharedSecret, encryptedKey));
    }
    case "RSA-OAEP":
      return assertEncryptedKey(encryptedKey), assertCryptoKey(key), checkRsaKey(alg, key, "decrypt"), new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", key, encryptedKey));
    case "PBKDF2": {
      if (assertEncryptedKey(encryptedKey), typeof joseHeader.p2c != "number")
        throw new JWEInvalid('JOSE Header "p2c" (PBES2 Count) missing or invalid');
      validateMaxPBES2Count(maxPBES2Count);
      const p2cLimit = maxPBES2Count ?? 1e4;
      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
      if (typeof joseHeader.p2s != "string")
        throw new JWEInvalid('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
      const p2s = decodeBase64url(joseHeader.p2s, "p2s", JWEInvalid), derived = await deriveKey(p2s, alg, joseHeader.p2c, key);
      return aeskwUnwrap(alg.slice(-6), derived, encryptedKey);
    }
    case "AES-KW":
      return assertEncryptedKey(encryptedKey), aeskwUnwrap(alg, key, encryptedKey);
    case "AES-GCM": {
      if (assertEncryptedKey(encryptedKey), typeof joseHeader.iv != "string")
        throw new JWEInvalid('JOSE Header "iv" (Initialization Vector) missing or invalid');
      if (typeof joseHeader.tag != "string")
        throw new JWEInvalid('JOSE Header "tag" (Authentication Tag) missing or invalid');
      let iv;
      iv = decodeBase64url(joseHeader.iv, "iv", JWEInvalid);
      let tag;
      if (tag = decodeBase64url(joseHeader.tag, "tag", JWEInvalid), iv.byteLength !== 12)
        throw new JWEInvalid("Invalid Initialization Vector length");
      if (tag.byteLength !== 16)
        throw new JWEInvalid("Invalid Authentication Tag length");
      return decrypt(jweEncryption(alg.slice(0, -2)), key, encryptedKey, iv, tag, new Uint8Array());
    }
  }
}
async function encryptKeyManagement(entry, enc, key, joseHeader, providedCek, providedParameters = {}) {
  let encryptedKey, parameters, cek;
  const { alg } = entry, mode = entry.mode;
  switch (mode) {
    case "direct-encryption":
      return [key, void 0, void 0];
    case "direct-key-agreement":
    case "key-wrapping":
    case "key-encryption":
    case "key-agreement-with-key-wrapping":
      break;
  }
  switch (entry.subtle.name) {
    case "ECDH": {
      assertEcdhKey(key);
      const { apu: providedApu, apv: providedApv } = providedParameters;
      providedApu !== void 0 && assertUint8Array(providedApu, '"apu"'), providedApv !== void 0 && assertUint8Array(providedApv, '"apv"');
      const apu = providedApu ?? partyInfo(joseHeader, "apu"), apv = providedApv ?? partyInfo(joseHeader, "apv");
      checkPartyInfo(apu, apv);
      let ephemeralKey;
      providedParameters.epk !== void 0 ? ephemeralKey = await prepareKey(entry, providedParameters.epk, "decrypt") : ephemeralKey = (await crypto.subtle.generateKey(key.algorithm, !0, ["deriveBits"])).privateKey;
      const subtle = crypto.subtle;
      let exportableEpk = ephemeralKey;
      if (!exportableEpk.extractable) {
        if (typeof subtle.getPublicKey != "function")
          throw new TypeError('CryptoKey for "epk" must be extractable');
        exportableEpk = await subtle.getPublicKey(ephemeralKey, []);
      }
      const { x, y, crv, kty } = await subtle.exportKey("jwk", exportableEpk), direct = mode === "direct-key-agreement", sharedSecret = await ecdhesDeriveKey(key, ephemeralKey, direct ? enc.alg : alg, direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), apu, apv);
      if (parameters = { epk: { x, crv, kty } }, kty === "EC" && (parameters.epk.y = y), providedApu !== void 0 && (parameters.apu = b64u(providedApu)), providedApv !== void 0 && (parameters.apv = b64u(providedApv)), direct) {
        cek = sharedSecret;
        break;
      }
      cek = providedCek ?? generateCek(enc);
      const kwAlg = alg.slice(-6);
      encryptedKey = await aeskwWrap(kwAlg, sharedSecret, cek);
      break;
    }
    case "RSA-OAEP": {
      cek = providedCek ?? generateCek(enc), assertCryptoKey(key), checkRsaKey(alg, key, "encrypt"), encryptedKey = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", key, cek));
      break;
    }
    case "PBKDF2": {
      cek = providedCek ?? generateCek(enc);
      const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters, derived = await deriveKey(p2s, alg, p2c, key);
      encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek), parameters = { p2c, p2s: b64u(p2s) };
      break;
    }
    case "AES-KW": {
      cek = providedCek ?? generateCek(enc), encryptedKey = await aeskwWrap(alg, key, cek);
      break;
    }
    case "AES-GCM": {
      cek = providedCek ?? generateCek(enc);
      const iv = providedParameters.iv === void 0 ? crypto.getRandomValues(new Uint8Array(12)) : providedParameters.iv;
      if (!(iv instanceof Uint8Array))
        throw new TypeError('"iv" must be an instance of Uint8Array');
      const wrapped = await encrypt(jweEncryption(alg.slice(0, -2)), cek, key, iv, new Uint8Array());
      encryptedKey = wrapped.ciphertext, parameters = { iv: b64u(wrapped.iv), tag: b64u(wrapped.tag) };
      break;
    }
  }
  if (cek === void 0)
    throw new TypeError("Invalid JWE key management algorithm");
  return [cek, encryptedKey, parameters];
}
export {
  decryptKeyManagement,
  encryptKeyManagement,
  validateMaxPBES2Count
};
