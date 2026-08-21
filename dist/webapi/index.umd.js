(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jose = factory());
})(this, (function () { 'use strict';
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dist/webapi/index.js
  var index_exports = {};
  __export(index_exports, {
    CompactEncrypt: () => CompactEncrypt,
    CompactSign: () => CompactSign,
    EmbeddedJWK: () => EmbeddedJWK,
    EncryptJWT: () => EncryptJWT,
    FlattenedEncrypt: () => FlattenedEncrypt,
    FlattenedSign: () => FlattenedSign,
    GeneralEncrypt: () => GeneralEncrypt,
    GeneralSign: () => GeneralSign,
    SignJWT: () => SignJWT,
    UnsecuredJWT: () => UnsecuredJWT,
    base64url: () => base64url_exports,
    calculateJwkThumbprint: () => calculateJwkThumbprint,
    calculateJwkThumbprintUri: () => calculateJwkThumbprintUri,
    compactDecrypt: () => compactDecrypt,
    compactVerify: () => compactVerify,
    createLocalJWKSet: () => createLocalJWKSet,
    createRemoteJWKSet: () => createRemoteJWKSet,
    cryptoRuntime: () => cryptoRuntime,
    customFetch: () => customFetch,
    decodeJwt: () => decodeJwt,
    decodeProtectedHeader: () => decodeProtectedHeader,
    errors: () => errors_exports,
    exportJWK: () => exportJWK,
    exportPKCS8: () => exportPKCS8,
    exportSPKI: () => exportSPKI,
    flattenedDecrypt: () => flattenedDecrypt,
    flattenedVerify: () => flattenedVerify,
    generalDecrypt: () => generalDecrypt,
    generalVerify: () => generalVerify,
    generateKeyPair: () => generateKeyPair,
    generateSecret: () => generateSecret,
    importJWK: () => importJWK,
    importPKCS8: () => importPKCS8,
    importSPKI: () => importSPKI,
    importX509: () => importX509,
    jwksCache: () => jwksCache,
    jwtDecrypt: () => jwtDecrypt,
    jwtVerify: () => jwtVerify
  });

  // dist/webapi/lib/buffer_utils.js
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var strictDecoder = new TextDecoder("utf-8", { fatal: true });
  var MAX_INT32 = 2 ** 32;
  function concat(...buffers) {
    const size = buffers.reduce((acc, { length }) => acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers) {
      buf.set(buffer, i);
      i += buffer.length;
    }
    return buf;
  }
  function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
      throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([value >>> 24, value >>> 16, value >>> 8, value & 255], offset);
  }
  function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
  }
  function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
  }
  function encode(string) {
    const bytes = new Uint8Array(string.length);
    for (let i = 0; i < string.length; i++) {
      const code = string.charCodeAt(i);
      if (code > 127) {
        throw new TypeError("non-ASCII string encountered in encode()");
      }
      bytes[i] = code;
    }
    return bytes;
  }

  // dist/webapi/lib/crypto_key.js
  var unusable = (name, prop = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
  function checkUsage(key, usage) {
    if (usage && !key.usages.includes(usage)) {
      throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
    }
  }
  function checkModulusLength(alg, key) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
  function checkCryptoKey(key, expected, usage) {
    const algorithm = key.algorithm;
    if (algorithm.name !== expected.name) {
      throw unusable(expected.name);
    }
    if (expected.hash && algorithm.hash?.name !== expected.hash) {
      throw unusable(expected.hash, "algorithm.hash");
    }
    if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) {
      throw unusable(expected.namedCurve, "algorithm.namedCurve");
    }
    if (expected.length !== void 0 && algorithm.length !== expected.length) {
      throw unusable(expected.length, "algorithm.length");
    }
    checkUsage(key, usage);
  }

  // dist/webapi/lib/invalid_key_input.js
  function message(msg, actual, ...types) {
    if (types.length > 2) {
      const last = types.pop();
      msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else if (types.length === 2) {
      msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
      msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
      msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
      msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
      if (actual.constructor?.name) {
        msg += ` Received an instance of ${actual.constructor.name}`;
      }
    }
    return msg;
  }
  var invalidKeyInput = (actual, ...types) => message("Key must be ", actual, ...types);
  var withAlg = (alg, actual, ...types) => message(`Key for the ${alg} algorithm must be `, actual, ...types);

  // dist/webapi/util/errors.js
  var errors_exports = {};
  __export(errors_exports, {
    JOSEAlgNotAllowed: () => JOSEAlgNotAllowed,
    JOSEError: () => JOSEError,
    JOSENotSupported: () => JOSENotSupported,
    JWEDecryptionFailed: () => JWEDecryptionFailed,
    JWEInvalid: () => JWEInvalid,
    JWKInvalid: () => JWKInvalid,
    JWKSInvalid: () => JWKSInvalid,
    JWKSMultipleMatchingKeys: () => JWKSMultipleMatchingKeys,
    JWKSNoMatchingKey: () => JWKSNoMatchingKey,
    JWKSTimeout: () => JWKSTimeout,
    JWSInvalid: () => JWSInvalid,
    JWSSignatureVerificationFailed: () => JWSSignatureVerificationFailed,
    JWTClaimValidationFailed: () => JWTClaimValidationFailed,
    JWTExpired: () => JWTExpired,
    JWTInvalid: () => JWTInvalid
  });
  var JOSEError = class extends Error {
    static code = "ERR_JOSE_GENERIC";
    code = "ERR_JOSE_GENERIC";
    constructor(message2, options) {
      super(message2, options);
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  var JWTClaimValidationFailed = class extends JOSEError {
    static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    claim;
    reason;
    payload;
    constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
      super(message2, { cause: { claim, reason, payload } });
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  };
  var JWTExpired = class extends JOSEError {
    static code = "ERR_JWT_EXPIRED";
    code = "ERR_JWT_EXPIRED";
    claim;
    reason;
    payload;
    constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
      super(message2, { cause: { claim, reason, payload } });
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  };
  var JOSEAlgNotAllowed = class extends JOSEError {
    static code = "ERR_JOSE_ALG_NOT_ALLOWED";
    code = "ERR_JOSE_ALG_NOT_ALLOWED";
  };
  var JOSENotSupported = class extends JOSEError {
    static code = "ERR_JOSE_NOT_SUPPORTED";
    code = "ERR_JOSE_NOT_SUPPORTED";
  };
  var JWEDecryptionFailed = class extends JOSEError {
    static code = "ERR_JWE_DECRYPTION_FAILED";
    code = "ERR_JWE_DECRYPTION_FAILED";
    constructor(message2 = "decryption operation failed", options) {
      super(message2, options);
    }
  };
  var JWEInvalid = class extends JOSEError {
    static code = "ERR_JWE_INVALID";
    code = "ERR_JWE_INVALID";
  };
  var JWSInvalid = class extends JOSEError {
    static code = "ERR_JWS_INVALID";
    code = "ERR_JWS_INVALID";
  };
  var JWTInvalid = class extends JOSEError {
    static code = "ERR_JWT_INVALID";
    code = "ERR_JWT_INVALID";
  };
  var JWKInvalid = class extends JOSEError {
    static code = "ERR_JWK_INVALID";
    code = "ERR_JWK_INVALID";
  };
  var JWKSInvalid = class extends JOSEError {
    static code = "ERR_JWKS_INVALID";
    code = "ERR_JWKS_INVALID";
  };
  var JWKSNoMatchingKey = class extends JOSEError {
    static code = "ERR_JWKS_NO_MATCHING_KEY";
    code = "ERR_JWKS_NO_MATCHING_KEY";
    constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
      super(message2, options);
    }
  };
  var JWKSMultipleMatchingKeys = class extends JOSEError {
    [Symbol.asyncIterator] = async function* () {
    };
    static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
      super(message2, options);
    }
  };
  var JWKSTimeout = class extends JOSEError {
    static code = "ERR_JWKS_TIMEOUT";
    code = "ERR_JWKS_TIMEOUT";
    constructor(message2 = "request timed out", options) {
      super(message2, options);
    }
  };
  var JWSSignatureVerificationFailed = class extends JOSEError {
    static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    constructor(message2 = "signature verification failed", options) {
      super(message2, options);
    }
  };

  // dist/webapi/lib/is_key_like.js
  function assertCryptoKey(key) {
    if (!isCryptoKey(key)) {
      throw new Error("CryptoKey instance expected");
    }
  }
  var isCryptoKey = (key) => {
    if (key?.[Symbol.toStringTag] === "CryptoKey")
      return true;
    try {
      return key instanceof CryptoKey;
    } catch {
      return false;
    }
  };
  var isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
  var isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);

  // dist/webapi/lib/content_encryption.js
  var generateCek = (enc) => crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3));
  function checkCekLength(cek, expected) {
    const actual = cek.byteLength << 3;
    if (actual !== expected) {
      throw new JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
    }
  }
  var generateIv = (enc) => crypto.getRandomValues(new Uint8Array(enc.ivBits >> 3));
  function checkIvLength(enc, iv) {
    if (iv.length << 3 !== enc.ivBits) {
      throw new JWEInvalid("Invalid Initialization Vector length");
    }
  }
  async function cbcKeySetup(enc, cek, usage) {
    if (!(cek instanceof Uint8Array)) {
      throw new TypeError(invalidKeyInput(cek, "Uint8Array"));
    }
    const keySize = enc.cekBits >> 1;
    const encKey = await crypto.subtle.importKey("raw", cek.subarray(keySize >> 3), "AES-CBC", false, [usage]);
    const macKey = await crypto.subtle.importKey("raw", cek.subarray(0, keySize >> 3), {
      hash: `SHA-${keySize << 1}`,
      name: "HMAC"
    }, false, ["sign"]);
    return [encKey, macKey, keySize];
  }
  async function cbcHmacTag(macKey, macData, keySize) {
    return new Uint8Array((await crypto.subtle.sign("HMAC", macKey, macData)).slice(0, keySize >> 3));
  }
  async function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, "encrypt");
    const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
      iv,
      name: "AES-CBC"
    }, encKey, plaintext));
    const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
    const tag2 = await cbcHmacTag(macKey, macData, keySize);
    return { ciphertext, tag: tag2, iv };
  }
  async function timingSafeEqual(a, b) {
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const key = await crypto.subtle.generateKey(algorithm, false, ["sign", "verify"]);
    const aHmac = await crypto.subtle.sign(algorithm, key, a);
    return crypto.subtle.verify(algorithm, key, aHmac, b);
  }
  async function cbcDecrypt(enc, cek, ciphertext, iv, tag2, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, "decrypt");
    const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
    const expectedTag = await cbcHmacTag(macKey, macData, keySize);
    try {
      if (await timingSafeEqual(tag2, expectedTag)) {
        return new Uint8Array(await crypto.subtle.decrypt({ iv, name: "AES-CBC" }, encKey, ciphertext));
      }
    } catch {
    }
    throw new JWEDecryptionFailed();
  }
  async function gcmEncrypt(enc, plaintext, cek, iv, aad) {
    const encKey = cek instanceof Uint8Array ? await crypto.subtle.importKey("raw", cek, "AES-GCM", false, [
      "encrypt"
    ]) : (checkCryptoKey(cek, enc.subtle, "encrypt"), cek);
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({
      additionalData: aad,
      iv,
      name: "AES-GCM",
      tagLength: 128
    }, encKey, plaintext));
    const tag2 = encrypted.slice(-16);
    const ciphertext = encrypted.slice(0, -16);
    return { ciphertext, tag: tag2, iv };
  }
  async function gcmDecrypt(enc, cek, ciphertext, iv, tag2, aad) {
    const encKey = cek instanceof Uint8Array ? await crypto.subtle.importKey("raw", cek, "AES-GCM", false, [
      "decrypt"
    ]) : (checkCryptoKey(cek, enc.subtle, "decrypt"), cek);
    try {
      return new Uint8Array(await crypto.subtle.decrypt({
        additionalData: aad,
        iv,
        name: "AES-GCM",
        tagLength: 128
      }, encKey, concat(ciphertext, tag2)));
    } catch {
      throw new JWEDecryptionFailed();
    }
  }
  async function encrypt(enc, plaintext, cek, iv, aad) {
    if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
      throw new TypeError(invalidKeyInput(cek, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
    }
    if (iv) {
      checkIvLength(enc, iv);
    } else {
      iv = generateIv(enc);
    }
    if (cek instanceof Uint8Array) {
      checkCekLength(cek, enc.cekBits);
    }
    return enc.cbc ? cbcEncrypt(enc, plaintext, cek, iv, aad) : gcmEncrypt(enc, plaintext, cek, iv, aad);
  }
  async function decrypt(enc, cek, ciphertext, iv, tag2, aad) {
    if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
      throw new TypeError(invalidKeyInput(cek, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
    }
    if (!iv) {
      throw new JWEInvalid("JWE Initialization Vector missing");
    }
    if (!tag2) {
      throw new JWEInvalid("JWE Authentication Tag missing");
    }
    if (!enc.cbc && tag2.length !== 16) {
      throw new JWEInvalid("Invalid Authentication Tag length");
    }
    checkIvLength(enc, iv);
    if (cek instanceof Uint8Array) {
      checkCekLength(cek, enc.cekBits);
    }
    return enc.cbc ? cbcDecrypt(enc, cek, ciphertext, iv, tag2, aad) : gcmDecrypt(enc, cek, ciphertext, iv, tag2, aad);
  }

  // dist/webapi/util/base64url.js
  var base64url_exports = {};
  __export(base64url_exports, {
    decode: () => decode,
    encode: () => encode2
  });

  // dist/webapi/lib/base64.js
  function encodeBase64(input) {
    if (Uint8Array.prototype.toBase64) {
      return input.toBase64();
    }
    const CHUNK_SIZE = 32768;
    const arr = [];
    for (let i = 0; i < input.length; i += CHUNK_SIZE) {
      arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(""));
  }
  function decodeBase64(encoded) {
    if (Uint8Array.fromBase64) {
      return Uint8Array.fromBase64(encoded);
    }
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // dist/webapi/util/base64url.js
  var invalid = "The input to be decoded is not correctly encoded.";
  function decode(input) {
    if (Uint8Array.fromBase64) {
      try {
        return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
          alphabet: "base64url"
        });
      } catch (cause) {
        throw new TypeError(invalid, { cause });
      }
    }
    let encoded = input;
    if (encoded instanceof Uint8Array) {
      encoded = decoder.decode(encoded);
    }
    if (encoded.includes("+") || encoded.includes("/")) {
      throw new TypeError(invalid);
    }
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    try {
      return decodeBase64(encoded);
    } catch {
      throw new TypeError(invalid);
    }
  }
  function encode2(input) {
    let unencoded = input;
    if (typeof unencoded === "string") {
      unencoded = encoder.encode(unencoded);
    }
    if (Uint8Array.prototype.toBase64) {
      return unencoded.toBase64({ alphabet: "base64url", omitPadding: true });
    }
    return encodeBase64(unencoded).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  // dist/webapi/lib/type_checks.js
  function assertUint8Array(input, label) {
    if (!(input instanceof Uint8Array)) {
      throw new TypeError(`${label} must be an instance of Uint8Array`);
    }
  }
  function isObject(input) {
    if (typeof input !== "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]") {
      return false;
    }
    const prototype = Object.getPrototypeOf(input);
    return prototype === null || Object.getPrototypeOf(prototype) === null;
  }
  function isJwkSet(input) {
    return isObject(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject);
  }
  function isDisjoint(...headers) {
    const parameters = /* @__PURE__ */ new Set();
    for (const header of headers) {
      if (!header)
        continue;
      for (const parameter of Object.keys(header)) {
        if (parameters.has(parameter)) {
          return false;
        }
        parameters.add(parameter);
      }
    }
    return true;
  }

  // dist/webapi/lib/helpers.js
  var unprotected = /* @__PURE__ */ Symbol();
  function assertNotSet(value, name) {
    if (value !== void 0) {
      throw new TypeError(`${name} can only be called once`);
    }
  }
  function decodeBase64url(value, label, ErrorClass) {
    try {
      return decode(value);
    } catch {
      throw new ErrorClass(`Failed to base64url decode the ${label}`);
    }
  }
  function encodeBase64url(value, label, ErrorClass) {
    try {
      return encode(value);
    } catch {
      throw new ErrorClass(`The ${label} is not a valid base64url string`);
    }
  }
  async function digest(algorithm, data) {
    const subtleDigest = `SHA-${algorithm.slice(-3)}`;
    return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
  }
  function parseJoseHeader(b64, ErrorClass, message2) {
    let parsed;
    try {
      parsed = JSON.parse(strictDecoder.decode(decode(b64)));
    } catch {
      throw new ErrorClass(message2);
    }
    if (!isObject(parsed)) {
      throw new ErrorClass(message2);
    }
    return parsed;
  }

  // dist/webapi/lib/jwk_to_key.js
  async function jwkToKey(entry, jwk) {
    if (jwk.kty === "RSA" && "oth" in jwk && jwk.oth !== void 0) {
      throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
    }
    if (!entry.kty.includes(jwk.kty)) {
      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle;
    const isPrivate = !!(jwk.d || jwk.priv);
    const keyData = { ...jwk };
    if (keyData.kty !== "AKP") {
      delete keyData.alg;
    }
    delete keyData.use;
    return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
  }

  // dist/webapi/lib/jwk_metadata.js
  function snapshotJwk(jwk) {
    return { __proto__: null, ...jwk };
  }
  function normalizeJwk(jwk) {
    const normalized = snapshotJwk(jwk);
    if (normalized.ext !== void 0 && typeof normalized.ext !== "boolean") {
      throw new TypeError('"ext" (Extractable) Parameter must be a boolean');
    }
    if (normalized.key_ops !== void 0) {
      const value = normalized.key_ops;
      const keyOps = Array.isArray(value) ? [...value] : void 0;
      if (!keyOps || keyOps.some((operation) => typeof operation !== "string") || new Set(keyOps).size !== keyOps.length) {
        throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
      }
      normalized.key_ops = keyOps;
    }
    return normalized;
  }

  // dist/webapi/lib/key.js
  var tag = (key) => key[Symbol.toStringTag];
  var jwkMatchesOp = (entry, key, usage) => {
    const { alg } = entry;
    if (key.use !== void 0) {
      const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
      if (key.use !== expected) {
        throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
      }
    }
    if (key.alg !== void 0 && key.alg !== alg) {
      throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
    }
    if (Array.isArray(key.key_ops)) {
      const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
      if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) {
        throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
      }
    }
  };
  function checkKeyType(entry, key, usage) {
    const { alg, secret } = entry;
    const privateKey = usage === "decrypt" || usage === "sign";
    if (secret && key instanceof Uint8Array)
      return [BYTES, key];
    if (isObject(key)) {
      const normalized = normalizeJwk(key);
      if (typeof normalized.kty !== "string") {
        throw new TypeError(secret ? withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
      }
      const valid = secret ? normalized.kty === "oct" && typeof normalized.k === "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv === "string" || typeof normalized.d === "string" : normalized.d === void 0 && normalized.priv === void 0);
      if (!valid) {
        throw new TypeError(secret ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present` : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
      }
      jwkMatchesOp(entry, normalized, usage);
      return [JWK, key, normalized];
    }
    if (!isKeyLike(key)) {
      throw new TypeError(secret ? withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
    }
    if (secret) {
      if (key.type !== "secret") {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
      }
    } else {
      if (key.type === "secret") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
      }
      const expectedType = privateKey ? "private" : "public";
      if ((key.type === "public" || key.type === "private") && key.type !== expectedType) {
        const operation = usage === "sign" ? "signing" : usage === "verify" ? "verifying" : `${usage.slice(0, -1)}tion`;
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`);
      }
    }
    return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key];
  }
  var BYTES = 0;
  var CRYPTO = 1;
  var KEYOBJECT = 2;
  var JWK = 3;
  var cache;
  var nist = {
    __proto__: null,
    prime256v1: "P-256",
    secp384r1: "P-384",
    secp521r1: "P-521"
  };
  function cached(key, alg, value) {
    cache ||= /* @__PURE__ */ new WeakMap();
    const entry = cache.get(key);
    if (value) {
      if (entry) {
        entry[alg] = value;
      } else {
        cache.set(key, { [alg]: value });
      }
    }
    return value ?? entry?.[alg];
  }
  var handleJWK = async (key, jwk, entry) => cached(key, entry.alg) ?? cached(key, entry.alg, await jwkToKey(entry, { ...jwk, alg: entry.alg }));
  var handleKeyObject = (keyObject, entry) => {
    const hit = cached(keyObject, entry.alg);
    if (hit)
      return hit;
    const isPublic = keyObject.type === "public";
    const usages = entry.usages[isPublic ? 0 : 1];
    const { asymmetricKeyType } = keyObject;
    const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
    const params = entry.resolve?.({ crv, asymmetricKeyType }) ?? entry.subtle;
    return cached(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
  };
  async function prepareKey(entry, key, usage) {
    const tagged = checkKeyType(entry, key, usage);
    switch (tagged[0]) {
      case BYTES:
      case CRYPTO:
        return tagged[1];
      case JWK: {
        const key2 = tagged[1];
        const normalized = tagged[2];
        if (normalized.kty === "oct") {
          return decode(normalized.k);
        }
        if (!Object.isFrozen(key2)) {
          const { key_ops } = key2;
          if (Array.isArray(key_ops))
            Object.freeze(key_ops);
          Object.freeze(key2);
        }
        return handleJWK(key2, normalized, entry);
      }
      case KEYOBJECT: {
        const keyObject = tagged[1];
        if (keyObject.type === "secret") {
          return keyObject.export();
        }
        if ("toCryptoKey" in keyObject && typeof keyObject.toCryptoKey === "function") {
          return handleKeyObject(keyObject, entry);
        }
        return handleJWK(keyObject, keyObject.export({ format: "jwk" }), entry);
      }
    }
  }

  // dist/webapi/lib/key_descriptor.js
  function table(entries) {
    const out = { __proto__: null };
    for (const alg in entries) {
      out[alg] = { ...entries[alg], alg };
    }
    return out;
  }

  // dist/webapi/lib/jwe_algorithms.js
  var wrap = [
    ["encrypt", "wrapKey"],
    ["decrypt", "unwrapKey"]
  ];
  var derive = [[], ["deriveBits"]];
  var none = [[], []];
  function rsaes(bits) {
    return {
      kty: ["RSA"],
      subtle: { name: "RSA-OAEP", hash: `SHA-${bits}` },
      usages: wrap,
      ops: ["wrapKey", "unwrapKey"]
    };
  }
  function ecdh() {
    return {
      kty: ["EC", "OKP"],
      subtle: { name: "ECDH" },
      resolve: ({ kty, crv, asymmetricKeyType }) => {
        if (crv === "X25519" || asymmetricKeyType === "x25519") {
          return { name: "X25519" };
        }
        if (kty === "OKP") {
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        return { name: "ECDH", namedCurve: crv };
      },
      usages: derive,
      ops: [void 0, "deriveBits"]
    };
  }
  function aeskw(bits, gcm = false) {
    return {
      kty: ["oct"],
      secret: true,
      subtle: { name: gcm ? "AES-GCM" : "AES-KW", length: bits },
      usages: none,
      ops: gcm ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"]
    };
  }
  function pbes2() {
    return {
      kty: ["oct"],
      secret: true,
      subtle: { name: "PBKDF2" },
      usages: none,
      ops: ["deriveBits", "deriveBits"]
    };
  }
  var JWE = table({
    dir: {
      kty: ["oct"],
      secret: true,
      subtle: { name: "AES-GCM" },
      usages: none,
      ops: ["encrypt", "decrypt"]
    },
    "RSA-OAEP": rsaes(1),
    "RSA-OAEP-256": rsaes(256),
    "RSA-OAEP-384": rsaes(384),
    "RSA-OAEP-512": rsaes(512),
    "ECDH-ES": ecdh(),
    "ECDH-ES+A128KW": ecdh(),
    "ECDH-ES+A192KW": ecdh(),
    "ECDH-ES+A256KW": ecdh(),
    A128KW: aeskw(128),
    A192KW: aeskw(192),
    A256KW: aeskw(256),
    A128GCMKW: aeskw(128, true),
    A192GCMKW: aeskw(192, true),
    A256GCMKW: aeskw(256, true),
    "PBES2-HS256+A128KW": pbes2(),
    "PBES2-HS384+A192KW": pbes2(),
    "PBES2-HS512+A256KW": pbes2()
  });
  var contentOps = ["encrypt", "decrypt"];
  function contentEncryption(bits, cbc = false) {
    return {
      kty: ["oct"],
      secret: true,
      subtle: { name: cbc ? "AES-CBC" : "AES-GCM", length: bits },
      usages: none,
      ops: contentOps,
      cekBits: bits,
      ivBits: cbc ? 128 : 96,
      cbc
    };
  }
  var ENC = table({
    A128GCM: contentEncryption(128),
    A192GCM: contentEncryption(192),
    A256GCM: contentEncryption(256),
    "A128CBC-HS256": contentEncryption(256, true),
    "A192CBC-HS384": contentEncryption(384, true),
    "A256CBC-HS512": contentEncryption(512, true)
  });
  function unsupported(parameter, name) {
    throw new JOSENotSupported(`Invalid or unsupported "${parameter}" (JWE ${name}) header value`);
  }
  function jweAlgorithm(alg) {
    return (typeof alg === "string" ? JWE[alg] : void 0) ?? unsupported("alg", "Algorithm");
  }
  function jweEncryption(enc) {
    return (typeof enc === "string" ? ENC[enc] : void 0) ?? unsupported("enc", "Encryption Algorithm");
  }

  // dist/webapi/lib/key_management.js
  function checkEcdhCryptoKey(key, usage) {
    if (key.algorithm.name !== "ECDH" && key.algorithm.name !== "X25519") {
      throw new TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
    }
    checkUsage(key, usage);
  }
  async function aeskwCryptoKey(key, alg, usage) {
    const expected = jweAlgorithm(alg).subtle;
    const cryptoKey = key instanceof Uint8Array ? await crypto.subtle.importKey("raw", key, "AES-KW", true, [
      usage
    ]) : key;
    checkCryptoKey(cryptoKey, expected, usage);
    return cryptoKey;
  }
  async function aeskwWrap(alg, key, cek) {
    const cryptoKey = await aeskwCryptoKey(key, alg, "wrapKey");
    const cryptoKeyCek = await crypto.subtle.importKey("raw", cek, { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
    return new Uint8Array(await crypto.subtle.wrapKey("raw", cryptoKeyCek, cryptoKey, "AES-KW"));
  }
  async function aeskwUnwrap(alg, key, encryptedKey) {
    const cryptoKey = await aeskwCryptoKey(key, alg, "unwrapKey");
    const cryptoKeyCek = await crypto.subtle.unwrapKey("raw", encryptedKey, cryptoKey, "AES-KW", { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
    return new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKeyCek));
  }
  function checkRsaKey(alg, key, usage) {
    checkCryptoKey(key, jweAlgorithm(alg).subtle, usage);
    checkModulusLength(alg, key);
  }
  function pbes2CryptoKey(key, alg) {
    if (key instanceof Uint8Array) {
      return crypto.subtle.importKey("raw", key, "PBKDF2", false, [
        "deriveBits"
      ]);
    }
    checkCryptoKey(key, jweAlgorithm(alg).subtle, "deriveBits");
    return key;
  }
  async function deriveKey(p2s, alg, p2c, key) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
      throw new JWEInvalid("PBES2 Salt Input must be 8 or more octets");
    }
    if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
      throw new JWEInvalid("PBES2 Count Input must be a positive integer");
    }
    const salt = concat(encode(alg), Uint8Array.of(0), p2s);
    const keylen = parseInt(alg.slice(13, 16), 10);
    const subtleAlg = {
      hash: `SHA-${alg.slice(8, 11)}`,
      iterations: p2c,
      name: "PBKDF2",
      salt
    };
    const cryptoKey = await pbes2CryptoKey(key, alg);
    return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
  }
  function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
  }
  async function concatKdf(Z, L, OtherInfo) {
    const dkLen = L >> 3;
    const hashLen = 32;
    const reps = Math.ceil(dkLen / hashLen);
    const dk = new Uint8Array(reps * hashLen);
    for (let i = 1; i <= reps; i++) {
      const hashResult = await digest("sha256", concat(uint32be(i), Z, OtherInfo));
      dk.set(hashResult, (i - 1) * hashLen);
    }
    return dk.slice(0, dkLen);
  }
  async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
    checkEcdhCryptoKey(publicKey);
    checkEcdhCryptoKey(privateKey, "deriveBits");
    const otherInfo = concat(lengthAndInput(encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength));
    const Z = new Uint8Array(await crypto.subtle.deriveBits({
      name: publicKey.algorithm.name,
      public: publicKey
    }, privateKey, publicKey.algorithm.name === "X25519" ? 256 : Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3));
    return concatKdf(Z, keyLength, otherInfo);
  }
  function assertEcdhKey(key) {
    assertCryptoKey(key);
    const curve = key.algorithm.namedCurve;
    if (curve !== "P-256" && curve !== "P-384" && curve !== "P-521" && key.algorithm.name !== "X25519") {
      throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
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
  async function decryptKeyManagement(alg, enc, key, encryptedKey, joseHeader, maxPBES2Count) {
    const entry = jweAlgorithm(alg);
    if (alg === "dir") {
      assertNoEncryptedKey(encryptedKey);
      return key;
    }
    switch (entry.subtle.name) {
      case "ECDH": {
        if (alg === "ECDH-ES")
          assertNoEncryptedKey(encryptedKey);
        if (!isObject(joseHeader.epk))
          throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
        assertEcdhKey(key);
        const epk = await jwkToKey(entry, joseHeader.epk);
        let partyUInfo;
        let partyVInfo;
        if (joseHeader.apu !== void 0) {
          if (typeof joseHeader.apu !== "string")
            throw new JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
          partyUInfo = decodeBase64url(joseHeader.apu, "apu", JWEInvalid);
        }
        if (joseHeader.apv !== void 0) {
          if (typeof joseHeader.apv !== "string")
            throw new JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
          partyVInfo = decodeBase64url(joseHeader.apv, "apv", JWEInvalid);
        }
        const sharedSecret = await ecdhesDeriveKey(epk, key, alg === "ECDH-ES" ? enc.alg : alg, alg === "ECDH-ES" ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
        if (alg === "ECDH-ES")
          return sharedSecret;
        assertEncryptedKey(encryptedKey);
        return aeskwUnwrap(alg.slice(-6), sharedSecret, encryptedKey);
      }
      case "RSA-OAEP": {
        assertEncryptedKey(encryptedKey);
        assertCryptoKey(key);
        checkRsaKey(alg, key, "decrypt");
        return new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", key, encryptedKey));
      }
      case "PBKDF2": {
        assertEncryptedKey(encryptedKey);
        if (typeof joseHeader.p2c !== "number")
          throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
        const p2cLimit = maxPBES2Count || 1e4;
        if (joseHeader.p2c > p2cLimit)
          throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
        if (typeof joseHeader.p2s !== "string")
          throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
        const p2s = decodeBase64url(joseHeader.p2s, "p2s", JWEInvalid);
        const derived = await deriveKey(p2s, alg, joseHeader.p2c, key);
        return aeskwUnwrap(alg.slice(-6), derived, encryptedKey);
      }
      case "AES-KW": {
        assertEncryptedKey(encryptedKey);
        return aeskwUnwrap(alg, key, encryptedKey);
      }
      case "AES-GCM": {
        assertEncryptedKey(encryptedKey);
        if (typeof joseHeader.iv !== "string")
          throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
        if (typeof joseHeader.tag !== "string")
          throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
        let iv;
        iv = decodeBase64url(joseHeader.iv, "iv", JWEInvalid);
        let tag2;
        tag2 = decodeBase64url(joseHeader.tag, "tag", JWEInvalid);
        return decrypt(jweEncryption(alg.slice(0, -2)), key, encryptedKey, iv, tag2, new Uint8Array());
      }
    }
  }
  async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    const entry = jweAlgorithm(alg);
    if (alg === "dir")
      return [key, void 0, void 0];
    switch (entry.subtle.name) {
      case "ECDH": {
        assertEcdhKey(key);
        const { apu, apv } = providedParameters;
        if (apu !== void 0) {
          assertUint8Array(apu, '"apu"');
        }
        if (apv !== void 0) {
          assertUint8Array(apv, '"apv"');
        }
        let ephemeralKey;
        if (providedParameters.epk !== void 0) {
          ephemeralKey = await prepareKey(entry, providedParameters.epk, "decrypt");
        } else {
          ephemeralKey = (await crypto.subtle.generateKey(key.algorithm, true, ["deriveBits"])).privateKey;
        }
        const subtle = crypto.subtle;
        let exportableEpk = ephemeralKey;
        if (!exportableEpk.extractable) {
          if (typeof subtle.getPublicKey !== "function") {
            throw new TypeError('CryptoKey for "epk" must be extractable');
          }
          exportableEpk = await subtle.getPublicKey(ephemeralKey, []);
        }
        const { x, y, crv, kty } = await subtle.exportKey("jwk", exportableEpk);
        const sharedSecret = await ecdhesDeriveKey(key, ephemeralKey, alg === "ECDH-ES" ? enc.alg : alg, alg === "ECDH-ES" ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), apu, apv);
        parameters = { epk: { x, crv, kty } };
        if (kty === "EC")
          parameters.epk.y = y;
        if (apu)
          parameters.apu = encode2(apu);
        if (apv)
          parameters.apv = encode2(apv);
        if (alg === "ECDH-ES") {
          cek = sharedSecret;
          break;
        }
        cek = providedCek || generateCek(enc);
        const kwAlg = alg.slice(-6);
        encryptedKey = await aeskwWrap(kwAlg, sharedSecret, cek);
        break;
      }
      case "RSA-OAEP": {
        cek = providedCek || generateCek(enc);
        assertCryptoKey(key);
        checkRsaKey(alg, key, "encrypt");
        encryptedKey = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", key, cek));
        break;
      }
      case "PBKDF2": {
        cek = providedCek || generateCek(enc);
        const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters;
        const derived = await deriveKey(p2s, alg, p2c, key);
        encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek);
        parameters = { p2c, p2s: encode2(p2s) };
        break;
      }
      case "AES-KW": {
        cek = providedCek || generateCek(enc);
        encryptedKey = await aeskwWrap(alg, key, cek);
        break;
      }
      case "AES-GCM": {
        cek = providedCek || generateCek(enc);
        const { iv } = providedParameters;
        const wrapped = await encrypt(jweEncryption(alg.slice(0, -2)), cek, key, iv, new Uint8Array());
        encryptedKey = wrapped.ciphertext;
        parameters = { iv: encode2(wrapped.iv), tag: encode2(wrapped.tag) };
        break;
      }
    }
    return [cek, encryptedKey, parameters];
  }

  // dist/webapi/lib/options.js
  var JWS_RECOGNIZED = { __proto__: null, b64: true };
  var JWE_RECOGNIZED = { __proto__: null };
  function validateAlgorithms(option, algorithms) {
    if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
      throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
      return void 0;
    }
    return new Set(algorithms);
  }
  function validateCritDuplicates(Err, protectedHeader) {
    const { crit } = protectedHeader ?? {};
    if (Array.isArray(crit) && new Set(crit).size !== crit.length) {
      throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values');
    }
  }
  function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
      throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === void 0) {
      return [];
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
      throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    const recognized = recognizedOption === void 0 ? recognizedDefault : { __proto__: null, ...recognizedOption, ...recognizedDefault };
    for (const parameter of protectedHeader.crit) {
      if (!(parameter in recognized)) {
        throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
      }
      if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0) {
        throw new Err(`Extension Header Parameter "${parameter}" is missing`);
      }
      if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0)) {
        throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
      }
    }
    return protectedHeader.crit;
  }
  function validateB64(protectedHeader, extensions) {
    if (extensions.includes("b64")) {
      const b64 = protectedHeader.b64;
      if (typeof b64 !== "boolean") {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
      return b64;
    }
    return true;
  }
  function serializeJoseHeader(Err, header) {
    let serialized;
    let parsed;
    try {
      serialized = JSON.stringify(header);
      parsed = JSON.parse(serialized);
    } catch (cause) {
      throw new Err("JOSE Header is not valid JSON", { cause });
    }
    if (!isObject(parsed)) {
      throw new Err("JOSE Header is not a JSON object");
    }
    return [parsed, serialized];
  }

  // dist/webapi/lib/deflate.js
  function validateZip(joseHeader, protectedHeader) {
    if (joseHeader.zip !== void 0 && joseHeader.zip !== "DEF") {
      throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
    }
    if (joseHeader.zip !== void 0 && !protectedHeader?.zip) {
      throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
    }
  }
  function supported(name) {
    if (typeof globalThis[name] === "undefined") {
      throw new JOSENotSupported(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${name} API.`);
    }
  }
  async function compress(input) {
    supported("CompressionStream");
    const cs = new CompressionStream("deflate-raw");
    const writer = cs.writable.getWriter();
    writer.write(input).catch(() => {
    });
    writer.close().catch(() => {
    });
    const chunks = [];
    const reader = cs.readable.getReader();
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done)
        break;
      chunks.push(value);
    }
    return concat(...chunks);
  }
  async function decompress(input, maxLength) {
    supported("DecompressionStream");
    const ds = new DecompressionStream("deflate-raw");
    const writer = ds.writable.getWriter();
    writer.write(input).catch(() => {
    });
    writer.close().catch(() => {
    });
    const chunks = [];
    let length = 0;
    const reader = ds.readable.getReader();
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done)
        break;
      chunks.push(value);
      length += value.byteLength;
      if (maxLength !== Infinity && length > maxLength) {
        throw new JWEInvalid("Decompressed plaintext exceeded the configured limit");
      }
    }
    return concat(...chunks);
  }

  // dist/webapi/lib/jwe_decrypt.js
  function snapshotSharedJWE(jwe) {
    const { aad, ciphertext, iv, protected: encodedProtected, tag: tag2, unprotected: unprotected2 } = jwe;
    if (iv !== void 0 && typeof iv !== "string") {
      throw new JWEInvalid("JWE Initialization Vector incorrect type");
    }
    if (typeof ciphertext !== "string") {
      throw new JWEInvalid("JWE Ciphertext missing or incorrect type");
    }
    if (tag2 !== void 0 && typeof tag2 !== "string") {
      throw new JWEInvalid("JWE Authentication Tag incorrect type");
    }
    if (encodedProtected !== void 0 && typeof encodedProtected !== "string") {
      throw new JWEInvalid("JWE Protected Header incorrect type");
    }
    if (aad !== void 0 && (typeof aad !== "string" || !aad)) {
      throw new JWEInvalid("JWE AAD incorrect type");
    }
    if (unprotected2 !== void 0 && !isObject(unprotected2)) {
      throw new JWEInvalid("JWE Shared Unprotected Header incorrect type");
    }
    return {
      aad,
      ciphertext,
      iv,
      protected: encodedProtected,
      tag: tag2,
      unprotected: unprotected2 === void 0 ? void 0 : { ...unprotected2 }
    };
  }
  function snapshotRecipientJWE(recipient) {
    let header;
    let headerAlg;
    try {
      const { header: inputHeader } = recipient;
      if (isObject(inputHeader)) {
        headerAlg = inputHeader.alg;
        const parameters = Object.keys(inputHeader);
        if (!parameters.includes("alg"))
          headerAlg = void 0;
        header = Object.fromEntries(parameters.map((parameter) => [
          parameter,
          parameter === "alg" ? headerAlg : inputHeader[parameter]
        ]));
      } else {
        header = inputHeader;
      }
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
    if (encryptedKey !== void 0 && typeof encryptedKey !== "string") {
      throw new JWEInvalid("JWE Encrypted Key incorrect type");
    }
    if (header !== void 0) {
      if (!isObject(header)) {
        throw new JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
      }
    }
    if (jwe.protected === void 0 && header === void 0 && jwe.unprotected === void 0) {
      throw new JWEInvalid("JOSE Header missing");
    }
  }
  function shareJWE(jwe) {
    const { protected: encodedProtected, ciphertext, iv, tag: tag2, aad } = jwe;
    let parsedProt;
    if (encodedProtected !== void 0) {
      parsedProt = parseJoseHeader(encodedProtected, JWEInvalid, "JWE Protected Header is invalid");
    }
    const protectedHeader = encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array();
    return [
      parsedProt,
      decodeBase64url(ciphertext, "ciphertext", JWEInvalid),
      iv !== void 0 ? decodeBase64url(iv, "iv", JWEInvalid) : void 0,
      tag2 !== void 0 ? decodeBase64url(tag2, "tag", JWEInvalid) : void 0,
      aad !== void 0 ? concat(protectedHeader, encode("."), encodeBase64url(aad, "aad", JWEInvalid)) : protectedHeader
    ];
  }
  function decryptResult(jwe, decrypted) {
    const [plaintext, parsedProt, key, resolvedKey] = decrypted;
    const { protected: encodedProtected, aad, unprotected: unprotected2, header } = jwe;
    const result = { plaintext };
    if (encodedProtected !== void 0) {
      result.protectedHeader = parsedProt;
    }
    if (aad !== void 0) {
      result.additionalAuthenticatedData = decodeBase64url(aad, "aad", JWEInvalid);
    }
    if (unprotected2 !== void 0) {
      result.sharedUnprotectedHeader = unprotected2;
    }
    if (header !== void 0) {
      result.unprotectedHeader = header;
    }
    if (resolvedKey) {
      return { ...result, key };
    }
    return result;
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
    const [parsedProt] = token;
    const { header, unprotected: unprotected2 } = jwe;
    let joseHeader;
    if (header !== void 0 || unprotected2 !== void 0) {
      if (!isDisjoint(parsedProt, header, unprotected2)) {
        throw new JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
      }
      joseHeader = { ...parsedProt, ...header, ...unprotected2 };
    } else {
      joseHeader = parsedProt ?? {};
    }
    return decryptRecipientCore(jwe, token, shared, key, joseHeader);
  }
  async function decryptRecipientCore(jwe, token, shared, key, joseHeader) {
    const [keyManagementAlgorithms, contentEncryptionAlgorithms, crit, maxPBES2Count, maxDecompressedLength] = shared;
    const [parsedProt, ciphertext, iv, tag2, additionalData] = token;
    const { encrypted_key: encodedKey } = jwe;
    validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, parsedProt, joseHeader);
    validateZip(joseHeader, parsedProt);
    const { alg, enc } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
    }
    if (typeof enc !== "string" || !enc) {
      throw new JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
    }
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg) || !keyManagementAlgorithms && alg.startsWith("PBES2")) {
      throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
      throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
    }
    const encEntry = jweEncryption(enc);
    let encryptedKey;
    if (encodedKey !== void 0) {
      encryptedKey = decodeBase64url(encodedKey, "encrypted_key", JWEInvalid);
    }
    let resolvedKey = false;
    if (typeof key === "function") {
      key = await key(parsedProt, jwe);
      resolvedKey = true;
    }
    const algEntry = jweAlgorithm(alg);
    const k = await prepareKey(alg === "dir" ? encEntry : algEntry, key, "decrypt");
    let cek;
    try {
      cek = await decryptKeyManagement(alg, encEntry, k, encryptedKey, joseHeader, maxPBES2Count);
      if (encodedKey !== void 0 && cek instanceof Uint8Array && cek.byteLength << 3 !== encEntry.cekBits) {
        cek = generateCek(encEntry);
      }
    } catch (err) {
      if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
        throw err;
      }
      cek = generateCek(encEntry);
    }
    let plaintext = await decrypt(encEntry, cek, ciphertext, iv, tag2, additionalData);
    if (joseHeader.zip === "DEF") {
      const decompressionLimit = maxDecompressedLength ?? 25e4;
      if (decompressionLimit === 0) {
        throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
      }
      if (decompressionLimit !== Infinity && (!Number.isSafeInteger(decompressionLimit) || decompressionLimit < 1)) {
        throw new TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
      }
      plaintext = await decompress(plaintext, decompressionLimit).catch((cause) => {
        if (cause instanceof JWEInvalid)
          throw cause;
        throw new JWEInvalid("Failed to decompress plaintext", { cause });
      });
    }
    return [plaintext, parsedProt, k, resolvedKey];
  }
  async function decryptJWE(jwe, shared, key) {
    return decryptRecipient(jwe, shareJWE(jwe), shared, key);
  }
  async function decryptCompact(jwe, shared, key) {
    if (jwe instanceof Uint8Array) {
      jwe = decoder.decode(jwe);
    }
    if (typeof jwe !== "string") {
      throw new JWEInvalid("Compact JWE must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: encryptedKey, 2: iv, 3: ciphertext, 4: tag2, length } = jwe.split(".");
    if (length !== 5) {
      throw new JWEInvalid("Invalid Compact JWE");
    }
    const flattened = {
      ciphertext,
      iv: iv || void 0,
      protected: protectedHeader,
      tag: tag2 || void 0,
      encrypted_key: encryptedKey || void 0
    };
    const parsedProt = parseJoseHeader(protectedHeader, JWEInvalid, "JWE Protected Header is invalid");
    const protectedBytes = encode(protectedHeader);
    const token = [
      parsedProt,
      decodeBase64url(ciphertext, "ciphertext", JWEInvalid),
      iv ? decodeBase64url(iv, "iv", JWEInvalid) : void 0,
      tag2 ? decodeBase64url(tag2, "tag", JWEInvalid) : void 0,
      protectedBytes
    ];
    return decryptRecipientCore(flattened, token, shared, key, parsedProt);
  }

  // dist/webapi/jwe/compact/decrypt.js
  async function compactDecrypt(jwe, key, options) {
    const decrypted = await decryptCompact(jwe, prepareDecrypt(options), key);
    const result = { plaintext: decrypted[0], protectedHeader: decrypted[1] };
    if (typeof key === "function") {
      return { ...result, key: decrypted[2] };
    }
    return result;
  }

  // dist/webapi/jwe/flattened/decrypt.js
  async function flattenedDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
      throw new JWEInvalid("Flattened JWE must be an object");
    }
    const shared = snapshotSharedJWE(jwe);
    const [recipient, , error] = snapshotRecipientJWE(jwe);
    if (!recipient)
      throw error;
    const snapshot = { ...shared, ...recipient };
    checkRecipient(snapshot);
    return decryptResult(snapshot, await decryptJWE(snapshot, prepareDecrypt(options), key));
  }

  // dist/webapi/jwe/general/decrypt.js
  async function generalDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
      throw new JWEInvalid("General JWE must be an object");
    }
    const inputRecipients = jwe.recipients;
    if (!Array.isArray(inputRecipients)) {
      throw new JWEInvalid("JWE Recipients missing or incorrect type");
    }
    const recipients = Array.from(inputRecipients);
    if (!recipients.every(isObject)) {
      throw new JWEInvalid("JWE Recipients missing or incorrect type");
    }
    if (!recipients.length) {
      throw new JWEInvalid("JWE Recipients has no members");
    }
    let shared;
    let sharedJwe;
    let token;
    try {
      shared = prepareDecrypt(options);
      sharedJwe = snapshotSharedJWE(jwe);
      token = shareJWE(sharedJwe);
    } catch {
      throw new JWEDecryptionFailed();
    }
    const recipientSnapshots = recipients.map((recipient) => snapshotRecipientJWE(recipient));
    if (recipients.length > 1) {
      for (const [, headerAlg] of recipientSnapshots) {
        const alg = token[0]?.alg ?? headerAlg ?? sharedJwe.unprotected?.alg;
        if (alg === "dir" || alg === "ECDH-ES") {
          throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
        }
      }
    }
    for (const [recipient] of recipientSnapshots) {
      if (!recipient)
        continue;
      try {
        const flattened = { ...sharedJwe, ...recipient };
        checkRecipient(flattened);
        return decryptResult(flattened, await decryptRecipient(flattened, token, shared, key));
      } catch {
      }
    }
    throw new JWEDecryptionFailed();
  }

  // dist/webapi/lib/jwe_encrypt.js
  function checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader) {
    if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) {
      throw new JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
    }
  }
  function checkEncryptHeaders(input) {
    let [, protectedHeader, unprotectedHeader, sharedUnprotectedHeader, aad, cek, iv, keyManagementParameters, crit] = input;
    if (aad !== void 0) {
      assertUint8Array(aad, "JWE Additional Authenticated Data");
    }
    if (cek !== void 0) {
      assertUint8Array(cek, "JWE Content Encryption Key");
    }
    if (iv !== void 0) {
      assertUint8Array(iv, "JWE Initialization Vector");
    }
    if (protectedHeader !== void 0) {
      protectedHeader = serializeJoseHeader(JWEInvalid, protectedHeader)[0];
      input[1] = protectedHeader;
    }
    if (unprotectedHeader !== void 0) {
      unprotectedHeader = serializeJoseHeader(JWEInvalid, unprotectedHeader)[0];
      input[2] = unprotectedHeader;
    }
    if (sharedUnprotectedHeader !== void 0) {
      sharedUnprotectedHeader = serializeJoseHeader(JWEInvalid, sharedUnprotectedHeader)[0];
      input[3] = sharedUnprotectedHeader;
    }
    if (keyManagementParameters !== void 0 && !isObject(keyManagementParameters)) {
      throw new TypeError("JWE Key Management Parameters must be an object");
    }
    checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
    const joseHeader = {
      ...protectedHeader,
      ...unprotectedHeader,
      ...sharedUnprotectedHeader
    };
    validateCritDuplicates(JWEInvalid, protectedHeader);
    validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, protectedHeader, joseHeader);
    validateZip(joseHeader, protectedHeader);
    const { alg, enc } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
    }
    if (typeof enc !== "string" || !enc) {
      throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
    }
    return [joseHeader, alg, enc, jweEncryption(enc)];
  }
  async function encryptJWE(input, checked, key) {
    const [joseHeader, alg, , encEntry] = checked;
    const [inputPlaintext, inputProtectedHeader, inputUnprotectedHeader, sharedUnprotectedHeader, aad, providedCek, inputIv, keyManagementParameters, , unprotectedParameters] = input;
    let protectedHeader = inputProtectedHeader;
    let unprotectedHeader = inputUnprotectedHeader;
    if (providedCek && (alg === "dir" || alg === "ECDH-ES")) {
      throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
    }
    const algEntry = jweAlgorithm(alg);
    const k = await prepareKey(alg === "dir" ? encEntry : algEntry, key, "encrypt");
    const [cek, encryptedKey, parameters] = await encryptKeyManagement(alg, encEntry, k, providedCek, keyManagementParameters);
    if (parameters) {
      if (unprotectedParameters) {
        unprotectedHeader = unprotectedHeader ? { ...unprotectedHeader, ...parameters } : parameters;
      } else {
        protectedHeader = protectedHeader ? { ...protectedHeader, ...parameters } : parameters;
      }
      checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
    }
    let protectedHeaderS;
    let protectedHeaderB;
    if (protectedHeader) {
      protectedHeaderS = encode2(JSON.stringify(protectedHeader));
      protectedHeaderB = encode(protectedHeaderS);
    } else {
      protectedHeaderS = "";
      protectedHeaderB = new Uint8Array();
    }
    let additionalData;
    let aadMember;
    if (aad?.byteLength) {
      aadMember = encode2(aad);
      additionalData = concat(protectedHeaderB, encode("."), encode(aadMember));
    } else {
      additionalData = protectedHeaderB;
    }
    let plaintext = inputPlaintext;
    if (joseHeader.zip === "DEF") {
      plaintext = await compress(plaintext).catch((cause) => {
        throw new JWEInvalid("Failed to compress plaintext", { cause });
      });
    }
    const { ciphertext, tag: tag2, iv } = await encrypt(encEntry, plaintext, cek, inputIv, additionalData);
    const jwe = {
      ciphertext: encode2(ciphertext)
    };
    if (iv) {
      jwe.iv = encode2(iv);
    }
    if (tag2) {
      jwe.tag = encode2(tag2);
    }
    if (encryptedKey) {
      jwe.encrypted_key = encode2(encryptedKey);
    }
    if (aadMember) {
      jwe.aad = aadMember;
    }
    if (protectedHeader) {
      jwe.protected = protectedHeaderS;
    }
    if (sharedUnprotectedHeader) {
      jwe.unprotected = sharedUnprotectedHeader;
    }
    if (unprotectedHeader) {
      jwe.header = unprotectedHeader;
    }
    return jwe;
  }
  async function createJWE(input, key, options) {
    if (!input[1] && !input[2] && !input[3]) {
      throw new JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
    }
    if (options !== void 0) {
      input[8] = options?.crit;
      input[9] = options ? unprotected in options : false;
    }
    return encryptJWE(input, checkEncryptHeaders(input), key);
  }

  // dist/webapi/jwe/general/encrypt.js
  var IndividualRecipient = class {
    #parent;
    state;
    constructor(enc, key, crit) {
      this.#parent = enc;
      this.state = [void 0, void 0, key, crit];
    }
    setUnprotectedHeader(unprotectedHeader) {
      assertNotSet(this.state[0], "setUnprotectedHeader");
      this.state[0] = unprotectedHeader;
      return this;
    }
    setKeyManagementParameters(parameters) {
      assertNotSet(this.state[1], "setKeyManagementParameters");
      this.state[1] = parameters;
      return this;
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
  };
  function copyOptionalMembers(flattened, jwe, recipient) {
    const { aad, protected: protectedHeader, unprotected: unprotected2, header } = flattened;
    if (aad)
      jwe.aad = aad;
    if (protectedHeader)
      jwe.protected = protectedHeader;
    if (unprotected2)
      jwe.unprotected = unprotected2;
    if (header)
      recipient.header = header;
  }
  var GeneralEncrypt = class {
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
      this.#recipients.push(recipient);
      return recipient;
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
      assertNotSet(this.#unprotectedHeader, "setSharedUnprotectedHeader");
      this.#unprotectedHeader = sharedUnprotectedHeader;
      return this;
    }
    setAdditionalAuthenticatedData(aad) {
      this.#aad = aad;
      return this;
    }
    async encrypt() {
      if (!this.#recipients.length) {
        throw new JWEInvalid("at least one recipient must be added");
      }
      assertUint8Array(this.#plaintext, "plaintext");
      if (this.#recipients.length === 1) {
        const [unprotectedHeader, keyManagementParameters, key, crit] = this.#recipients[0].state;
        const flattened = await createJWE([
          this.#plaintext,
          this.#protectedHeader,
          unprotectedHeader,
          this.#unprotectedHeader,
          this.#aad,
          void 0,
          void 0,
          keyManagementParameters,
          crit,
          false
        ], key);
        const jwe2 = {
          ciphertext: flattened.ciphertext,
          iv: flattened.iv,
          recipients: [{}],
          tag: flattened.tag
        };
        if (flattened.encrypted_key)
          jwe2.recipients[0].encrypted_key = flattened.encrypted_key;
        copyOptionalMembers(flattened, jwe2, jwe2.recipients[0]);
        return jwe2;
      }
      let enc;
      let protectedHeader = this.#protectedHeader;
      let sharedUnprotectedHeader = this.#unprotectedHeader;
      const inputs = [];
      const checked = [];
      for (let i = 0; i < this.#recipients.length; i++) {
        const recipient = this.#recipients[i];
        const [unprotectedHeader, keyManagementParameters, , crit] = recipient.state;
        const input = [
          this.#plaintext,
          protectedHeader,
          unprotectedHeader,
          sharedUnprotectedHeader,
          this.#aad,
          void 0,
          void 0,
          keyManagementParameters,
          crit,
          true
        ];
        const headers = checkEncryptHeaders(input);
        inputs.push(input);
        checked.push(headers);
        if (i === 0) {
          protectedHeader = input[1];
          sharedUnprotectedHeader = input[3];
        }
        if (headers[1] === "dir" || headers[1] === "ECDH-ES") {
          throw new JWEInvalid(`"${headers[1]}" alg may only have a single recipient`);
        }
        if (!enc) {
          enc = headers[2];
        } else if (enc !== headers[2]) {
          throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
        }
      }
      const cek = generateCek(checked[0][3]);
      const jwe = {
        ciphertext: "",
        recipients: []
      };
      for (let i = 0; i < this.#recipients.length; i++) {
        const recipient = this.#recipients[i];
        const [, keyManagementParameters, key] = recipient.state;
        const target = {};
        jwe.recipients.push(target);
        if (i === 0) {
          inputs[0][5] = cek;
          const flattened = await encryptJWE(inputs[0], checked[0], key);
          jwe.ciphertext = flattened.ciphertext;
          jwe.iv = flattened.iv;
          jwe.tag = flattened.tag;
          target.encrypted_key = flattened.encrypted_key;
          copyOptionalMembers(flattened, jwe, target);
          continue;
        }
        const [, alg, , encEntry] = checked[i];
        const unprotectedHeader = inputs[i][2];
        const k = await prepareKey(jweAlgorithm(alg), key, "encrypt");
        const [, encryptedKey, parameters] = await encryptKeyManagement(alg, encEntry, k, cek, keyManagementParameters);
        target.encrypted_key = encode2(encryptedKey);
        if (unprotectedHeader || parameters) {
          const header = { ...unprotectedHeader, ...parameters };
          if (parameters)
            checkDisjoint(inputs[i][1], header, inputs[i][3]);
          target.header = header;
        }
      }
      return jwe;
    }
  };

  // dist/webapi/lib/signing.js
  async function getSigKey(entry, key, usage) {
    if (key instanceof Uint8Array) {
      return crypto.subtle.importKey("raw", key, entry.subtle, false, [
        usage
      ]);
    }
    checkCryptoKey(key, entry.subtle, usage);
    if (entry.minRsaBits)
      checkModulusLength(entry.alg, key);
    return key;
  }
  async function sign(entry, key, data) {
    const cryptoKey = await getSigKey(entry, key, "sign");
    const signature = await crypto.subtle.sign(entry.signing, cryptoKey, data);
    return new Uint8Array(signature);
  }
  async function verify(entry, key, signature, data) {
    const cryptoKey = await getSigKey(entry, key, "verify");
    try {
      return await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
    } catch {
      return false;
    }
  }

  // dist/webapi/lib/jws_algorithms.js
  var sig = [["verify"], ["sign"]];
  function hmac(bits) {
    const subtle = { name: "HMAC", hash: `SHA-${bits}` };
    return { kty: ["oct"], secret: true, subtle, signing: subtle, usages: sig };
  }
  function rsa(bits, saltLength) {
    const name = saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5";
    const subtle = { name, hash: `SHA-${bits}` };
    return {
      kty: ["RSA"],
      subtle,
      signing: saltLength ? { ...subtle, saltLength } : subtle,
      usages: sig,
      minRsaBits: 2048
    };
  }
  function ecdsa(crv, bits) {
    return {
      kty: ["EC"],
      crv,
      subtle: { name: "ECDSA", namedCurve: crv },
      signing: { name: "ECDSA", hash: `SHA-${bits}` },
      usages: sig
    };
  }
  function eddsa() {
    const subtle = { name: "Ed25519" };
    return {
      kty: ["OKP"],
      crv: "Ed25519",
      subtle,
      signing: subtle,
      usages: sig
    };
  }
  function mldsa(bits) {
    const name = `ML-DSA-${bits}`;
    const subtle = { name };
    return {
      kty: ["AKP"],
      subtle,
      signing: subtle,
      usages: sig
    };
  }
  var JWS = table({
    HS256: hmac(256),
    HS384: hmac(384),
    HS512: hmac(512),
    RS256: rsa(256),
    RS384: rsa(384),
    RS512: rsa(512),
    PS256: rsa(256, 32),
    PS384: rsa(384, 48),
    PS512: rsa(512, 64),
    ES256: ecdsa("P-256", 256),
    ES384: ecdsa("P-384", 384),
    ES512: ecdsa("P-521", 512),
    EdDSA: eddsa(),
    Ed25519: eddsa(),
    "ML-DSA-44": mldsa(44),
    "ML-DSA-65": mldsa(65),
    "ML-DSA-87": mldsa(87)
  });
  function jwsAlgorithm(alg) {
    const entry = typeof alg === "string" ? JWS[alg] : void 0;
    if (!entry) {
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    return entry;
  }

  // dist/webapi/lib/jws_verify.js
  function snapshotJws(jws, sharedPayload) {
    const encodedProtected = jws.protected;
    const inputHeader = jws.header;
    const header = isObject(inputHeader) ? { ...inputHeader } : inputHeader;
    let payload = sharedPayload ? sharedPayload[0] : jws.payload;
    if (!sharedPayload && payload instanceof Uint8Array) {
      payload = new Uint8Array(payload);
    }
    const signature = jws.signature;
    const snapshot = { payload, signature };
    if (encodedProtected !== void 0)
      snapshot.protected = encodedProtected;
    if (inputHeader !== void 0)
      snapshot.header = header;
    return snapshot;
  }
  function verifyResult(jws, verified) {
    const [payload, parsedProt, , key, resolvedKey] = verified;
    const result = { payload };
    if (jws.protected !== void 0) {
      result.protectedHeader = parsedProt;
    }
    if (jws.header !== void 0) {
      result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
      return { ...result, key };
    }
    return result;
  }
  function prepareVerify(options) {
    return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
  }
  function parseProtectedHeader(encodedProtected, parsedProtected = encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid")) {
    return parsedProtected;
  }
  function validateJwsHeaders(parsedProt, joseHeader, shared) {
    const b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader));
    const alg = joseHeader.alg;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    if (shared[0] && !shared[0].has(alg)) {
      throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    return [b64, alg];
  }
  function parseJwsHeaders(encodedProtected, header, shared, parsedProtected) {
    const parsedProt = parseProtectedHeader(encodedProtected, parsedProtected);
    let joseHeader;
    if (header !== void 0) {
      if (!isDisjoint(parsedProt, header)) {
        throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
      }
      joseHeader = { ...parsedProt, ...header };
    } else {
      joseHeader = parsedProt;
    }
    return [parsedProt, joseHeader, ...validateJwsHeaders(parsedProt, joseHeader, shared)];
  }
  function encodeJsonUnencodedPayload(payload) {
    const invalid2 = /[\p{Cs}\p{Cn}]/u.exec(payload)?.[0];
    if (invalid2 !== void 0) {
      throw new JWSInvalid(/\p{Cs}/u.test(invalid2) ? "JWS Payload must be a well-formed Unicode string" : "JWS Payload must not contain unassigned Unicode code points");
    }
    return encoder.encode(payload);
  }
  function encodeCompactUnencodedPayload(payload) {
    try {
      return encode(payload);
    } catch {
      throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
    }
  }
  async function verifyPrepared(jws, shared, key, encodedProtected, parsedProt, alg, signingPayload) {
    let resolvedKey = false;
    if (typeof key === "function") {
      key = await key(parsedProt, jws);
      resolvedKey = true;
    }
    const b64 = typeof signingPayload === "string";
    const entry = jwsAlgorithm(alg);
    const data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array(), encode("."), b64 ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload);
    const signature = decodeBase64url(jws.signature, "signature", JWSInvalid);
    const k = await prepareKey(entry, key, "verify");
    if (!await verify(entry, k, signature, data)) {
      throw new JWSSignatureVerificationFailed();
    }
    const payload = b64 ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload;
    return [payload, parsedProt, b64, k, resolvedKey];
  }
  async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
    const { protected: encodedProtected, header, payload: inputPayload } = jws;
    const [parsedProt, , b64, alg] = parseJwsHeaders(encodedProtected, header, shared, parsedProtected);
    if (b64) {
      if (typeof inputPayload !== "string") {
        throw new JWSInvalid("JWS Payload must be a string");
      }
    } else if (typeof inputPayload !== "string" && !(inputPayload instanceof Uint8Array)) {
      throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
    }
    const signingPayload = b64 || typeof inputPayload !== "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
    return verifyPrepared(jws, shared, key, encodedProtected, parsedProt, alg, signingPayload);
  }
  async function verifyCompact(jws, shared, key) {
    if (jws instanceof Uint8Array) {
      jws = decoder.decode(jws);
    }
    if (typeof jws !== "string") {
      throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
    if (length !== 3) {
      throw new JWSInvalid("Invalid Compact JWS");
    }
    const compactJws = { payload, protected: protectedHeader, signature };
    const parsedProt = parseProtectedHeader(protectedHeader);
    const [b64, alg] = validateJwsHeaders(parsedProt, parsedProt, shared);
    const signingPayload = b64 ? payload : encodeCompactUnencodedPayload(payload);
    return verifyPrepared(compactJws, shared, key, protectedHeader, parsedProt, alg, signingPayload);
  }

  // dist/webapi/jws/compact/verify.js
  async function compactVerify(jws, key, options) {
    const verified = await verifyCompact(jws, prepareVerify(options), key);
    const result = { payload: verified[0], protectedHeader: verified[1] };
    if (typeof key === "function") {
      return { ...result, key: verified[3] };
    }
    return result;
  }

  // dist/webapi/jws/flattened/verify.js
  async function flattenedVerify(jws, key, options) {
    if (!isObject(jws)) {
      throw new JWSInvalid("Flattened JWS must be an object");
    }
    const snapshot = snapshotJws(jws);
    if (snapshot.protected === void 0 && snapshot.header === void 0) {
      throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (snapshot.protected !== void 0 && typeof snapshot.protected !== "string") {
      throw new JWSInvalid("JWS Protected Header incorrect type");
    }
    if (snapshot.payload === void 0) {
      throw new JWSInvalid("JWS Payload missing");
    }
    if (typeof snapshot.signature !== "string") {
      throw new JWSInvalid("JWS Signature missing or incorrect type");
    }
    if (snapshot.header !== void 0 && !isObject(snapshot.header)) {
      throw new JWSInvalid("JWS Unprotected Header incorrect type");
    }
    return verifyResult(snapshot, await verifySignature(snapshot, prepareVerify(options), key, encodeJsonUnencodedPayload));
  }

  // dist/webapi/jws/general/verify.js
  function snapshotSignature(signature, payload) {
    try {
      const jws = snapshotJws(signature, [payload]);
      const { protected: encodedProtected, header, signature: encodedSignature } = jws;
      if (encodedProtected === void 0 && header === void 0)
        return void 0;
      if (encodedProtected !== void 0 && typeof encodedProtected !== "string")
        return void 0;
      if (typeof encodedSignature !== "string")
        return void 0;
      if (header !== void 0 && !isObject(header))
        return void 0;
      const protectedHeader = parseProtectedHeader(encodedProtected);
      const { b64, crit } = protectedHeader;
      return [
        jws,
        protectedHeader,
        Array.isArray(crit) && crit.includes("b64") ? typeof b64 === "boolean" ? b64 ? 1 : 2 : 0 : 1
      ];
    } catch {
      return void 0;
    }
  }
  async function generalVerify(jws, key, options) {
    if (!isObject(jws)) {
      throw new JWSInvalid("General JWS must be an object");
    }
    const { signatures, payload: inputPayload } = jws;
    if (!Array.isArray(signatures)) {
      throw new JWSInvalid("JWS Signatures missing or incorrect type");
    }
    const signatureEntries = Array.from(signatures);
    if (!signatureEntries.every(isObject)) {
      throw new JWSInvalid("JWS Signatures missing or incorrect type");
    }
    let shared;
    try {
      if (inputPayload === void 0)
        throw new Error();
      shared = prepareVerify(options);
    } catch {
      throw new JWSSignatureVerificationFailed();
    }
    const payload = inputPayload instanceof Uint8Array ? new Uint8Array(inputPayload) : inputPayload;
    const candidates = signatureEntries.map((signature) => snapshotSignature(signature, payload)).filter((candidate) => candidate !== void 0);
    let modes = 0;
    for (const [, , mode] of candidates) {
      modes |= mode;
      if (modes === 3) {
        throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
      }
    }
    for (const candidate of candidates) {
      try {
        return verifyResult(candidate[0], await verifySignature(candidate[0], shared, key, encodeJsonUnencodedPayload, candidate[1]));
      } catch {
      }
    }
    throw new JWSSignatureVerificationFailed();
  }

  // dist/webapi/lib/jwt_claims_set.js
  var epoch = (date) => Math.floor(date.getTime() / 1e3);
  var multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31557600
  };
  var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
  var checkFailed = "check_failed";
  function invalidDuration() {
    throw new TypeError("Invalid time period format");
  }
  function secs(str) {
    if (typeof str !== "string") {
      invalidDuration();
    }
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
      invalidDuration();
    }
    const value = parseFloat(matched[2]);
    const numericDate2 = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
    if (!Number.isFinite(numericDate2)) {
      invalidDuration();
    }
    if (matched[1] === "-" || matched[4] === "ago") {
      return -numericDate2;
    }
    return numericDate2;
  }
  function validateInput(label, input) {
    if (!Number.isFinite(input)) {
      throw new TypeError(`Invalid ${label} input`);
    }
    return input;
  }
  function validateStringClaim(claim, value) {
    if (typeof value !== "string") {
      throw new TypeError(`"${claim}" claim must be a string`);
    }
  }
  function validateAudienceClaim(value) {
    if (typeof value !== "string" && (!Array.isArray(value) || Array.from(value).some((member) => typeof member !== "string"))) {
      throw new TypeError('"aud" claim must be a string or an array of strings');
    }
  }
  function numericDate(value, label) {
    if (typeof value === "number")
      return validateInput(label, value);
    if (value instanceof Date)
      return validateInput(label, epoch(value));
    return epoch(/* @__PURE__ */ new Date()) + secs(value);
  }
  var normalizeTyp = (value) => {
    const normalized = value.toLowerCase();
    return value.includes("/") ? normalized : `application/${normalized}`;
  };
  var checkAudiencePresence = (audPayload, audOption) => {
    if (typeof audPayload === "string") {
      return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
      return audOption.some((aud) => audPayload.includes(aud));
    }
    return false;
  };
  function validateNumericDate(payload, claim, required = false) {
    const value = payload[claim];
    if (value === void 0 && !required)
      return void 0;
    if (typeof value !== "number") {
      throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
    }
    return value;
  }
  function unexpectedClaim(payload, claim) {
    throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
  }
  function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
    let payload;
    try {
      payload = JSON.parse(strictDecoder.decode(encodedPayload));
    } catch {
    }
    if (!isObject(payload)) {
      throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
    }
    const { typ } = options;
    if (typ !== void 0 && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
      throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", checkFailed);
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [...requiredClaims];
    if (maxTokenAge !== void 0)
      presenceCheck.push("iat");
    if (audience !== void 0)
      presenceCheck.push("aud");
    if (subject !== void 0)
      presenceCheck.push("sub");
    if (issuer !== void 0)
      presenceCheck.push("iss");
    for (const claim of new Set(presenceCheck.reverse())) {
      if (!Object.hasOwn(payload, claim)) {
        throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
      }
    }
    if (issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
      unexpectedClaim(payload, "iss");
    }
    if (subject !== void 0 && payload.sub !== subject) {
      unexpectedClaim(payload, "sub");
    }
    if (audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
      unexpectedClaim(payload, "aud");
    }
    const { clockTolerance } = options;
    let tolerance = 0;
    if (typeof clockTolerance === "string") {
      tolerance = secs(clockTolerance);
    } else if (clockTolerance !== void 0) {
      if (typeof clockTolerance !== "number") {
        throw new TypeError("Invalid clockTolerance option type");
      }
      tolerance = clockTolerance;
    }
    validateInput("clockTolerance option", tolerance);
    const { currentDate } = options;
    const now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate));
    const iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0);
    const nbf = validateNumericDate(payload, "nbf");
    if (nbf !== void 0) {
      if (nbf > now + tolerance) {
        throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", checkFailed);
      }
    }
    const exp = validateNumericDate(payload, "exp");
    if (exp !== void 0) {
      if (exp <= now - tolerance) {
        throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", checkFailed);
      }
    }
    if (maxTokenAge !== void 0) {
      const age = now - iat;
      const max = validateInput("maxTokenAge option", typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge));
      if (age - tolerance > max) {
        throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", checkFailed);
      }
      if (age < -tolerance) {
        throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", checkFailed);
      }
    }
    return payload;
  }
  var producerPayloads;
  function producerPayload(producer) {
    return producerPayloads.get(producer);
  }
  function jwtData(producer) {
    const payload = producerPayload(producer);
    for (const claim of ["iat", "nbf", "exp"]) {
      const value = payload[claim];
      if (typeof value === "number" && !Number.isFinite(value)) {
        throw new TypeError(`"${claim}" claim must be a finite number`);
      }
    }
    return encoder.encode(JSON.stringify(payload));
  }
  function jwtClaim(producer, claim) {
    return producerPayload(producer)[claim];
  }
  var JWTClaimsBuilder = class {
    constructor(payload = {}) {
      if (!isObject(payload)) {
        throw new TypeError("JWT Claims Set MUST be an object");
      }
      ;
      (producerPayloads ||= /* @__PURE__ */ new WeakMap()).set(this, structuredClone(payload));
    }
    setIssuer(value) {
      validateStringClaim("iss", value);
      producerPayload(this).iss = value;
      return this;
    }
    setSubject(value) {
      validateStringClaim("sub", value);
      producerPayload(this).sub = value;
      return this;
    }
    setAudience(value) {
      validateAudienceClaim(value);
      producerPayload(this).aud = value;
      return this;
    }
    setJti(value) {
      validateStringClaim("jti", value);
      producerPayload(this).jti = value;
      return this;
    }
    setNotBefore(value) {
      producerPayload(this).nbf = numericDate(value, "setNotBefore");
      return this;
    }
    setExpirationTime(value) {
      producerPayload(this).exp = numericDate(value, "setExpirationTime");
      return this;
    }
    setIssuedAt(value) {
      const payload = producerPayload(this);
      if (value === void 0) {
        payload.iat = epoch(/* @__PURE__ */ new Date());
      } else if (typeof value === "string") {
        payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value));
      } else {
        payload.iat = numericDate(value, "setIssuedAt");
      }
      return this;
    }
  };

  // dist/webapi/jwt/verify.js
  async function jwtVerify(jwt, key, options) {
    const verified = await verifyCompact(jwt, prepareVerify(options), key);
    if (!verified[2]) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    const payload = validateClaimsSet(verified[1], verified[0], options);
    const result = { payload, protectedHeader: verified[1] };
    if (typeof key === "function") {
      return { ...result, key: verified[3] };
    }
    return result;
  }

  // dist/webapi/jwt/decrypt.js
  async function jwtDecrypt(jwt, key, options) {
    const decrypted = await decryptCompact(jwt, prepareDecrypt(options), key);
    const protectedHeader = decrypted[1];
    const payload = validateClaimsSet(protectedHeader, decrypted[0], options);
    for (const claim of ["iss", "sub", "aud"]) {
      if (protectedHeader[claim] !== void 0 && (claim === "aud" ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud) : protectedHeader[claim] !== payload[claim])) {
        throw new JWTClaimValidationFailed(`replicated "${claim}" claim header parameter mismatch`, payload, claim, "mismatch");
      }
    }
    const result = { payload, protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: decrypted[2] };
    }
    return result;
  }

  // dist/webapi/jwe/compact/encrypt.js
  var CompactEncrypt = class {
    #plaintext;
    #protectedHeader;
    #cek;
    #iv;
    #keyManagementParameters;
    constructor(plaintext) {
      assertUint8Array(plaintext, "plaintext");
      this.#plaintext = plaintext;
    }
    setContentEncryptionKey(cek) {
      assertNotSet(this.#cek, "setContentEncryptionKey");
      this.#cek = cek;
      return this;
    }
    setInitializationVector(iv) {
      assertNotSet(this.#iv, "setInitializationVector");
      this.#iv = iv;
      return this;
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    setKeyManagementParameters(parameters) {
      assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters");
      this.#keyManagementParameters = parameters;
      return this;
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
        false
      ], key, options);
      return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join(".");
    }
  };

  // dist/webapi/jwe/flattened/encrypt.js
  var FlattenedEncrypt = class {
    #plaintext;
    #protectedHeader;
    #sharedUnprotectedHeader;
    #unprotectedHeader;
    #aad;
    #cek;
    #iv;
    #keyManagementParameters;
    constructor(plaintext) {
      assertUint8Array(plaintext, "plaintext");
      this.#plaintext = plaintext;
    }
    setKeyManagementParameters(parameters) {
      assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters");
      this.#keyManagementParameters = parameters;
      return this;
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
      assertNotSet(this.#sharedUnprotectedHeader, "setSharedUnprotectedHeader");
      this.#sharedUnprotectedHeader = sharedUnprotectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      assertNotSet(this.#unprotectedHeader, "setUnprotectedHeader");
      this.#unprotectedHeader = unprotectedHeader;
      return this;
    }
    setAdditionalAuthenticatedData(aad) {
      this.#aad = aad;
      return this;
    }
    setContentEncryptionKey(cek) {
      assertNotSet(this.#cek, "setContentEncryptionKey");
      this.#cek = cek;
      return this;
    }
    setInitializationVector(iv) {
      assertNotSet(this.#iv, "setInitializationVector");
      this.#iv = iv;
      return this;
    }
    async encrypt(key, options) {
      return createJWE([
        this.#plaintext,
        this.#protectedHeader,
        this.#unprotectedHeader,
        this.#sharedUnprotectedHeader,
        this.#aad,
        this.#cek,
        this.#iv,
        this.#keyManagementParameters,
        void 0,
        false
      ], key, options);
    }
  };

  // dist/webapi/lib/jws_sign.js
  function serializeProtectedHeader(protectedHeader) {
    if (protectedHeader === void 0)
      return [void 0, ""];
    const normalized = serializeJoseHeader(JWSInvalid, protectedHeader);
    return [normalized[0], encode2(normalized[1])];
  }
  function validateSignatureHeader(protectedHeader, joseHeader, crit) {
    validateCritDuplicates(JWSInvalid, protectedHeader);
    return validateB64(protectedHeader, validateCrit(JWSInvalid, JWS_RECOGNIZED, crit, protectedHeader, joseHeader));
  }
  function signatureAlgorithm(joseHeader) {
    const alg = joseHeader.alg;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    return jwsAlgorithm(alg);
  }
  async function signSignature(protectedHeader, payload, entry, key) {
    const data = concat(encode(protectedHeader), encode("."), payload);
    const k = await prepareKey(entry, key, "sign");
    return encode2(await sign(entry, k, data));
  }
  async function createSignature(input, key, assertB64) {
    let { protectedHeader, unprotectedHeader } = input;
    let protectedHeaderString;
    [protectedHeader, protectedHeaderString] = serializeProtectedHeader(protectedHeader);
    if (unprotectedHeader !== void 0) {
      unprotectedHeader = serializeJoseHeader(JWSInvalid, unprotectedHeader)[0];
    }
    if (!protectedHeader && !unprotectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    if (!isDisjoint(protectedHeader, unprotectedHeader)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = { ...protectedHeader, ...unprotectedHeader };
    const b64 = validateSignatureHeader(protectedHeader, joseHeader, input.crit);
    assertB64?.(b64);
    const entry = signatureAlgorithm(joseHeader);
    let payloadS;
    let payloadB;
    if (b64) {
      const encoded = input.encoded ??= [];
      encoded[0] ??= encode2(input.payload);
      encoded[1] ??= encode(encoded[0]);
      payloadS = encoded[0];
      payloadB = encoded[1];
    } else {
      payloadB = input.payload;
      payloadS = "";
    }
    const jws = {
      signature: await signSignature(protectedHeaderString, payloadB, entry, key),
      payload: payloadS
    };
    if (protectedHeader) {
      jws.protected = protectedHeaderString;
    }
    if (unprotectedHeader) {
      jws.header = unprotectedHeader;
    }
    return [jws, b64];
  }
  async function createCompactSignature(payload, inputProtectedHeader, inputCrit, key, rejectUnencoded) {
    const [protectedHeader, protectedHeaderString] = serializeProtectedHeader(inputProtectedHeader);
    if (!protectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    const b64 = validateSignatureHeader(protectedHeader, protectedHeader, inputCrit);
    if (!b64)
      rejectUnencoded();
    const entry = signatureAlgorithm(protectedHeader);
    const encodedPayload = encode2(payload);
    const signature = await signSignature(protectedHeaderString, encode(encodedPayload), entry, key);
    return `${protectedHeaderString}.${encodedPayload}.${signature}`;
  }

  // dist/webapi/jws/compact/sign.js
  var CompactSign = class {
    #payload;
    #protectedHeader;
    constructor(payload) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError("payload must be an instance of Uint8Array");
      }
      this.#payload = payload;
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    async sign(key, options) {
      return createCompactSignature(this.#payload, this.#protectedHeader, options?.crit, key, () => {
        throw new TypeError("use the flattened module for creating JWS with b64: false");
      });
    }
  };

  // dist/webapi/jws/flattened/sign.js
  var FlattenedSign = class {
    #payload;
    #protectedHeader;
    #unprotectedHeader;
    constructor(payload) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError("payload must be an instance of Uint8Array");
      }
      this.#payload = payload;
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      assertNotSet(this.#unprotectedHeader, "setUnprotectedHeader");
      this.#unprotectedHeader = unprotectedHeader;
      return this;
    }
    async sign(key, options) {
      const [jws] = await createSignature({
        payload: this.#payload,
        protectedHeader: this.#protectedHeader,
        unprotectedHeader: this.#unprotectedHeader,
        crit: options?.crit
      }, key);
      return jws;
    }
  };

  // dist/webapi/jws/general/sign.js
  var IndividualSignature = class {
    #parent;
    state;
    constructor(sig2, key, options) {
      this.#parent = sig2;
      this.state = [void 0, void 0, key, options?.crit];
    }
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.state[0], "setProtectedHeader");
      this.state[0] = protectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      assertNotSet(this.state[1], "setUnprotectedHeader");
      this.state[1] = unprotectedHeader;
      return this;
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
  };
  var GeneralSign = class {
    #payload;
    #signatures = [];
    constructor(payload) {
      this.#payload = payload;
    }
    addSignature(key, options) {
      const signature = new IndividualSignature(this, key, options);
      this.#signatures.push(signature);
      return signature;
    }
    async sign() {
      if (!this.#signatures.length) {
        throw new JWSInvalid("at least one signature must be added");
      }
      if (!(this.#payload instanceof Uint8Array)) {
        throw new TypeError("payload must be an instance of Uint8Array");
      }
      const jws = {
        signatures: [],
        payload: ""
      };
      const encoded = [];
      let b64;
      for (let i = 0; i < this.#signatures.length; i++) {
        const signature = this.#signatures[i];
        const [protectedHeader, unprotectedHeader, key, crit] = signature.state;
        const [{ payload, ...rest }, signatureB64] = await createSignature({
          payload: this.#payload,
          protectedHeader,
          unprotectedHeader,
          crit,
          encoded
        }, key);
        if (b64 === void 0) {
          b64 = signatureB64;
          jws.payload = payload;
        } else if (b64 !== signatureB64) {
          throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
        }
        jws.signatures.push(rest);
      }
      return jws;
    }
  };

  // dist/webapi/jwt/sign.js
  var SignJWT_base = JWTClaimsBuilder;
  var SignJWT = class extends SignJWT_base {
    #protectedHeader;
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    async sign(key, options) {
      return createCompactSignature(jwtData(this), this.#protectedHeader, options?.crit, key, () => {
        throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
      });
    }
  };

  // dist/webapi/jwt/encrypt.js
  var EncryptJWT_base = JWTClaimsBuilder;
  var EncryptJWT = class extends EncryptJWT_base {
    #cek;
    #iv;
    #keyManagementParameters;
    #protectedHeader;
    #replicateIssuerAsHeader;
    #replicateSubjectAsHeader;
    #replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader) {
      assertNotSet(this.#protectedHeader, "setProtectedHeader");
      this.#protectedHeader = protectedHeader;
      return this;
    }
    setKeyManagementParameters(parameters) {
      assertNotSet(this.#keyManagementParameters, "setKeyManagementParameters");
      this.#keyManagementParameters = parameters;
      return this;
    }
    setContentEncryptionKey(cek) {
      assertNotSet(this.#cek, "setContentEncryptionKey");
      this.#cek = cek;
      return this;
    }
    setInitializationVector(iv) {
      assertNotSet(this.#iv, "setInitializationVector");
      this.#iv = iv;
      return this;
    }
    replicateIssuerAsHeader() {
      this.#replicateIssuerAsHeader = true;
      return this;
    }
    replicateSubjectAsHeader() {
      this.#replicateSubjectAsHeader = true;
      return this;
    }
    replicateAudienceAsHeader() {
      this.#replicateAudienceAsHeader = true;
      return this;
    }
    async encrypt(key, options) {
      const plaintext = jwtData(this);
      if (this.#protectedHeader && (this.#replicateIssuerAsHeader || this.#replicateSubjectAsHeader || this.#replicateAudienceAsHeader)) {
        this.#protectedHeader = {
          ...this.#protectedHeader,
          iss: this.#replicateIssuerAsHeader ? jwtClaim(this, "iss") : void 0,
          sub: this.#replicateSubjectAsHeader ? jwtClaim(this, "sub") : void 0,
          aud: this.#replicateAudienceAsHeader ? jwtClaim(this, "aud") : void 0
        };
      }
      const jwe = await createJWE([
        plaintext,
        this.#protectedHeader,
        void 0,
        void 0,
        void 0,
        this.#cek,
        this.#iv,
        this.#keyManagementParameters,
        void 0,
        false
      ], key, options);
      return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join(".");
    }
  };

  // dist/webapi/lib/key_algorithm.js
  var algArgument = '"alg" (Algorithm)';
  function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter') {
    throw new JOSENotSupported(`Invalid or unsupported ${source} value`);
  }
  function keyAlgorithm(alg, source) {
    return (typeof alg === "string" ? JWS[alg] ?? JWE[alg] : void 0) ?? unsupportedAlg(source);
  }

  // dist/webapi/lib/key_options.js
  function validateExtractableOption(extractable) {
    if (extractable !== void 0 && typeof extractable !== "boolean") {
      throw new TypeError('"extractable" option must be a boolean');
    }
    return extractable;
  }

  // dist/webapi/lib/asn1.js
  var formatPEM = (b64, descriptor) => {
    const newlined = (b64.match(/.{1,64}/g) || []).join("\n");
    return `-----BEGIN ${descriptor}-----
${newlined}
-----END ${descriptor}-----`;
  };
  var genericExport = async (keyType, keyFormat, key) => {
    if (isKeyObject(key)) {
      if (key.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
      }
      return key.export({ format: "pem", type: keyFormat });
    }
    if (!isCryptoKey(key)) {
      throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject"));
    }
    if (!key.extractable) {
      throw new TypeError("CryptoKey is not extractable");
    }
    if (key.type !== keyType) {
      throw new TypeError(`key is not a ${keyType} key`);
    }
    return formatPEM(encodeBase64(new Uint8Array(await crypto.subtle.exportKey(keyFormat, key))), `${keyType.toUpperCase()} KEY`);
  };
  var toSPKI = (key) => genericExport("public", "spki", key);
  var toPKCS8 = (key) => genericExport("private", "pkcs8", key);
  var bytesEqual = (a, b) => {
    if (a.byteLength !== b.length)
      return false;
    for (let i = 0; i < a.byteLength; i++) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  };
  var createASN1State = (data) => ({ data, pos: 0 });
  var readByte = (state) => {
    const byte = state.data[state.pos++];
    if (byte === void 0) {
      throw new Error("Unexpected end of ASN.1 input");
    }
    return byte;
  };
  var parseLength = (state) => {
    const first = readByte(state);
    if (first & 128) {
      const lengthOfLen = first & 127;
      let length = 0;
      for (let i = 0; i < lengthOfLen; i++) {
        length = length << 8 | readByte(state);
      }
      return length;
    }
    return first;
  };
  var skipElement = (state, count = 1) => {
    while (count-- > 0) {
      state.pos++;
      const length = parseLength(state);
      state.pos += length;
    }
  };
  var expectTag = (state, expectedTag, errorMessage) => {
    if (readByte(state) !== expectedTag) {
      throw new Error(errorMessage);
    }
  };
  var getSubarray = (state, length) => {
    if (length < 0 || state.pos + length > state.data.length) {
      throw new Error("Unexpected end of ASN.1 input");
    }
    const result = state.data.subarray(state.pos, state.pos + length);
    state.pos += length;
    return result;
  };
  var parseAlgorithmOID = (state) => {
    expectTag(state, 6, "Expected algorithm OID");
    const oidLen = parseLength(state);
    return getSubarray(state, oidLen);
  };
  function parseKeyHeader(state, keyFormat) {
    expectTag(state, 48, `Invalid ${keyFormat === "spki" ? "SPKI" : "PKCS#8"} structure`);
    parseLength(state);
    if (keyFormat === "pkcs8") {
      expectTag(state, 2, "Expected version field");
      const length = parseLength(state);
      state.pos += length;
    }
    expectTag(state, 48, "Expected algorithm identifier");
    parseLength(state);
  }
  var parseECAlgorithmIdentifier = (state) => {
    const algOid = parseAlgorithmOID(state);
    if (bytesEqual(algOid, [43, 101, 110])) {
      return "X25519";
    }
    if (!bytesEqual(algOid, [42, 134, 72, 206, 61, 2, 1])) {
      throw new Error("Unsupported key algorithm");
    }
    expectTag(state, 6, "Expected curve OID");
    const curveOidLen = parseLength(state);
    const curveOid = getSubarray(state, curveOidLen);
    if (bytesEqual(curveOid, [42, 134, 72, 206, 61, 3, 1, 7]))
      return "P-256";
    if (bytesEqual(curveOid, [43, 129, 4, 0, 34]))
      return "P-384";
    if (bytesEqual(curveOid, [43, 129, 4, 0, 35]))
      return "P-521";
    throw new Error("Unsupported named curve");
  };
  var genericImport = async (keyFormat, keyData, alg, options) => {
    const extractable = validateExtractableOption(options?.extractable);
    const entry = keyAlgorithm(alg, algArgument);
    if (entry.secret) {
      unsupportedAlg(algArgument);
    }
    const isPublic = keyFormat === "spki";
    let algorithm;
    if (entry.resolve) {
      try {
        const state = createASN1State(keyData);
        parseKeyHeader(state, keyFormat);
        algorithm = entry.resolve({ crv: parseECAlgorithmIdentifier(state) });
      } catch {
        throw new JOSENotSupported("Invalid or unsupported key format");
      }
    } else {
      algorithm = entry.subtle;
    }
    return crypto.subtle.importKey(keyFormat, keyData, algorithm, extractable ?? isPublic, entry.usages[isPublic ? 0 : 1]);
  };
  var processPEMData = (pem, pattern) => {
    return decodeBase64(pem.replace(pattern, ""));
  };
  var fromPKCS8 = (pem, alg, options) => {
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
    return genericImport("pkcs8", keyData, alg, options);
  };
  var fromSPKI = (pem, alg, options) => {
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g);
    return genericImport("spki", keyData, alg, options);
  };
  function spkiFromX509(buf) {
    const state = createASN1State(buf);
    expectTag(state, 48, "Invalid certificate structure");
    const certificateLength = parseLength(state);
    if (certificateLength < 0 || state.pos + certificateLength > state.data.length) {
      throw new Error("Unexpected end of ASN.1 input");
    }
    expectTag(state, 48, "Invalid tbsCertificate structure");
    parseLength(state);
    if (buf[state.pos] === 160) {
      skipElement(state, 6);
    } else {
      skipElement(state, 5);
    }
    const spkiStart = state.pos;
    expectTag(state, 48, "Invalid SPKI structure");
    const spkiContentLen = parseLength(state);
    return buf.subarray(spkiStart, spkiStart + spkiContentLen + (state.pos - spkiStart));
  }
  var fromX509 = (pem, alg, options) => {
    let spki;
    try {
      const certificate = processPEMData(pem, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
      spki = spkiFromX509(certificate);
    } catch (cause) {
      throw new TypeError("Failed to parse the X.509 certificate", { cause });
    }
    return genericImport("spki", spki, alg, options);
  };

  // dist/webapi/key/export.js
  function omitUndefinedProperties(jwk) {
    return Object.fromEntries(Object.entries(jwk).filter(([, value]) => value !== void 0));
  }
  async function keyToJWK(key) {
    if (isKeyObject(key)) {
      if (key.type === "secret") {
        key = key.export();
      } else {
        return key.export({ format: "jwk" });
      }
    }
    if (key instanceof Uint8Array) {
      return {
        kty: "oct",
        k: encode2(key)
      };
    }
    if (!isCryptoKey(key)) {
      throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject", "Uint8Array"));
    }
    if (!key.extractable) {
      throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");
    }
    const { ext, key_ops, alg, use, ...jwk } = omitUndefinedProperties(await crypto.subtle.exportKey("jwk", key));
    if (jwk.kty === "AKP") {
      ;
      jwk.alg = alg;
    }
    return jwk;
  }
  function exportSPKI(key) {
    return toSPKI(key);
  }
  function exportPKCS8(key) {
    return toPKCS8(key);
  }
  function exportJWK(key) {
    return keyToJWK(key);
  }

  // dist/webapi/jwk/thumbprint.js
  var check = (value, description) => {
    if (typeof value !== "string" || !value) {
      throw new JWKInvalid(`${description} missing or invalid`);
    }
  };
  async function calculateJwkThumbprint(key, digestAlgorithm) {
    let jwk;
    if (isObject(key)) {
      jwk = snapshotJwk(key);
      if (typeof jwk.kty !== "string") {
        throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject", "JSON Web Key"));
      }
    } else if (isKeyLike(key)) {
      jwk = snapshotJwk(await exportJWK(key));
    } else {
      throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    }
    digestAlgorithm ??= "sha256";
    if (digestAlgorithm !== "sha256" && digestAlgorithm !== "sha384" && digestAlgorithm !== "sha512") {
      throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
    }
    let components;
    switch (jwk.kty) {
      case "AKP":
        check(jwk.alg, '"alg" (Algorithm) Parameter');
        check(jwk.pub, '"pub" (Public key) Parameter');
        components = { alg: jwk.alg, kty: jwk.kty, pub: jwk.pub };
        break;
      case "EC":
        check(jwk.crv, '"crv" (Curve) Parameter');
        check(jwk.x, '"x" (X Coordinate) Parameter');
        check(jwk.y, '"y" (Y Coordinate) Parameter');
        components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
        break;
      case "OKP":
        check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
        check(jwk.x, '"x" (Public Key) Parameter');
        components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
        break;
      case "RSA":
        check(jwk.e, '"e" (Exponent) Parameter');
        check(jwk.n, '"n" (Modulus) Parameter');
        components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
        break;
      case "oct":
        if (typeof jwk.k !== "string") {
          throw new JWKInvalid('"k" (Key Value) Parameter missing or invalid');
        }
        components = { k: jwk.k, kty: jwk.kty };
        break;
      default:
        throw new JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = encode(JSON.stringify(components));
    return encode2(await digest(digestAlgorithm, data));
  }
  async function calculateJwkThumbprintUri(key, digestAlgorithm) {
    digestAlgorithm ??= "sha256";
    const thumbprint = await calculateJwkThumbprint(key, digestAlgorithm);
    return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`;
  }

  // dist/webapi/jwk/embedded.js
  async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
      ...protectedHeader,
      ...token?.header
    };
    if (!isObject(joseHeader.jwk)) {
      throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    let jwk;
    try {
      jwk = normalizeJwk(joseHeader.jwk);
    } catch (cause) {
      throw new JWSInvalid("Invalid Embedded JWK", { cause });
    }
    const entry = jwsAlgorithm(joseHeader.alg);
    if (jwk.use !== void 0 && jwk.use !== "sig") {
      throw new JWSInvalid('Invalid Embedded JWK, its "use" must be "sig" when present');
    }
    if (jwk.alg !== void 0 && jwk.alg !== entry.alg) {
      throw new JWSInvalid(`Invalid Embedded JWK, its "alg" must be "${entry.alg}" when present`);
    }
    const key = await jwkToKey(entry, { ...jwk, ext: true });
    if (key.type !== "public") {
      throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
  }

  // dist/webapi/jwks/local.js
  function isUsableJWK(jwk, entry, alg, kid) {
    const { kty, key_ops, ext, kid: jwkKid, alg: jwkAlg, use, crv } = snapshotJwk(jwk);
    const keyOps = Array.isArray(key_ops) ? [...key_ops] : key_ops;
    return (ext === void 0 || typeof ext === "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index) => typeof operation === "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid === "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
  }
  async function importWithAlgCache(cache2, jwk, entry) {
    const cached2 = cache2.get(jwk) || cache2.set(jwk, {}).get(jwk);
    const { alg } = entry;
    if (cached2[alg] === void 0) {
      const key = await jwkToKey(entry, { ...jwk, alg, ext: true });
      if (key.type !== "public") {
        throw new JWKSInvalid("JSON Web Key Set members must be public keys");
      }
      cached2[alg] = key;
    }
    return cached2[alg];
  }
  function createLocalJWKSet(jwks) {
    let snapshot;
    try {
      snapshot = structuredClone(jwks);
    } catch {
    }
    if (!isJwkSet(snapshot)) {
      throw new JWKSInvalid("JSON Web Key Set malformed");
    }
    const cached2 = /* @__PURE__ */ new WeakMap();
    const localJWKSet = async (protectedHeader, token) => {
      const { alg, kid } = { ...protectedHeader, ...token?.header };
      const entry = typeof alg === "string" ? JWS[alg] : void 0;
      if (!entry || entry.secret) {
        throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
      }
      const candidates = snapshot.keys.filter((jwk2) => isUsableJWK(jwk2, entry, alg, kid));
      const { 0: jwk, length } = candidates;
      if (!length) {
        throw new JWKSNoMatchingKey();
      }
      if (length !== 1) {
        const error = new JWKSMultipleMatchingKeys();
        error[Symbol.asyncIterator] = async function* () {
          for (const jwk2 of candidates) {
            try {
              yield await importWithAlgCache(cached2, jwk2, entry);
            } catch {
            }
          }
        };
        throw error;
      }
      return importWithAlgCache(cached2, jwk, entry);
    };
    return Object.defineProperty(localJWKSet, "jwks", {
      value: () => structuredClone(snapshot)
    });
  }

  // dist/webapi/jwks/remote.js
  function isCloudflareWorkers() {
    return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
  }
  var USER_AGENT;
  if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
    const NAME = "jose";
    const VERSION = "v6.2.10";
    USER_AGENT = `${NAME}/${VERSION}`;
  }
  var customFetch = /* @__PURE__ */ Symbol();
  async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
    const response = await fetchImpl(url, {
      method: "GET",
      signal,
      redirect: "manual",
      headers
    }).catch((err) => {
      if (err.name === "TimeoutError") {
        throw new JWKSTimeout();
      }
      throw err;
    });
    if (response.status !== 200) {
      throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
    }
    try {
      return await response.json();
    } catch {
      throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
  }
  var jwksCache = /* @__PURE__ */ Symbol();
  function isFreshFor(timestamp, duration) {
    return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
  }
  function validateDuration(value, fallback, option) {
    if (Number.isNaN(value)) {
      throw new TypeError(`"${option}" option must not be NaN`);
    }
    return typeof value === "number" ? value : fallback;
  }
  function createRemoteJWKSet(url, options) {
    if (!(url instanceof URL)) {
      throw new TypeError("url must be an instance of URL");
    }
    const href = new URL(url.href).href;
    const opts = options ?? {};
    const timeoutOption = opts.timeoutDuration;
    if (typeof timeoutOption === "number" && (!Number.isInteger(timeoutOption) || timeoutOption < 0)) {
      throw new TypeError('"timeoutDuration" option must be a non-negative integer');
    }
    const timeoutDuration = typeof timeoutOption === "number" ? timeoutOption : 5e3;
    const cooldownDuration = validateDuration(opts.cooldownDuration, 3e4, "cooldownDuration");
    const cacheMaxAge = validateDuration(opts.cacheMaxAge, 6e5, "cacheMaxAge");
    const headers = new Headers(opts.headers);
    if (USER_AGENT && !headers.has("User-Agent")) {
      headers.set("User-Agent", USER_AGENT);
    }
    if (!headers.has("accept")) {
      headers.set("accept", "application/json, application/jwk-set+json");
    }
    const fetchImpl = opts[customFetch];
    const cache2 = opts[jwksCache];
    let jwksTimestamp;
    let pendingFetch;
    let reloadSequence = 0;
    let appliedSequence = 0;
    let local;
    if (cache2 && typeof cache2 === "object") {
      const { uat, jwks } = cache2;
      if (isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks)) {
        jwksTimestamp = uat;
        local = createLocalJWKSet(jwks);
      }
    }
    const reload = async () => {
      if (pendingFetch && isCloudflareWorkers()) {
        pendingFetch = void 0;
      }
      if (!pendingFetch) {
        const sequence = ++reloadSequence;
        const current = pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl).then((json) => {
          const next = createLocalJWKSet(json);
          if (sequence <= appliedSequence) {
            return;
          }
          local = next;
          const updatedAt = Date.now();
          if (cache2) {
            cache2.uat = updatedAt;
            cache2.jwks = json;
          }
          jwksTimestamp = updatedAt;
          appliedSequence = sequence;
        }).finally(() => {
          if (pendingFetch === current) {
            pendingFetch = void 0;
          }
        });
      }
      await pendingFetch;
    };
    const remoteJWKSet = async (protectedHeader, token) => {
      if (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) {
        await reload();
      }
      try {
        return await local(protectedHeader, token);
      } catch (err) {
        if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration)) {
          await reload();
          return local(protectedHeader, token);
        }
        throw err;
      }
    };
    return Object.defineProperties(remoteJWKSet, {
      coolingDown: {
        get: () => isFreshFor(jwksTimestamp, cooldownDuration),
        enumerable: true
      },
      fresh: {
        get: () => isFreshFor(jwksTimestamp, cacheMaxAge),
        enumerable: true
      },
      reload: {
        value: reload,
        enumerable: true
      },
      reloading: {
        get: () => !!pendingFetch,
        enumerable: true
      },
      jwks: {
        value: () => local?.jwks(),
        enumerable: true
      }
    });
  }

  // dist/webapi/jwt/unsecured.js
  var UnsecuredJWT_base = JWTClaimsBuilder;
  var UnsecuredJWT = class extends UnsecuredJWT_base {
    encode() {
      const header = encode2(JSON.stringify({ alg: "none" }));
      const payload = encode2(jwtData(this));
      return `${header}.${payload}.`;
    }
    static decode(jwt, options) {
      if (typeof jwt !== "string") {
        throw new JWTInvalid("Unsecured JWT must be a string");
      }
      const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split(".");
      if (length !== 3 || signature !== "") {
        throw new JWTInvalid("Invalid Unsecured JWT");
      }
      let header;
      let b64;
      try {
        header = parseJoseHeader(encodedHeader, JWSInvalid, "JWS Protected Header is invalid");
        const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, void 0, header, header);
        b64 = validateB64(header, extensions);
      } catch (cause) {
        if (!(cause instanceof JWSInvalid)) {
          throw cause;
        }
        throw new JWTInvalid("Invalid Unsecured JWT", { cause });
      }
      if (header.alg !== "none") {
        throw new JWTInvalid("Invalid Unsecured JWT");
      }
      if (!b64) {
        throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
      }
      const payload = validateClaimsSet(header, decodeBase64url(encodedPayload, "payload", JWTInvalid), options);
      return { payload, header };
    }
  };

  // dist/webapi/key/import.js
  async function importSPKI(spki, alg, options) {
    if (typeof spki !== "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) {
      throw new TypeError('"spki" must be SPKI formatted string');
    }
    return fromSPKI(spki, alg, options);
  }
  async function importX509(x509, alg, options) {
    if (typeof x509 !== "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0) {
      throw new TypeError('"x509" must be X.509 formatted string');
    }
    return fromX509(x509, alg, options);
  }
  async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) {
      throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return fromPKCS8(pkcs8, alg, options);
  }
  async function importJWK(jwk, alg, options) {
    if (!isObject(jwk)) {
      throw new TypeError("JWK must be an object");
    }
    const normalized = normalizeJwk(jwk);
    const extractable = validateExtractableOption(options?.extractable);
    const { alg: jwkAlg } = normalized;
    alg ??= jwkAlg;
    const ext = extractable ?? normalized.ext;
    if (normalized.kty !== "oct" && !alg) {
      throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    }
    switch (normalized.kty) {
      case "oct":
        if (typeof normalized.k !== "string") {
          throw new TypeError('missing "k" (Key Value) Parameter value');
        }
        return decode(normalized.k);
      case "AKP": {
        if (typeof jwkAlg !== "string" || !jwkAlg) {
          throw new TypeError('missing "alg" (Algorithm) Parameter value');
        }
        if (alg !== jwkAlg) {
          throw new TypeError("JWK alg and alg option value mismatch");
        }
        return jwkToKey(keyAlgorithm(alg), { ...normalized, ext });
      }
      case "RSA":
      case "EC":
      case "OKP":
        return jwkToKey(keyAlgorithm(alg), { ...normalized, alg, ext });
      default:
        throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
    }
  }

  // dist/webapi/util/decode_protected_header.js
  function decodeProtectedHeader(token) {
    let protectedB64u;
    if (typeof token === "string") {
      const parts = token.split(".");
      if (parts.length === 3 || parts.length === 5) {
        ;
        [protectedB64u] = parts;
      }
    } else if (typeof token === "object" && token) {
      if ("protected" in token) {
        protectedB64u = token.protected;
      } else {
        throw new TypeError("Token does not contain a Protected Header");
      }
    }
    const invalid2 = "Invalid Token or Protected Header formatting";
    if (typeof protectedB64u !== "string" || !protectedB64u) {
      throw new TypeError(invalid2);
    }
    return parseJoseHeader(protectedB64u, TypeError, invalid2);
  }

  // dist/webapi/util/decode_jwt.js
  function decodeJwt(jwt) {
    if (typeof jwt !== "string")
      throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload, length } = jwt.split(".");
    if (length === 5)
      throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3)
      throw new JWTInvalid("Invalid JWT");
    if (!payload)
      throw new JWTInvalid("JWTs must contain a payload");
    let decoded;
    try {
      decoded = decode(payload);
    } catch {
      throw new JWTInvalid("Failed to base64url decode the payload");
    }
    let result;
    try {
      result = JSON.parse(strictDecoder.decode(decoded));
    } catch {
      throw new JWTInvalid("Failed to parse the decoded payload as JSON");
    }
    if (!isObject(result))
      throw new JWTInvalid("Invalid JWT Claims Set");
    return result;
  }

  // dist/webapi/key/generate_key_pair.js
  function getModulusLengthOption(options) {
    const modulusLength = options?.modulusLength ?? 2048;
    if (typeof modulusLength !== "number" || !Number.isInteger(modulusLength) || modulusLength < 2048) {
      throw new JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
    }
    return modulusLength;
  }
  async function generateKeyPair(alg, options) {
    const extractable = validateExtractableOption(options?.extractable);
    const entry = keyAlgorithm(alg, algArgument);
    if (entry.secret) {
      unsupportedAlg(algArgument);
    }
    let algorithm;
    if (entry.resolve) {
      const crv = options?.crv ?? "P-256";
      switch (crv) {
        case "P-256":
        case "P-384":
        case "P-521":
          algorithm = { name: "ECDH", namedCurve: crv };
          break;
        case "X25519":
          algorithm = { name: "X25519" };
          break;
        default:
          throw new JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519");
      }
    } else {
      if (entry.crv !== void 0 && options?.crv !== void 0 && options.crv !== entry.crv) {
        throw new JOSENotSupported(`Invalid or unsupported crv option provided, the only supported value for ${alg} is ${entry.crv}`);
      }
      algorithm = entry.kty[0] === "RSA" ? {
        ...entry.subtle,
        publicExponent: Uint8Array.of(1, 0, 1),
        modulusLength: getModulusLengthOption(options)
      } : entry.subtle;
    }
    return crypto.subtle.generateKey(algorithm, extractable ?? false, [
      ...entry.usages[1],
      ...entry.usages[0]
    ]);
  }

  // dist/webapi/key/generate_secret.js
  async function generateSecret(alg, options) {
    const extractable = validateExtractableOption(options?.extractable);
    let length;
    let algorithm;
    let keyUsages;
    switch (alg) {
      case "HS256":
      case "HS384":
      case "HS512":
        length = +alg.slice(-3);
        algorithm = { name: "HMAC", hash: `SHA-${length}`, length };
        keyUsages = ["sign", "verify"];
        break;
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return crypto.getRandomValues(new Uint8Array(+alg.slice(-3) >> 3));
      case "A128KW":
      case "A192KW":
      case "A256KW":
        length = +alg.slice(1, 4);
        algorithm = { name: "AES-KW", length };
        keyUsages = ["wrapKey", "unwrapKey"];
        break;
      case "A128GCMKW":
      case "A192GCMKW":
      case "A256GCMKW":
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        length = +alg.slice(1, 4);
        algorithm = { name: "AES-GCM", length };
        keyUsages = ["encrypt", "decrypt"];
        break;
      default:
        unsupportedAlg(algArgument);
    }
    return crypto.subtle.generateKey(algorithm, extractable ?? false, keyUsages);
  }

  // dist/webapi/index.js
  var cryptoRuntime = "WebCryptoAPI";
  return __toCommonJS(index_exports);
}));
