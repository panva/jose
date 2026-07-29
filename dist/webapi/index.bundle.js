var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
  types = types.filter(Boolean);
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
  return { encKey, macKey, keySize };
}
async function cbcHmacTag(macKey, macData, keySize) {
  return new Uint8Array((await crypto.subtle.sign("HMAC", macKey, macData)).slice(0, keySize >> 3));
}
async function cbcEncrypt(enc, plaintext, cek, iv, aad) {
  const { encKey, macKey, keySize } = await cbcKeySetup(enc, cek, "encrypt");
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
    iv,
    name: "AES-CBC"
  }, encKey, plaintext));
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
  const tag2 = await cbcHmacTag(macKey, macData, keySize);
  return { ciphertext, tag: tag2, iv };
}
async function timingSafeEqual(a, b) {
  if (!(a instanceof Uint8Array)) {
    throw new TypeError("First argument must be a buffer");
  }
  if (!(b instanceof Uint8Array)) {
    throw new TypeError("Second argument must be a buffer");
  }
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await crypto.subtle.generateKey(algorithm, false, ["sign"]);
  const aHmac = new Uint8Array(await crypto.subtle.sign(algorithm, key, a));
  const bHmac = new Uint8Array(await crypto.subtle.sign(algorithm, key, b));
  let out = 0;
  let i = -1;
  while (++i < 32) {
    out |= aHmac[i] ^ bHmac[i];
  }
  return out === 0;
}
async function cbcDecrypt(enc, cek, ciphertext, iv, tag2, aad) {
  const { encKey, macKey, keySize } = await cbcKeySetup(enc, cek, "decrypt");
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8));
  const expectedTag = await cbcHmacTag(macKey, macData, keySize);
  let macCheckPassed;
  try {
    macCheckPassed = await timingSafeEqual(tag2, expectedTag);
  } catch {
  }
  if (!macCheckPassed) {
    throw new JWEDecryptionFailed();
  }
  let plaintext;
  try {
    plaintext = new Uint8Array(await crypto.subtle.decrypt({ iv, name: "AES-CBC" }, encKey, ciphertext));
  } catch {
  }
  if (!plaintext) {
    throw new JWEDecryptionFailed();
  }
  return plaintext;
}
async function gcmEncrypt(enc, plaintext, cek, iv, aad) {
  let encKey;
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  } else {
    checkCryptoKey(cek, enc.subtle, "encrypt");
    encKey = cek;
  }
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
  let encKey;
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  } else {
    checkCryptoKey(cek, enc.subtle, "decrypt");
    encKey = cek;
  }
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
function decode(input) {
  if (Uint8Array.fromBase64) {
    try {
      return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
        alphabet: "base64url"
      });
    } catch (cause) {
      throw new TypeError("The input to be decoded is not correctly encoded.", { cause });
    }
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  if (encoded.includes("+") || encoded.includes("/")) {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
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
var isObjectLike = (value) => typeof value === "object" && value !== null;
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}
function isDisjoint(...headers) {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}
var isJWK = (key) => isObject(key) && typeof key.kty === "string";
var isPrivateJWK = (key) => key.kty !== "oct" && (key.kty === "AKP" && typeof key.priv === "string" || typeof key.d === "string");
var isPublicJWK = (key) => key.kty !== "oct" && key.d === void 0 && key.priv === void 0;
var isSecretJWK = (key) => key.kty === "oct" && typeof key.k === "string";

// dist/webapi/lib/helpers.js
var unprotected = /* @__PURE__ */ Symbol();
function assertNotSet(value, name) {
  if (value) {
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
var unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
function subtleParams(entry, jwk) {
  if (!entry.kty.includes(jwk.kty)) {
    throw new JOSENotSupported(unsupportedAlg);
  }
  return entry.subtleFor?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle;
}
async function jwkToKey(entry, jwk) {
  if (jwk.kty === "RSA" && "oth" in jwk && jwk.oth !== void 0) {
    throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
  }
  const algorithm = subtleParams(entry, jwk);
  const isPrivate = !!(jwk.d || jwk.priv);
  const keyUsages = isPrivate ? entry.usages.private : entry.usages.public;
  const keyData = { ...jwk };
  if (keyData.kty !== "AKP") {
    delete keyData.alg;
  }
  delete keyData.use;
  return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? (isPrivate ? false : true), jwk.key_ops ?? keyUsages);
}

// dist/webapi/lib/key.js
var tag = (key) => key[Symbol.toStringTag];
var jwkMatchesOp = (entry, key, usage) => {
  const { alg } = entry;
  if (key.use !== void 0) {
    let expected;
    switch (usage) {
      case "sign":
      case "verify":
        expected = "sig";
        break;
      case "encrypt":
      case "decrypt":
        expected = "enc";
        break;
    }
    if (key.use !== expected) {
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  }
  if (Array.isArray(key.key_ops)) {
    const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.keyOps?.[usage] : usage;
    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
  }
  return true;
};
var symmetricTypeCheck = (entry, key, usage) => {
  const { alg } = entry;
  if (key instanceof Uint8Array)
    return { kind: BYTES, key };
  if (isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(entry, key, usage))
      return { kind: JWK, key };
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!isKeyLike(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
  return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key };
};
var asymmetricTypeCheck = (entry, key, usage) => {
  const { alg } = entry;
  if (isJWK(key)) {
    switch (usage) {
      case "decrypt":
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(entry, key, usage))
          return { kind: JWK, key };
        throw new TypeError(`JSON Web Key for this operation must be a private JWK`);
      case "encrypt":
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(entry, key, usage))
          return { kind: JWK, key };
        throw new TypeError(`JSON Web Key for this operation must be a public JWK`);
    }
  }
  if (!isKeyLike(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (key.type === "public") {
    switch (usage) {
      case "sign":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
      case "decrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
  }
  if (key.type === "private") {
    switch (usage) {
      case "verify":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
      case "encrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
  }
  return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key };
};
var BYTES = /* @__PURE__ */ Symbol();
var CRYPTO = /* @__PURE__ */ Symbol();
var KEYOBJECT = /* @__PURE__ */ Symbol();
var JWK = /* @__PURE__ */ Symbol();
function checkKeyType(entry, key, usage) {
  return entry.symmetric ? symmetricTypeCheck(entry, key, usage) : asymmetricTypeCheck(entry, key, usage);
}
var cache;
var nist = {
  __proto__: null,
  prime256v1: "P-256",
  secp384r1: "P-384",
  secp521r1: "P-521"
};
function cached(key, alg) {
  cache ||= /* @__PURE__ */ new WeakMap();
  return cache.get(key)?.[alg];
}
function store(key, alg, cryptoKey) {
  const entry = cache.get(key);
  if (entry) {
    entry[alg] = cryptoKey;
  } else {
    cache.set(key, { [alg]: cryptoKey });
  }
  return cryptoKey;
}
var handleJWK = async (key, jwk, entry) => {
  const hit = cached(key, entry.alg);
  if (hit)
    return hit;
  const cryptoKey = await jwkToKey(entry, { ...jwk, alg: entry.alg });
  return store(key, entry.alg, cryptoKey);
};
var handleKeyObject = (keyObject, entry) => {
  const hit = cached(keyObject, entry.alg);
  if (hit)
    return hit;
  const isPublic = keyObject.type === "public";
  const usages = isPublic ? entry.usages.public : entry.usages.private;
  const { asymmetricKeyType } = keyObject;
  const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
  const params = entry.subtleFor?.({ crv, asymmetricKeyType }) ?? entry.subtle;
  return store(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
async function prepareKey(entry, key, usage) {
  const tagged = checkKeyType(entry, key, usage);
  switch (tagged.kind) {
    case BYTES:
    case CRYPTO:
      return tagged.key;
    case JWK: {
      if (tagged.key.k) {
        return decode(tagged.key.k);
      }
      if (!Object.isFrozen(tagged.key)) {
        const { key_ops } = tagged.key;
        if (Array.isArray(key_ops))
          Object.freeze(key_ops);
        Object.freeze(tagged.key);
      }
      return handleJWK(tagged.key, tagged.key, entry);
    }
    case KEYOBJECT: {
      const keyObject = tagged.key;
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
  for (const alg of Object.keys(entries)) {
    out[alg] = { ...entries[alg], alg };
  }
  return out;
}

// dist/webapi/lib/jwe_algorithms.js
var wrap = {
  public: ["encrypt", "wrapKey"],
  private: ["decrypt", "unwrapKey"]
};
var derive = { public: [], private: ["deriveBits"] };
var none = { public: [], private: [] };
function rsaes(bits) {
  return {
    kty: ["RSA"],
    subtle: { name: "RSA-OAEP", hash: `SHA-${bits}` },
    usages: wrap,
    minModulusLength: 2048,
    keyOps: { encrypt: "wrapKey", decrypt: "unwrapKey" }
  };
}
function ecdh(kwBits) {
  return {
    kty: ["EC", "OKP"],
    subtle: { name: "ECDH" },
    subtleFor: ({ kty, crv, asymmetricKeyType }) => {
      if (crv === "X25519" || asymmetricKeyType === "x25519") {
        return { name: "X25519" };
      }
      if (kty === "OKP") {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      return { name: "ECDH", namedCurve: crv };
    },
    usages: derive,
    kwBits,
    keyOps: { decrypt: "deriveBits" }
  };
}
function aeskw(bits) {
  return {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "AES-KW", length: bits },
    usages: none,
    keyOps: { encrypt: "wrapKey", decrypt: "unwrapKey" }
  };
}
function aesgcmkw(bits) {
  return {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "AES-GCM", length: bits },
    usages: none,
    gcmkw: `A${bits}GCM`,
    keyOps: { encrypt: "encrypt", decrypt: "decrypt" }
  };
}
function pbes2(bits, kwBits) {
  return {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "PBKDF2" },
    usages: none,
    pbes2Hash: `SHA-${bits}`,
    kwBits,
    keyOps: { encrypt: "deriveBits", decrypt: "deriveBits" }
  };
}
var JWE = table({
  dir: {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "AES-GCM" },
    usages: none,
    keyOps: { encrypt: "encrypt", decrypt: "decrypt" }
  },
  "RSA-OAEP": rsaes(1),
  "RSA-OAEP-256": rsaes(256),
  "RSA-OAEP-384": rsaes(384),
  "RSA-OAEP-512": rsaes(512),
  "ECDH-ES": ecdh(),
  "ECDH-ES+A128KW": ecdh(128),
  "ECDH-ES+A192KW": ecdh(192),
  "ECDH-ES+A256KW": ecdh(256),
  A128KW: aeskw(128),
  A192KW: aeskw(192),
  A256KW: aeskw(256),
  A128GCMKW: aesgcmkw(128),
  A192GCMKW: aesgcmkw(192),
  A256GCMKW: aesgcmkw(256),
  "PBES2-HS256+A128KW": pbes2(256, 128),
  "PBES2-HS384+A192KW": pbes2(384, 192),
  "PBES2-HS512+A256KW": pbes2(512, 256)
});
var content = { public: [], private: [] };
var contentOps = { encrypt: "encrypt", decrypt: "decrypt" };
function gcm(bits) {
  return {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "AES-GCM", length: bits },
    usages: content,
    keyOps: contentOps,
    cekBits: bits,
    ivBits: 96,
    cbc: false
  };
}
function cbc(bits) {
  return {
    kty: ["oct"],
    symmetric: true,
    subtle: { name: "AES-CBC", length: bits },
    usages: content,
    keyOps: contentOps,
    cekBits: bits,
    ivBits: 128,
    cbc: true
  };
}
var ENC = table({
  A128GCM: gcm(128),
  A192GCM: gcm(192),
  A256GCM: gcm(256),
  "A128CBC-HS256": cbc(256),
  "A192CBC-HS384": cbc(384),
  "A256CBC-HS512": cbc(512)
});
var unsupportedAlgHeader = 'Invalid or unsupported "alg" (JWE Algorithm) header value';
function jweAlgorithm(alg) {
  const entry = JWE[alg];
  if (!entry) {
    throw new JOSENotSupported(unsupportedAlgHeader);
  }
  return entry;
}
function maybeJWEAlgorithm(alg) {
  return JWE[alg];
}
function jweEncryption(enc) {
  const entry = ENC[enc];
  if (!entry) {
    throw new JOSENotSupported(`Unsupported JWE Algorithm: ${enc}`);
  }
  return entry;
}

// dist/webapi/lib/signing.js
function checkModulusLength(alg, key) {
  const { modulusLength } = key.algorithm;
  if (typeof modulusLength !== "number" || modulusLength < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
  }
}
function checkSigCryptoKey(entry, key, usage) {
  checkCryptoKey(key, entry.subtle, usage);
  if (entry.minModulusLength) {
    checkModulusLength(entry.alg, key);
  }
}
async function getSigKey(entry, key, usage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey("raw", key, entry.subtle, false, [
      usage
    ]);
  }
  checkSigCryptoKey(entry, key, usage);
  return key;
}
async function sign(entry, key, data) {
  const cryptoKey = await getSigKey(entry, key, "sign");
  const signature = await crypto.subtle.sign(entry.operation, cryptoKey, data);
  return new Uint8Array(signature);
}
async function verify(entry, key, signature, data) {
  const cryptoKey = await getSigKey(entry, key, "verify");
  try {
    return await crypto.subtle.verify(entry.operation, cryptoKey, signature, data);
  } catch {
    return false;
  }
}

// dist/webapi/lib/key_management.js
function checkEcdhCryptoKey(key, usage) {
  switch (key.algorithm.name) {
    case "ECDH":
    case "X25519":
      break;
    default:
      throw new TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
  }
  checkUsage(key, usage);
}
function checkKeySize(key, alg) {
  if (key.algorithm.length !== parseInt(alg.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg}`);
  }
}
function aeskwCryptoKey(key, alg, usage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey("raw", key, "AES-KW", true, [usage]);
  }
  checkCryptoKey(key, jweAlgorithm(alg).subtle, usage);
  return key;
}
async function aeskwWrap(alg, key, cek) {
  const cryptoKey = await aeskwCryptoKey(key, alg, "wrapKey");
  checkKeySize(cryptoKey, alg);
  const cryptoKeyCek = await crypto.subtle.importKey("raw", cek, { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
  return new Uint8Array(await crypto.subtle.wrapKey("raw", cryptoKeyCek, cryptoKey, "AES-KW"));
}
async function aeskwUnwrap(alg, key, encryptedKey) {
  const cryptoKey = await aeskwCryptoKey(key, alg, "unwrapKey");
  checkKeySize(cryptoKey, alg);
  const cryptoKeyCek = await crypto.subtle.unwrapKey("raw", encryptedKey, cryptoKey, "AES-KW", { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
  return new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKeyCek));
}
async function aesGcmKwWrap(gcm2, key, cek, iv) {
  const wrapped = await encrypt(gcm2, cek, key, iv, new Uint8Array());
  return {
    encryptedKey: wrapped.ciphertext,
    iv: encode2(wrapped.iv),
    tag: encode2(wrapped.tag)
  };
}
async function aesGcmKwUnwrap(gcm2, key, encryptedKey, iv, tag2) {
  return decrypt(gcm2, key, encryptedKey, iv, tag2, new Uint8Array());
}
var subtleAlgorithm = (alg) => {
  switch (alg) {
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      return "RSA-OAEP";
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
};
async function rsaesEncrypt(alg, key, cek) {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, "encrypt");
  checkModulusLength(alg, key);
  return new Uint8Array(await crypto.subtle.encrypt(subtleAlgorithm(alg), key, cek));
}
async function rsaesDecrypt(alg, key, encryptedKey) {
  checkCryptoKey(key, jweAlgorithm(alg).subtle, "decrypt");
  checkModulusLength(alg, key);
  return new Uint8Array(await crypto.subtle.decrypt(subtleAlgorithm(alg), key, encryptedKey));
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
var concatSalt = (alg, p2sInput) => concat(encode(alg), Uint8Array.of(0), p2sInput);
async function deriveKey(p2s, alg, p2c, key) {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
    throw new JWEInvalid("PBES2 Salt Input must be 8 or more octets");
  }
  if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) {
    throw new JWEInvalid("PBES2 Count Input must be a positive integer");
  }
  const salt = concatSalt(alg, p2s);
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
async function pbes2kwWrap(alg, key, cek, p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16))) {
  const derived = await deriveKey(p2s, alg, p2c, key);
  const encryptedKey = await aeskwWrap(alg.slice(-6), derived, cek);
  return { encryptedKey, p2c, p2s: encode2(p2s) };
}
async function pbes2kwUnwrap(alg, key, encryptedKey, p2c, p2s) {
  const derived = await deriveKey(p2s, alg, p2c, key);
  return aeskwUnwrap(alg.slice(-6), derived, encryptedKey);
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
    const hashInput = new Uint8Array(4 + Z.length + OtherInfo.length);
    hashInput.set(uint32be(i), 0);
    hashInput.set(Z, 4);
    hashInput.set(OtherInfo, 4 + Z.length);
    const hashResult = await digest("sha256", hashInput);
    dk.set(hashResult, (i - 1) * hashLen);
  }
  return dk.slice(0, dkLen);
}
async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
  checkEcdhCryptoKey(publicKey);
  checkEcdhCryptoKey(privateKey, "deriveBits");
  const algorithmID = lengthAndInput(encode(algorithm));
  const partyUInfo = lengthAndInput(apu);
  const partyVInfo = lengthAndInput(apv);
  const suppPubInfo = uint32be(keyLength);
  const suppPrivInfo = new Uint8Array();
  const otherInfo = concat(algorithmID, partyUInfo, partyVInfo, suppPubInfo, suppPrivInfo);
  const Z = new Uint8Array(await crypto.subtle.deriveBits({
    name: publicKey.algorithm.name,
    public: publicKey
  }, privateKey, getEcdhBitLength(publicKey)));
  return concatKdf(Z, keyLength, otherInfo);
}
function getEcdhBitLength(publicKey) {
  if (publicKey.algorithm.name === "X25519") {
    return 256;
  }
  return Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3;
}
function ecdhesAllowed(key) {
  switch (key.algorithm.namedCurve) {
    case "P-256":
    case "P-384":
    case "P-521":
      return true;
    default:
      return key.algorithm.name === "X25519";
  }
}
var unsupportedAlgHeader2 = 'Invalid or unsupported "alg" (JWE Algorithm) header value';
function assertEncryptedKey(encryptedKey) {
  if (encryptedKey === void 0)
    throw new JWEInvalid("JWE Encrypted Key missing");
}
async function decryptKeyManagement(alg, enc, key, encryptedKey, joseHeader, options) {
  switch (alg) {
    case "dir": {
      if (encryptedKey !== void 0)
        throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
      return key;
    }
    case "ECDH-ES":
      if (encryptedKey !== void 0)
        throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!isObject(joseHeader.epk))
        throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
      assertCryptoKey(key);
      if (!ecdhesAllowed(key))
        throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
      const epk = await jwkToKey(jweAlgorithm(alg), joseHeader.epk);
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
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      assertEncryptedKey(encryptedKey);
      assertCryptoKey(key);
      return rsaesDecrypt(alg, key, encryptedKey);
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      assertEncryptedKey(encryptedKey);
      if (typeof joseHeader.p2c !== "number")
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
      const p2cLimit = options?.maxPBES2Count || 1e4;
      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
      if (typeof joseHeader.p2s !== "string")
        throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
      let p2s;
      p2s = decodeBase64url(joseHeader.p2s, "p2s", JWEInvalid);
      return pbes2kwUnwrap(alg, key, encryptedKey, joseHeader.p2c, p2s);
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      assertEncryptedKey(encryptedKey);
      return aeskwUnwrap(alg, key, encryptedKey);
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      assertEncryptedKey(encryptedKey);
      if (typeof joseHeader.iv !== "string")
        throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
      if (typeof joseHeader.tag !== "string")
        throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
      let iv;
      iv = decodeBase64url(joseHeader.iv, "iv", JWEInvalid);
      let tag2;
      tag2 = decodeBase64url(joseHeader.tag, "tag", JWEInvalid);
      return aesGcmKwUnwrap(jweEncryption(jweAlgorithm(alg).gcmkw), key, encryptedKey, iv, tag2);
    }
    default: {
      throw new JOSENotSupported(unsupportedAlgHeader2);
    }
  }
}
async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
  let encryptedKey;
  let parameters;
  let cek;
  switch (alg) {
    case "dir": {
      cek = key;
      break;
    }
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      assertCryptoKey(key);
      if (!ecdhesAllowed(key)) {
        throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
      }
      const { apu, apv } = providedParameters;
      let ephemeralKey;
      if (providedParameters.epk) {
        ephemeralKey = await prepareKey(jweAlgorithm(alg), providedParameters.epk, "decrypt");
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
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      cek = providedCek || generateCek(enc);
      assertCryptoKey(key);
      encryptedKey = await rsaesEncrypt(alg, key, cek);
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      cek = providedCek || generateCek(enc);
      const { p2c, p2s } = providedParameters;
      ({ encryptedKey, ...parameters } = await pbes2kwWrap(alg, key, cek, p2c, p2s));
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      cek = providedCek || generateCek(enc);
      encryptedKey = await aeskwWrap(alg, key, cek);
      break;
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      cek = providedCek || generateCek(enc);
      const { iv } = providedParameters;
      ({ encryptedKey, ...parameters } = await aesGcmKwWrap(jweEncryption(jweAlgorithm(alg).gcmkw), key, cek, iv));
      break;
    }
    default: {
      throw new JOSENotSupported(unsupportedAlgHeader2);
    }
  }
  return { cek, encryptedKey, parameters };
}

// dist/webapi/lib/options.js
var JWS_RECOGNIZED = /* @__PURE__ */ new Map([["b64", true]]);
var JWE_RECOGNIZED = /* @__PURE__ */ new Map();
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
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}

// dist/webapi/lib/deflate.js
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
function checkShared(jwe) {
  if (jwe.iv !== void 0 && typeof jwe.iv !== "string") {
    throw new JWEInvalid("JWE Initialization Vector incorrect type");
  }
  if (typeof jwe.ciphertext !== "string") {
    throw new JWEInvalid("JWE Ciphertext missing or incorrect type");
  }
  if (jwe.tag !== void 0 && typeof jwe.tag !== "string") {
    throw new JWEInvalid("JWE Authentication Tag incorrect type");
  }
  if (jwe.protected !== void 0 && typeof jwe.protected !== "string") {
    throw new JWEInvalid("JWE Protected Header incorrect type");
  }
  if (jwe.aad !== void 0 && typeof jwe.aad !== "string") {
    throw new JWEInvalid("JWE AAD incorrect type");
  }
  if (jwe.unprotected !== void 0 && !isObject(jwe.unprotected)) {
    throw new JWEInvalid("JWE Shared Unprotected Header incorrect type");
  }
}
function checkRecipient(jwe) {
  if (jwe.encrypted_key !== void 0 && typeof jwe.encrypted_key !== "string") {
    throw new JWEInvalid("JWE Encrypted Key incorrect type");
  }
  if (jwe.header !== void 0 && !isObject(jwe.header)) {
    throw new JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
  }
  if (jwe.protected === void 0 && jwe.header === void 0 && jwe.unprotected === void 0) {
    throw new JWEInvalid("JOSE Header missing");
  }
}
function shareJWE(jwe) {
  let parsedProt;
  if (jwe.protected) {
    parsedProt = parseJoseHeader(jwe.protected, JWEInvalid, "JWE Protected Header is invalid");
  }
  const protectedHeader = jwe.protected !== void 0 ? encode(jwe.protected) : new Uint8Array();
  return {
    parsedProt,
    ciphertext: decodeBase64url(jwe.ciphertext, "ciphertext", JWEInvalid),
    iv: jwe.iv !== void 0 ? decodeBase64url(jwe.iv, "iv", JWEInvalid) : void 0,
    tag: jwe.tag !== void 0 ? decodeBase64url(jwe.tag, "tag", JWEInvalid) : void 0,
    additionalData: jwe.aad !== void 0 ? concat(protectedHeader, encode("."), encodeBase64url(jwe.aad, "aad", JWEInvalid)) : protectedHeader
  };
}
function decryptResult(jwe, decrypted) {
  const result = { plaintext: decrypted.plaintext };
  if (jwe.protected !== void 0) {
    result.protectedHeader = decrypted.parsedProt;
  }
  if (jwe.aad !== void 0) {
    result.additionalAuthenticatedData = decodeBase64url(jwe.aad, "aad", JWEInvalid);
  }
  if (jwe.unprotected !== void 0) {
    result.sharedUnprotectedHeader = jwe.unprotected;
  }
  if (jwe.header !== void 0) {
    result.unprotectedHeader = jwe.header;
  }
  if (decrypted.resolvedKey) {
    return { ...result, key: decrypted.key };
  }
  return result;
}
function prepareDecrypt(options) {
  return {
    keyManagementAlgorithms: options && validateAlgorithms("keyManagementAlgorithms", options.keyManagementAlgorithms),
    contentEncryptionAlgorithms: options && validateAlgorithms("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms),
    options
  };
}
async function decryptRecipient(jwe, token, shared, key) {
  const { options } = shared;
  const { parsedProt } = token;
  let joseHeader;
  if (jwe.header !== void 0 || jwe.unprotected !== void 0) {
    if (!isDisjoint(parsedProt, jwe.header, jwe.unprotected)) {
      throw new JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
    }
    joseHeader = { ...parsedProt, ...jwe.header, ...jwe.unprotected };
  } else {
    joseHeader = parsedProt ?? {};
  }
  validateCrit(JWEInvalid, JWE_RECOGNIZED, options?.crit, parsedProt, joseHeader);
  if (joseHeader.zip !== void 0 && joseHeader.zip !== "DEF") {
    throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
  }
  if (joseHeader.zip !== void 0 && !parsedProt?.zip) {
    throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
  }
  const { alg, enc } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
  }
  if (typeof enc !== "string" || !enc) {
    throw new JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
  }
  const { keyManagementAlgorithms, contentEncryptionAlgorithms } = shared;
  if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg) || !keyManagementAlgorithms && alg.startsWith("PBES2")) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
    throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
  }
  const encEntry = jweEncryption(enc);
  let encryptedKey;
  if (jwe.encrypted_key !== void 0) {
    encryptedKey = decodeBase64url(jwe.encrypted_key, "encrypted_key", JWEInvalid);
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
    cek = await decryptKeyManagement(alg, encEntry, k, encryptedKey, joseHeader, options);
  } catch (err) {
    if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
      throw err;
    }
    cek = generateCek(encEntry);
  }
  let plaintext = await decrypt(encEntry, cek, token.ciphertext, token.iv, token.tag, token.additionalData);
  if (joseHeader.zip === "DEF") {
    const maxDecompressedLength = options?.maxDecompressedLength ?? 25e4;
    if (maxDecompressedLength === 0) {
      throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    }
    if (maxDecompressedLength !== Infinity && (!Number.isSafeInteger(maxDecompressedLength) || maxDecompressedLength < 1)) {
      throw new TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
    }
    plaintext = await decompress(plaintext, maxDecompressedLength).catch((cause) => {
      if (cause instanceof JWEInvalid)
        throw cause;
      throw new JWEInvalid("Failed to decompress plaintext", { cause });
    });
  }
  return { plaintext, parsedProt, key: k, resolvedKey };
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
  return decryptJWE({
    ciphertext,
    iv: iv || void 0,
    protected: protectedHeader,
    tag: tag2 || void 0,
    encrypted_key: encryptedKey || void 0
  }, shared, key);
}

// dist/webapi/jwe/compact/decrypt.js
async function compactDecrypt(jwe, key, options) {
  const decrypted = await decryptCompact(jwe, prepareDecrypt(options), key);
  const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.parsedProt };
  if (typeof key === "function") {
    return { ...result, key: decrypted.key };
  }
  return result;
}

// dist/webapi/jwe/flattened/decrypt.js
async function flattenedDecrypt(jwe, key, options) {
  if (!isObject(jwe)) {
    throw new JWEInvalid("Flattened JWE must be an object");
  }
  checkShared(jwe);
  checkRecipient(jwe);
  return decryptResult(jwe, await decryptJWE(jwe, prepareDecrypt(options), key));
}

// dist/webapi/jwe/general/decrypt.js
async function generalDecrypt(jwe, key, options) {
  if (!isObject(jwe)) {
    throw new JWEInvalid("General JWE must be an object");
  }
  if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
    throw new JWEInvalid("JWE Recipients missing or incorrect type");
  }
  if (!jwe.recipients.length) {
    throw new JWEInvalid("JWE Recipients has no members");
  }
  let shared;
  let token;
  try {
    checkShared(jwe);
    shared = prepareDecrypt(options);
    token = shareJWE(jwe);
  } catch {
    throw new JWEDecryptionFailed();
  }
  for (const recipient of jwe.recipients) {
    try {
      const flattened = {
        aad: jwe.aad,
        ciphertext: jwe.ciphertext,
        encrypted_key: recipient.encrypted_key,
        header: recipient.header,
        iv: jwe.iv,
        protected: jwe.protected,
        tag: jwe.tag,
        unprotected: jwe.unprotected
      };
      checkRecipient(flattened);
      return decryptResult(flattened, await decryptRecipient(flattened, token, shared, key));
    } catch {
    }
  }
  throw new JWEDecryptionFailed();
}

// dist/webapi/lib/jwe_encrypt.js
function checkEncryptHeaders(input) {
  const { protectedHeader, unprotectedHeader, sharedUnprotectedHeader } = input;
  if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) {
    throw new JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...protectedHeader,
    ...unprotectedHeader,
    ...sharedUnprotectedHeader
  };
  validateCrit(JWEInvalid, JWE_RECOGNIZED, input.crit, protectedHeader, joseHeader);
  if (joseHeader.zip !== void 0 && joseHeader.zip !== "DEF") {
    throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
  }
  if (joseHeader.zip !== void 0 && !protectedHeader?.zip) {
    throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
  }
  const { alg, enc } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
  }
  if (typeof enc !== "string" || !enc) {
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
  }
  return { joseHeader, alg, enc, encEntry: jweEncryption(enc) };
}
async function encryptJWE(input, checked, key) {
  const { joseHeader, alg, encEntry } = checked;
  let { protectedHeader, unprotectedHeader } = input;
  const { sharedUnprotectedHeader } = input;
  if (input.cek && (alg === "dir" || alg === "ECDH-ES")) {
    throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
  }
  const algEntry = jweAlgorithm(alg);
  const k = await prepareKey(alg === "dir" ? encEntry : algEntry, key, "encrypt");
  const { cek, encryptedKey, parameters } = await encryptKeyManagement(alg, encEntry, k, input.cek, input.keyManagementParameters);
  if (parameters) {
    if (input.unprotectedParameters) {
      unprotectedHeader = unprotectedHeader ? { ...unprotectedHeader, ...parameters } : parameters;
    } else {
      protectedHeader = protectedHeader ? { ...protectedHeader, ...parameters } : parameters;
    }
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
  if (input.aad?.byteLength) {
    aadMember = encode2(input.aad);
    additionalData = concat(protectedHeaderB, encode("."), encode(aadMember));
  } else {
    additionalData = protectedHeaderB;
  }
  let plaintext = input.plaintext;
  if (joseHeader.zip === "DEF") {
    plaintext = await compress(plaintext).catch((cause) => {
      throw new JWEInvalid("Failed to compress plaintext", { cause });
    });
  }
  const { ciphertext, tag: tag2, iv } = await encrypt(encEntry, plaintext, cek, input.iv, additionalData);
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
async function createJWE(input, key) {
  return encryptJWE(input, checkEncryptHeaders(input), key);
}

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
    if (!(plaintext instanceof Uint8Array)) {
      throw new TypeError("plaintext must be an instance of Uint8Array");
    }
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
    if (!this.#protectedHeader && !this.#unprotectedHeader && !this.#sharedUnprotectedHeader) {
      throw new JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
    }
    validateCritDuplicates(JWEInvalid, this.#protectedHeader);
    return createJWE({
      plaintext: this.#plaintext,
      protectedHeader: this.#protectedHeader,
      unprotectedHeader: this.#unprotectedHeader,
      sharedUnprotectedHeader: this.#sharedUnprotectedHeader,
      aad: this.#aad,
      cek: this.#cek,
      iv: this.#iv,
      keyManagementParameters: this.#keyManagementParameters,
      crit: options?.crit,
      unprotectedParameters: options ? unprotected in options : false
    }, key);
  }
};

// dist/webapi/jwe/general/encrypt.js
var IndividualRecipient = class {
  #parent;
  unprotectedHeader;
  keyManagementParameters;
  key;
  options;
  constructor(enc, key, options) {
    this.#parent = enc;
    this.key = key;
    this.options = options;
  }
  setUnprotectedHeader(unprotectedHeader) {
    assertNotSet(this.unprotectedHeader, "setUnprotectedHeader");
    this.unprotectedHeader = unprotectedHeader;
    return this;
  }
  setKeyManagementParameters(parameters) {
    assertNotSet(this.keyManagementParameters, "setKeyManagementParameters");
    this.keyManagementParameters = parameters;
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
    const recipient = new IndividualRecipient(this, key, { crit: options?.crit });
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
    if (!(this.#plaintext instanceof Uint8Array)) {
      throw new TypeError("plaintext must be an instance of Uint8Array");
    }
    if (this.#recipients.length === 1) {
      const [recipient] = this.#recipients;
      const flattened = await new FlattenedEncrypt(this.#plaintext).setAdditionalAuthenticatedData(this.#aad).setProtectedHeader(this.#protectedHeader).setSharedUnprotectedHeader(this.#unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).setKeyManagementParameters(recipient.keyManagementParameters).encrypt(recipient.key, { ...recipient.options });
      const jwe2 = {
        ciphertext: flattened.ciphertext,
        iv: flattened.iv,
        recipients: [{}],
        tag: flattened.tag
      };
      if (flattened.aad)
        jwe2.aad = flattened.aad;
      if (flattened.protected)
        jwe2.protected = flattened.protected;
      if (flattened.unprotected)
        jwe2.unprotected = flattened.unprotected;
      if (flattened.encrypted_key)
        jwe2.recipients[0].encrypted_key = flattened.encrypted_key;
      if (flattened.header)
        jwe2.recipients[0].header = flattened.header;
      return jwe2;
    }
    validateCritDuplicates(JWEInvalid, this.#protectedHeader);
    let enc;
    const inputs = [];
    const checked = [];
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i];
      const input = {
        plaintext: this.#plaintext,
        protectedHeader: this.#protectedHeader,
        unprotectedHeader: recipient.unprotectedHeader,
        sharedUnprotectedHeader: this.#unprotectedHeader,
        aad: this.#aad,
        keyManagementParameters: recipient.keyManagementParameters,
        crit: recipient.options.crit,
        unprotectedParameters: true
      };
      const headers = checkEncryptHeaders(input);
      inputs.push(input);
      checked.push(headers);
      if (headers.alg === "dir" || headers.alg === "ECDH-ES") {
        throw new JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
      }
      if (!enc) {
        enc = headers.enc;
      } else if (enc !== headers.enc) {
        throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
      }
    }
    const cek = generateCek(checked[0].encEntry);
    const jwe = {
      ciphertext: "",
      recipients: []
    };
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i];
      const target = {};
      jwe.recipients.push(target);
      if (i === 0) {
        const flattened = await encryptJWE({ ...inputs[0], cek }, checked[0], recipient.key);
        jwe.ciphertext = flattened.ciphertext;
        jwe.iv = flattened.iv;
        jwe.tag = flattened.tag;
        if (flattened.aad)
          jwe.aad = flattened.aad;
        if (flattened.protected)
          jwe.protected = flattened.protected;
        if (flattened.unprotected)
          jwe.unprotected = flattened.unprotected;
        target.encrypted_key = flattened.encrypted_key;
        if (flattened.header)
          target.header = flattened.header;
        continue;
      }
      const { alg } = checked[i];
      const k = await prepareKey(jweAlgorithm(alg), recipient.key, "encrypt");
      const { encryptedKey, parameters } = await encryptKeyManagement(alg, checked[i].encEntry, k, cek, recipient.keyManagementParameters);
      target.encrypted_key = encode2(encryptedKey);
      if (recipient.unprotectedHeader || parameters)
        target.header = { ...recipient.unprotectedHeader, ...parameters };
    }
    return jwe;
  }
};

// dist/webapi/lib/jws_algorithms.js
var sig = { public: ["verify"], private: ["sign"] };
function hmac(bits) {
  const subtle = { name: "HMAC", hash: `SHA-${bits}` };
  return { kty: ["oct"], symmetric: true, subtle, operation: subtle, usages: sig };
}
function rsa(name, bits, saltLength) {
  const subtle = { name, hash: `SHA-${bits}` };
  return {
    kty: ["RSA"],
    subtle,
    operation: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minModulusLength: 2048
  };
}
function ecdsa(crv, bits) {
  return {
    kty: ["EC"],
    crv,
    subtle: { name: "ECDSA", namedCurve: crv },
    operation: { name: "ECDSA", hash: `SHA-${bits}` },
    usages: sig
  };
}
function eddsa() {
  const subtle = { name: "Ed25519" };
  return {
    kty: ["OKP"],
    crv: "Ed25519",
    subtle,
    operation: subtle,
    usages: sig
  };
}
function mldsa(name) {
  const subtle = { name };
  return {
    kty: ["AKP"],
    subtle,
    operation: subtle,
    usages: sig
  };
}
var JWS = table({
  HS256: hmac(256),
  HS384: hmac(384),
  HS512: hmac(512),
  RS256: rsa("RSASSA-PKCS1-v1_5", 256),
  RS384: rsa("RSASSA-PKCS1-v1_5", 384),
  RS512: rsa("RSASSA-PKCS1-v1_5", 512),
  PS256: rsa("RSA-PSS", 256, 32),
  PS384: rsa("RSA-PSS", 384, 48),
  PS512: rsa("RSA-PSS", 512, 64),
  ES256: ecdsa("P-256", 256),
  ES384: ecdsa("P-384", 384),
  ES512: ecdsa("P-521", 512),
  EdDSA: eddsa(),
  Ed25519: eddsa(),
  "ML-DSA-44": mldsa("ML-DSA-44"),
  "ML-DSA-65": mldsa("ML-DSA-65"),
  "ML-DSA-87": mldsa("ML-DSA-87")
});
function jwsAlgorithm(alg) {
  const entry = JWS[alg];
  if (!entry) {
    throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
  return entry;
}
function maybeJWSAlgorithm(alg) {
  return JWS[alg];
}

// dist/webapi/lib/jws_verify.js
function verifyResult(jws, verified) {
  const result = { payload: verified.payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = verified.parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (verified.resolvedKey) {
    return { ...result, key: verified.key };
  }
  return result;
}
function prepareVerify(options) {
  return {
    algorithms: options && validateAlgorithms("algorithms", options.algorithms),
    crit: options?.crit
  };
}
async function verifySignature(jws, shared, key) {
  let parsedProt = {};
  if (jws.protected) {
    parsedProt = parseJoseHeader(jws.protected, JWSInvalid, "JWS Protected Header is invalid");
  }
  let joseHeader;
  if (jws.header !== void 0) {
    if (!isDisjoint(parsedProt, jws.header)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    joseHeader = { ...parsedProt, ...jws.header };
  } else {
    joseHeader = parsedProt;
  }
  const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, shared.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  if (shared.algorithms && !shared.algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  const entry = jwsAlgorithm(alg);
  const data = concat(jws.protected !== void 0 ? encode(jws.protected) : new Uint8Array(), encode("."), typeof jws.payload === "string" ? b64 ? shared.b64p ??= encodeBase64url(jws.payload, "payload", JWSInvalid) : encoder.encode(jws.payload) : jws.payload);
  const signature = decodeBase64url(jws.signature, "signature", JWSInvalid);
  const k = await prepareKey(entry, key, "verify");
  const verified = await verify(entry, k, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    payload = decodeBase64url(jws.payload, "payload", JWSInvalid);
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  return { payload, parsedProt, b64, key: k, resolvedKey };
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
  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key);
}

// dist/webapi/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  const verified = await verifyCompact(jws, prepareVerify(options), key);
  const result = { payload: verified.payload, protectedHeader: verified.parsedProt };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}

// dist/webapi/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  return verifyResult(jws, await verifySignature(jws, prepareVerify(options), key));
}

// dist/webapi/jws/general/verify.js
async function generalVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("General JWS must be an object");
  }
  if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
    throw new JWSInvalid("JWS Signatures missing or incorrect type");
  }
  let shared;
  try {
    if (jws.payload === void 0)
      throw new Error();
    shared = prepareVerify(options);
  } catch {
    throw new JWSSignatureVerificationFailed();
  }
  for (const signature of jws.signatures) {
    try {
      if (signature.protected === void 0 && signature.header === void 0)
        throw new Error();
      if (signature.protected !== void 0 && typeof signature.protected !== "string") {
        throw new Error();
      }
      if (typeof signature.signature !== "string")
        throw new Error();
      if (signature.header !== void 0 && !isObject(signature.header))
        throw new Error();
      return verifyResult(signature, await verifySignature({
        header: signature.header,
        payload: jws.payload,
        protected: signature.protected,
        signature: signature.signature
      }, shared, key));
    } catch {
    }
  }
  throw new JWSSignatureVerificationFailed();
}

// dist/webapi/lib/jwt_claims_set.js
var epoch = (date) => Math.floor(date.getTime() / 1e3);
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function secs(str) {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
var normalizeTyp = (value) => {
  if (value.includes("/")) {
    return value.toLowerCase();
  }
  return `application/${value.toLowerCase()}`;
};
var checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
};
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
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
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
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject !== void 0 && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  validateInput("clockTolerance option", tolerance);
  const { currentDate } = options;
  const now = validateInput("currentDate option", epoch(currentDate || /* @__PURE__ */ new Date()));
  if ((payload.iat !== void 0 || maxTokenAge !== void 0) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge !== void 0) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}
var JWTClaimsBuilder = class {
  #payload;
  constructor(payload) {
    if (!isObject(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    this.#payload = structuredClone(payload);
  }
  data() {
    return encoder.encode(JSON.stringify(this.#payload));
  }
  get iss() {
    return this.#payload.iss;
  }
  set iss(value) {
    this.#payload.iss = value;
  }
  get sub() {
    return this.#payload.sub;
  }
  set sub(value) {
    this.#payload.sub = value;
  }
  get aud() {
    return this.#payload.aud;
  }
  set aud(value) {
    this.#payload.aud = value;
  }
  set jti(value) {
    this.#payload.jti = value;
  }
  set nbf(value) {
    if (typeof value === "number") {
      this.#payload.nbf = validateInput("setNotBefore", value);
    } else if (value instanceof Date) {
      this.#payload.nbf = validateInput("setNotBefore", epoch(value));
    } else {
      this.#payload.nbf = epoch(/* @__PURE__ */ new Date()) + secs(value);
    }
  }
  set exp(value) {
    if (typeof value === "number") {
      this.#payload.exp = validateInput("setExpirationTime", value);
    } else if (value instanceof Date) {
      this.#payload.exp = validateInput("setExpirationTime", epoch(value));
    } else {
      this.#payload.exp = epoch(/* @__PURE__ */ new Date()) + secs(value);
    }
  }
  set iat(value) {
    if (value === void 0) {
      this.#payload.iat = epoch(/* @__PURE__ */ new Date());
    } else if (value instanceof Date) {
      this.#payload.iat = validateInput("setIssuedAt", epoch(value));
    } else if (typeof value === "string") {
      this.#payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value));
    } else {
      this.#payload.iat = validateInput("setIssuedAt", value);
    }
  }
};

// dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await verifyCompact(jwt, prepareVerify(options), key);
  if (!verified.b64) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = validateClaimsSet(verified.parsedProt, verified.payload, options);
  const result = { payload, protectedHeader: verified.parsedProt };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}

// dist/webapi/jwt/decrypt.js
async function jwtDecrypt(jwt, key, options) {
  const decrypted = await decryptCompact(jwt, prepareDecrypt(options), key);
  const protectedHeader = decrypted.parsedProt;
  const payload = validateClaimsSet(protectedHeader, decrypted.plaintext, options);
  if (protectedHeader.iss !== void 0 && protectedHeader.iss !== payload.iss) {
    throw new JWTClaimValidationFailed('replicated "iss" claim header parameter mismatch', payload, "iss", "mismatch");
  }
  if (protectedHeader.sub !== void 0 && protectedHeader.sub !== payload.sub) {
    throw new JWTClaimValidationFailed('replicated "sub" claim header parameter mismatch', payload, "sub", "mismatch");
  }
  if (protectedHeader.aud !== void 0 && JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)) {
    throw new JWTClaimValidationFailed('replicated "aud" claim header parameter mismatch', payload, "aud", "mismatch");
  }
  const result = { payload, protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: decrypted.key };
  }
  return result;
}

// dist/webapi/jwe/compact/encrypt.js
var CompactEncrypt = class {
  #flattened;
  constructor(plaintext) {
    this.#flattened = new FlattenedEncrypt(plaintext);
  }
  setContentEncryptionKey(cek) {
    this.#flattened.setContentEncryptionKey(cek);
    return this;
  }
  setInitializationVector(iv) {
    this.#flattened.setInitializationVector(iv);
    return this;
  }
  setProtectedHeader(protectedHeader) {
    this.#flattened.setProtectedHeader(protectedHeader);
    return this;
  }
  setKeyManagementParameters(parameters) {
    this.#flattened.setKeyManagementParameters(parameters);
    return this;
  }
  async encrypt(key, options) {
    const jwe = await this.#flattened.encrypt(key, options);
    return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join(".");
  }
};

// dist/webapi/lib/jws_sign.js
function unencodedPayload(protectedHeader) {
  return protectedHeader?.b64 === false && Array.isArray(protectedHeader.crit) && protectedHeader.crit.includes("b64");
}
async function createSignature(input, key) {
  const { protectedHeader, unprotectedHeader } = input;
  if (!isDisjoint(protectedHeader, unprotectedHeader)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = { ...protectedHeader, ...unprotectedHeader };
  validateCritDuplicates(JWSInvalid, protectedHeader);
  const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, input.crit, protectedHeader, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = protectedHeader.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const entry = jwsAlgorithm(alg);
  let payloadS;
  let payloadB;
  if (b64) {
    const encoded = input.encoded ??= {};
    encoded.b64 ??= encode2(input.payload);
    encoded.raw ??= encode(encoded.b64);
    payloadS = encoded.b64;
    payloadB = encoded.raw;
  } else {
    payloadB = input.payload;
    payloadS = "";
  }
  let protectedHeaderString;
  let protectedHeaderBytes;
  if (protectedHeader) {
    protectedHeaderString = encode2(JSON.stringify(protectedHeader));
    protectedHeaderBytes = encode(protectedHeaderString);
  } else {
    protectedHeaderString = "";
    protectedHeaderBytes = new Uint8Array();
  }
  const data = concat(protectedHeaderBytes, encode("."), payloadB);
  const k = await prepareKey(entry, key, "sign");
  const signature = await sign(entry, k, data);
  const jws = {
    signature: encode2(signature),
    payload: payloadS
  };
  if (protectedHeader) {
    jws.protected = protectedHeaderString;
  }
  return jws;
}

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
    if (!this.#protectedHeader && !this.#unprotectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    const jws = await createSignature({
      payload: this.#payload,
      protectedHeader: this.#protectedHeader,
      unprotectedHeader: this.#unprotectedHeader,
      crit: options?.crit
    }, key);
    if (this.#unprotectedHeader) {
      jws.header = this.#unprotectedHeader;
    }
    return jws;
  }
};

// dist/webapi/jws/compact/sign.js
var CompactSign = class {
  #flattened;
  #protectedHeader;
  constructor(payload) {
    this.#flattened = new FlattenedSign(payload);
  }
  setProtectedHeader(protectedHeader) {
    this.#flattened.setProtectedHeader(protectedHeader);
    this.#protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    if (unencodedPayload(this.#protectedHeader)) {
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    }
    const jws = await this.#flattened.sign(key, options);
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }
};

// dist/webapi/jws/general/sign.js
var IndividualSignature = class {
  #parent;
  protectedHeader;
  unprotectedHeader;
  options;
  key;
  constructor(sig2, key, options) {
    this.#parent = sig2;
    this.key = key;
    this.options = options;
  }
  setProtectedHeader(protectedHeader) {
    assertNotSet(this.protectedHeader, "setProtectedHeader");
    this.protectedHeader = protectedHeader;
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    assertNotSet(this.unprotectedHeader, "setUnprotectedHeader");
    this.unprotectedHeader = unprotectedHeader;
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
    const encoded = {};
    for (let i = 0; i < this.#signatures.length; i++) {
      const signature = this.#signatures[i];
      if (!signature.protectedHeader && !signature.unprotectedHeader) {
        throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
      }
      const { payload, ...rest } = await createSignature({
        payload: this.#payload,
        protectedHeader: signature.protectedHeader,
        unprotectedHeader: signature.unprotectedHeader,
        crit: signature.options?.crit,
        encoded
      }, signature.key);
      if (signature.unprotectedHeader) {
        rest.header = signature.unprotectedHeader;
      }
      if (i === 0) {
        jws.payload = payload;
      } else if (jws.payload !== payload) {
        throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
      }
      jws.signatures.push(rest);
    }
    return jws;
  }
};

// dist/webapi/jwt/sign.js
var SignJWT = class {
  #protectedHeader;
  #jwt;
  constructor(payload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload);
  }
  setIssuer(issuer) {
    this.#jwt.iss = issuer;
    return this;
  }
  setSubject(subject) {
    this.#jwt.sub = subject;
    return this;
  }
  setAudience(audience) {
    this.#jwt.aud = audience;
    return this;
  }
  setJti(jwtId) {
    this.#jwt.jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    this.#jwt.nbf = input;
    return this;
  }
  setExpirationTime(input) {
    this.#jwt.exp = input;
    return this;
  }
  setIssuedAt(input) {
    this.#jwt.iat = input;
    return this;
  }
  setProtectedHeader(protectedHeader) {
    this.#protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    const sig2 = new CompactSign(this.#jwt.data());
    sig2.setProtectedHeader(this.#protectedHeader);
    if (unencodedPayload(this.#protectedHeader)) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    return sig2.sign(key, options);
  }
};

// dist/webapi/jwt/encrypt.js
var EncryptJWT = class {
  #cek;
  #iv;
  #keyManagementParameters;
  #protectedHeader;
  #replicateIssuerAsHeader;
  #replicateSubjectAsHeader;
  #replicateAudienceAsHeader;
  #jwt;
  constructor(payload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload);
  }
  setIssuer(issuer) {
    this.#jwt.iss = issuer;
    return this;
  }
  setSubject(subject) {
    this.#jwt.sub = subject;
    return this;
  }
  setAudience(audience) {
    this.#jwt.aud = audience;
    return this;
  }
  setJti(jwtId) {
    this.#jwt.jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    this.#jwt.nbf = input;
    return this;
  }
  setExpirationTime(input) {
    this.#jwt.exp = input;
    return this;
  }
  setIssuedAt(input) {
    this.#jwt.iat = input;
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
    const enc = new CompactEncrypt(this.#jwt.data());
    if (this.#protectedHeader && (this.#replicateIssuerAsHeader || this.#replicateSubjectAsHeader || this.#replicateAudienceAsHeader)) {
      this.#protectedHeader = {
        ...this.#protectedHeader,
        iss: this.#replicateIssuerAsHeader ? this.#jwt.iss : void 0,
        sub: this.#replicateSubjectAsHeader ? this.#jwt.sub : void 0,
        aud: this.#replicateAudienceAsHeader ? this.#jwt.aud : void 0
      };
    }
    enc.setProtectedHeader(this.#protectedHeader);
    if (this.#iv) {
      enc.setInitializationVector(this.#iv);
    }
    if (this.#cek) {
      enc.setContentEncryptionKey(this.#cek);
    }
    if (this.#keyManagementParameters) {
      enc.setKeyManagementParameters(this.#keyManagementParameters);
    }
    return enc.encrypt(key, options);
  }
};

// dist/webapi/lib/key_algorithm.js
function unsupportedAlgorithm() {
  return new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
}
function keyAlgorithm(alg) {
  if (typeof alg !== "string") {
    throw unsupportedAlgorithm();
  }
  const entry = maybeJWSAlgorithm(alg) ?? maybeJWEAlgorithm(alg);
  if (!entry) {
    throw unsupportedAlgorithm();
  }
  return entry;
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
  if (count <= 0)
    return;
  state.pos++;
  const length = parseLength(state);
  state.pos += length;
  if (count > 1) {
    skipElement(state, count - 1);
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
function parsePKCS8Header(state) {
  expectTag(state, 48, "Invalid PKCS#8 structure");
  parseLength(state);
  expectTag(state, 2, "Expected version field");
  const verLen = parseLength(state);
  state.pos += verLen;
  expectTag(state, 48, "Expected algorithm identifier");
  const algIdLen = parseLength(state);
  const algIdStart = state.pos;
  return { algIdStart, algIdLength: algIdLen };
}
function parseSPKIHeader(state) {
  expectTag(state, 48, "Invalid SPKI structure");
  parseLength(state);
  expectTag(state, 48, "Expected algorithm identifier");
  const algIdLen = parseLength(state);
  const algIdStart = state.pos;
  return { algIdStart, algIdLength: algIdLen };
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
  for (const { name, oid } of [
    { name: "P-256", oid: [42, 134, 72, 206, 61, 3, 1, 7] },
    { name: "P-384", oid: [43, 129, 4, 0, 34] },
    { name: "P-521", oid: [43, 129, 4, 0, 35] }
  ]) {
    if (bytesEqual(curveOid, oid)) {
      return name;
    }
  }
  throw new Error("Unsupported named curve");
};
var genericImport = async (keyFormat, keyData, alg, options) => {
  const entry = keyAlgorithm(alg);
  if (entry.symmetric) {
    throw new JOSENotSupported('Invalid or unsupported "alg" (Algorithm) value');
  }
  const isPublic = keyFormat === "spki";
  let algorithm;
  if (entry.subtleFor) {
    try {
      algorithm = entry.subtleFor({ crv: options.getNamedCurve(keyData) });
    } catch (cause) {
      throw new JOSENotSupported("Invalid or unsupported key format");
    }
  } else {
    algorithm = entry.subtle;
  }
  return crypto.subtle.importKey(keyFormat, keyData, algorithm, options?.extractable ?? (isPublic ? true : false), isPublic ? entry.usages.public : entry.usages.private);
};
var processPEMData = (pem, pattern) => {
  return decodeBase64(pem.replace(pattern, ""));
};
var fromPKCS8 = (pem, alg, options) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
  let opts = options;
  if (alg?.startsWith?.("ECDH-ES")) {
    opts ||= {};
    opts.getNamedCurve = (keyData2) => {
      const state = createASN1State(keyData2);
      parsePKCS8Header(state);
      return parseECAlgorithmIdentifier(state);
    };
  }
  return genericImport("pkcs8", keyData, alg, opts);
};
var fromSPKI = (pem, alg, options) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g);
  let opts = options;
  if (alg?.startsWith?.("ECDH-ES")) {
    opts ||= {};
    opts.getNamedCurve = (keyData2) => {
      const state = createASN1State(keyData2);
      parseSPKIHeader(state);
      return parseECAlgorithmIdentifier(state);
    };
  }
  return genericImport("spki", keyData, alg, opts);
};
function spkiFromX509(buf) {
  const state = createASN1State(buf);
  expectTag(state, 48, "Invalid certificate structure");
  parseLength(state);
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
function extractX509SPKI(x509) {
  const derBytes = processPEMData(x509, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
  return spkiFromX509(derBytes);
}
var fromX509 = (pem, alg, options) => {
  let spki;
  try {
    spki = extractX509SPKI(pem);
  } catch (cause) {
    throw new TypeError("Failed to parse the X.509 certificate", { cause });
  }
  return fromSPKI(formatPEM(encodeBase64(spki), "PUBLIC KEY"), alg, options);
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
async function exportSPKI(key) {
  return toSPKI(key);
}
async function exportPKCS8(key) {
  return toPKCS8(key);
}
async function exportJWK(key) {
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
  if (isJWK(key)) {
    jwk = key;
  } else if (isKeyLike(key)) {
    jwk = await exportJWK(key);
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
      check(jwk.k, '"k" (Key Value) Parameter');
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
  const entry = jwsAlgorithm(joseHeader.alg);
  const key = await jwkToKey(entry, { ...joseHeader.jwk, ext: true });
  if (key.type !== "public") {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
  }
  return key;
}

// dist/webapi/jwks/local.js
function signatureAlgorithm(alg) {
  const entry = typeof alg === "string" ? maybeJWSAlgorithm(alg) : void 0;
  if (!entry || entry.symmetric) {
    throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
  }
  return entry;
}
function isJWKSLike(jwks) {
  if (!jwks || typeof jwks !== "object") {
    return false;
  }
  const { keys } = jwks;
  return Array.isArray(keys) && keys.every(isJWKLike);
}
function isJWKLike(key) {
  return isObject(key);
}
var LocalJWKSetImpl = class {
  #jwks;
  #cached = /* @__PURE__ */ new WeakMap();
  constructor(jwks) {
    if (!isJWKSLike(jwks)) {
      throw new JWKSInvalid("JSON Web Key Set malformed");
    }
    this.#jwks = structuredClone(jwks);
  }
  jwks() {
    return this.#jwks;
  }
  async getKey(protectedHeader, token) {
    const { alg, kid } = { ...protectedHeader, ...token?.header };
    const entry = signatureAlgorithm(alg);
    const candidates = this.#jwks.keys.filter((jwk2) => {
      let candidate = entry.kty.includes(jwk2.kty);
      if (candidate && typeof kid === "string") {
        candidate = kid === jwk2.kid;
      }
      if (candidate && (typeof jwk2.alg === "string" || jwk2.kty === "AKP")) {
        candidate = alg === jwk2.alg;
      }
      if (candidate && typeof jwk2.use === "string") {
        candidate = jwk2.use === "sig";
      }
      if (candidate && Array.isArray(jwk2.key_ops)) {
        candidate = jwk2.key_ops.includes("verify");
      }
      if (candidate && entry.crv) {
        candidate = jwk2.crv === entry.crv;
      }
      return candidate;
    });
    const { 0: jwk, length } = candidates;
    if (length === 0) {
      throw new JWKSNoMatchingKey();
    }
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      const _cached = this.#cached;
      error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates) {
          try {
            yield await importWithAlgCache(_cached, jwk2, entry);
          } catch {
          }
        }
      };
      throw error;
    }
    return importWithAlgCache(this.#cached, jwk, entry);
  }
};
async function importWithAlgCache(cache2, jwk, entry) {
  const cached2 = cache2.get(jwk) || cache2.set(jwk, {}).get(jwk);
  if (cached2[entry.alg] === void 0) {
    const key = await jwkToKey(entry, { ...jwk, alg: entry.alg, ext: true });
    if (key.type !== "public") {
      throw new JWKSInvalid("JSON Web Key Set members must be public keys");
    }
    cached2[entry.alg] = key;
  }
  return cached2[entry.alg];
}
function createLocalJWKSet(jwks) {
  const set = new LocalJWKSetImpl(jwks);
  const localJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
  Object.defineProperties(localJWKSet, {
    jwks: {
      value: () => structuredClone(set.jwks()),
      enumerable: false,
      configurable: false,
      writable: false
    }
  });
  return localJWKSet;
}

// dist/webapi/jwks/remote.js
function isCloudflareWorkers() {
  return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
var USER_AGENT;
if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
  const NAME = "jose";
  const VERSION = "v6.2.5";
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
function isFreshJwksCache(input, cacheMaxAge) {
  if (typeof input !== "object" || input === null) {
    return false;
  }
  if (!("uat" in input) || typeof input.uat !== "number" || Date.now() - input.uat >= cacheMaxAge) {
    return false;
  }
  if (!("jwks" in input) || !isObject(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, isObject)) {
    return false;
  }
  return true;
}
var RemoteJWKSetImpl = class {
  #url;
  #timeoutDuration;
  #cooldownDuration;
  #cacheMaxAge;
  #jwksTimestamp;
  #pendingFetch;
  #headers;
  #customFetch;
  #local;
  #cache;
  constructor(url, options) {
    if (!(url instanceof URL)) {
      throw new TypeError("url must be an instance of URL");
    }
    this.#url = new URL(url.href);
    this.#timeoutDuration = typeof options?.timeoutDuration === "number" ? options?.timeoutDuration : 5e3;
    this.#cooldownDuration = typeof options?.cooldownDuration === "number" ? options?.cooldownDuration : 3e4;
    this.#cacheMaxAge = typeof options?.cacheMaxAge === "number" ? options?.cacheMaxAge : 6e5;
    this.#headers = new Headers(options?.headers);
    if (USER_AGENT && !this.#headers.has("User-Agent")) {
      this.#headers.set("User-Agent", USER_AGENT);
    }
    if (!this.#headers.has("accept")) {
      this.#headers.set("accept", "application/json");
      this.#headers.append("accept", "application/jwk-set+json");
    }
    this.#customFetch = options?.[customFetch];
    if (options?.[jwksCache] !== void 0) {
      this.#cache = options?.[jwksCache];
      if (isFreshJwksCache(options?.[jwksCache], this.#cacheMaxAge)) {
        this.#jwksTimestamp = this.#cache.uat;
        this.#local = createLocalJWKSet(this.#cache.jwks);
      }
    }
  }
  pendingFetch() {
    return !!this.#pendingFetch;
  }
  coolingDown() {
    return typeof this.#jwksTimestamp === "number" ? Date.now() < this.#jwksTimestamp + this.#cooldownDuration : false;
  }
  fresh() {
    return typeof this.#jwksTimestamp === "number" ? Date.now() < this.#jwksTimestamp + this.#cacheMaxAge : false;
  }
  jwks() {
    return this.#local?.jwks();
  }
  async getKey(protectedHeader, token) {
    if (!this.#local || !this.fresh()) {
      await this.reload();
    }
    try {
      return await this.#local(protectedHeader, token);
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload();
          return this.#local(protectedHeader, token);
        }
      }
      throw err;
    }
  }
  async reload() {
    if (this.#pendingFetch && isCloudflareWorkers()) {
      this.#pendingFetch = void 0;
    }
    this.#pendingFetch ||= fetchJwks(this.#url.href, this.#headers, AbortSignal.timeout(this.#timeoutDuration), this.#customFetch).then((json) => {
      this.#local = createLocalJWKSet(json);
      if (this.#cache) {
        this.#cache.uat = Date.now();
        this.#cache.jwks = json;
      }
      this.#jwksTimestamp = Date.now();
      this.#pendingFetch = void 0;
    }).catch((err) => {
      this.#pendingFetch = void 0;
      throw err;
    });
    await this.#pendingFetch;
  }
};
function createRemoteJWKSet(url, options) {
  const set = new RemoteJWKSetImpl(url, options);
  const remoteJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
  Object.defineProperties(remoteJWKSet, {
    coolingDown: {
      get: () => set.coolingDown(),
      enumerable: true,
      configurable: false
    },
    fresh: {
      get: () => set.fresh(),
      enumerable: true,
      configurable: false
    },
    reload: {
      value: () => set.reload(),
      enumerable: true,
      configurable: false,
      writable: false
    },
    reloading: {
      get: () => set.pendingFetch(),
      enumerable: true,
      configurable: false
    },
    jwks: {
      value: () => set.jwks(),
      enumerable: true,
      configurable: false,
      writable: false
    }
  });
  return remoteJWKSet;
}

// dist/webapi/jwt/unsecured.js
var UnsecuredJWT = class {
  #jwt;
  constructor(payload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload);
  }
  encode() {
    const header = encode2(JSON.stringify({ alg: "none" }));
    const payload = encode2(this.#jwt.data());
    return `${header}.${payload}.`;
  }
  setIssuer(issuer) {
    this.#jwt.iss = issuer;
    return this;
  }
  setSubject(subject) {
    this.#jwt.sub = subject;
    return this;
  }
  setAudience(audience) {
    this.#jwt.aud = audience;
    return this;
  }
  setJti(jwtId) {
    this.#jwt.jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    this.#jwt.nbf = input;
    return this;
  }
  setExpirationTime(input) {
    this.#jwt.exp = input;
    return this;
  }
  setIssuedAt(input) {
    this.#jwt.iat = input;
    return this;
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
    try {
      header = JSON.parse(strictDecoder.decode(decode(encodedHeader)));
      if (header.alg !== "none")
        throw new Error();
    } catch {
      throw new JWTInvalid("Invalid Unsecured JWT");
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
  alg ??= jwk.alg;
  const ext = options?.extractable ?? jwk.ext;
  if (jwk.kty !== "oct" && !alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      return jwkToKey(keyAlgorithm(alg), { ...jwk, alg, ext });
    case "AKP": {
      if (typeof jwk.alg !== "string" || !jwk.alg) {
        throw new TypeError('missing "alg" (Algorithm) Parameter value');
      }
      if (alg !== void 0 && alg !== jwk.alg) {
        throw new TypeError("JWK alg and alg option value mismatch");
      }
      return jwkToKey(keyAlgorithm(jwk.alg), { ...jwk, ext });
    }
    case "EC":
    case "OKP":
      return jwkToKey(keyAlgorithm(alg), { ...jwk, alg, ext });
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
  const invalid = "Invalid Token or Protected Header formatting";
  if (typeof protectedB64u !== "string" || !protectedB64u) {
    throw new TypeError(invalid);
  }
  return parseJoseHeader(protectedB64u, TypeError, invalid);
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
  if (typeof modulusLength !== "number" || modulusLength < 2048) {
    throw new JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
  }
  return modulusLength;
}
async function generateKeyPair(alg, options) {
  const entry = keyAlgorithm(alg);
  if (entry.symmetric) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
  }
  let algorithm;
  if (entry.subtleFor) {
    switch (options?.crv ?? "P-256") {
      case "P-256":
      case "P-384":
      case "P-521":
        algorithm = { name: "ECDH", namedCurve: options?.crv ?? "P-256" };
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
  return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
    ...entry.usages.private,
    ...entry.usages.public
  ]);
}

// dist/webapi/key/generate_secret.js
async function generateSecret(alg, options) {
  let length;
  let algorithm;
  let keyUsages;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      length = parseInt(alg.slice(-3), 10);
      algorithm = { name: "HMAC", hash: `SHA-${length}`, length };
      keyUsages = ["sign", "verify"];
      break;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      length = parseInt(alg.slice(-3), 10);
      return crypto.getRandomValues(new Uint8Array(length >> 3));
    case "A128KW":
    case "A192KW":
    case "A256KW":
      length = parseInt(alg.slice(1, 4), 10);
      algorithm = { name: "AES-KW", length };
      keyUsages = ["wrapKey", "unwrapKey"];
      break;
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW":
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      length = parseInt(alg.slice(1, 4), 10);
      algorithm = { name: "AES-GCM", length };
      keyUsages = ["encrypt", "decrypt"];
      break;
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
  }
  return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, keyUsages);
}

// dist/webapi/index.js
var cryptoRuntime = "WebCryptoAPI";
export {
  CompactEncrypt,
  CompactSign,
  EmbeddedJWK,
  EncryptJWT,
  FlattenedEncrypt,
  FlattenedSign,
  GeneralEncrypt,
  GeneralSign,
  SignJWT,
  UnsecuredJWT,
  base64url_exports as base64url,
  calculateJwkThumbprint,
  calculateJwkThumbprintUri,
  compactDecrypt,
  compactVerify,
  createLocalJWKSet,
  createRemoteJWKSet,
  cryptoRuntime,
  customFetch,
  decodeJwt,
  decodeProtectedHeader,
  errors_exports as errors,
  exportJWK,
  exportPKCS8,
  exportSPKI,
  flattenedDecrypt,
  flattenedVerify,
  generalDecrypt,
  generalVerify,
  generateKeyPair,
  generateSecret,
  importJWK,
  importPKCS8,
  importSPKI,
  importX509,
  jwksCache,
  jwtDecrypt,
  jwtVerify
};
