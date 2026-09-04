import { invalidKeyInput } from "./invalid_key_input.js";
import { encodeBase64, decodeBase64 } from "../lib/base64.js";
import { JOSENotSupported } from "../util/errors.js";
import { keyAlgorithm, unsupportedAlg, algArgument } from "./key_algorithm.js";
import { isCryptoKey, isKeyObject } from "./is_key_like.js";
import { validateExtractableOption } from "./key_options.js";
const formatPEM = (b64, descriptor) => {
  const newlined = (b64.match(/.{1,64}/g) || []).join(`
`);
  return `-----BEGIN ${descriptor}-----
${newlined}
-----END ${descriptor}-----`;
}, genericExport = async (keyType, keyFormat, key) => {
  if (isKeyObject(key)) {
    if (key.type !== keyType)
      throw new TypeError(`key is not a ${keyType} key`);
    return key.export({ format: "pem", type: keyFormat });
  }
  if (!isCryptoKey(key))
    throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject"));
  if (!key.extractable)
    throw new TypeError("CryptoKey is not extractable");
  if (key.type !== keyType)
    throw new TypeError(`key is not a ${keyType} key`);
  return formatPEM(encodeBase64(new Uint8Array(await crypto.subtle.exportKey(keyFormat, key))), `${keyType.toUpperCase()} KEY`);
}, toSPKI = (key) => genericExport("public", "spki", key), toPKCS8 = (key) => genericExport("private", "pkcs8", key), bytesEqual = (a, b) => {
  if (a.byteLength !== b.length)
    return !1;
  for (let i = 0; i < a.byteLength; i++)
    if (a[i] !== b[i])
      return !1;
  return !0;
}, createASN1State = (data) => ({ data, pos: 0 }), readByte = (state) => {
  const byte = state.data[state.pos++];
  if (byte === void 0)
    throw new Error("Unexpected end of ASN.1 input");
  return byte;
}, parseLength = (state) => {
  const first = readByte(state);
  if (first & 128) {
    const lengthOfLen = first & 127;
    let length = 0;
    for (let i = 0; i < lengthOfLen; i++)
      length = length << 8 | readByte(state);
    return length;
  }
  return first;
}, skipElement = (state, count = 1) => {
  for (; count-- > 0; ) {
    state.pos++;
    const length = parseLength(state);
    state.pos += length;
  }
}, expectTag = (state, expectedTag, errorMessage) => {
  if (readByte(state) !== expectedTag)
    throw new Error(errorMessage);
}, getSubarray = (state, length) => {
  if (length < 0 || state.pos + length > state.data.length)
    throw new Error("Unexpected end of ASN.1 input");
  const result = state.data.subarray(state.pos, state.pos + length);
  return state.pos += length, result;
}, parseAlgorithmOID = (state) => {
  expectTag(state, 6, "Expected algorithm OID");
  const oidLen = parseLength(state);
  return getSubarray(state, oidLen);
};
function parseKeyHeader(state, keyFormat) {
  if (expectTag(state, 48, `Invalid ${keyFormat === "spki" ? "SPKI" : "PKCS#8"} structure`), parseLength(state), keyFormat === "pkcs8") {
    expectTag(state, 2, "Expected version field");
    const length = parseLength(state);
    state.pos += length;
  }
  expectTag(state, 48, "Expected algorithm identifier"), parseLength(state);
}
const parseECAlgorithmIdentifier = (state) => {
  const algOid = parseAlgorithmOID(state);
  if (bytesEqual(algOid, [43, 101, 110]))
    return "X25519";
  if (!bytesEqual(algOid, [42, 134, 72, 206, 61, 2, 1]))
    throw new Error("Unsupported key algorithm");
  expectTag(state, 6, "Expected curve OID");
  const curveOidLen = parseLength(state), curveOid = getSubarray(state, curveOidLen);
  if (bytesEqual(curveOid, [42, 134, 72, 206, 61, 3, 1, 7]))
    return "P-256";
  if (bytesEqual(curveOid, [43, 129, 4, 0, 34]))
    return "P-384";
  if (bytesEqual(curveOid, [43, 129, 4, 0, 35]))
    return "P-521";
  throw new Error("Unsupported named curve");
}, genericImport = async (keyFormat, keyData, alg, options) => {
  const extractable = validateExtractableOption(options?.extractable), entry = keyAlgorithm(alg, algArgument);
  entry.secret && unsupportedAlg(algArgument);
  const isPublic = keyFormat === "spki";
  let algorithm;
  if (entry.resolve)
    try {
      const state = createASN1State(keyData);
      parseKeyHeader(state, keyFormat), algorithm = entry.resolve({ crv: parseECAlgorithmIdentifier(state) });
    } catch {
      throw new JOSENotSupported("Invalid or unsupported key format");
    }
  else
    algorithm = entry.subtle;
  return crypto.subtle.importKey(keyFormat, keyData, algorithm, extractable ?? isPublic, entry.usages[isPublic ? 0 : 1]);
}, processPEMData = (pem, pattern) => decodeBase64(pem.replace(pattern, "")), fromPKCS8 = (pem, alg, options) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
  return genericImport("pkcs8", keyData, alg, options);
}, fromSPKI = (pem, alg, options) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g);
  return genericImport("spki", keyData, alg, options);
};
function spkiFromX509(buf) {
  const state = createASN1State(buf);
  expectTag(state, 48, "Invalid certificate structure");
  const certificateLength = parseLength(state);
  if (certificateLength < 0 || state.pos + certificateLength > state.data.length)
    throw new Error("Unexpected end of ASN.1 input");
  expectTag(state, 48, "Invalid tbsCertificate structure"), parseLength(state), buf[state.pos] === 160 ? skipElement(state, 6) : skipElement(state, 5);
  const spkiStart = state.pos;
  expectTag(state, 48, "Invalid SPKI structure");
  const spkiContentLen = parseLength(state);
  return buf.subarray(spkiStart, spkiStart + spkiContentLen + (state.pos - spkiStart));
}
const fromX509 = (pem, alg, options) => {
  let spki;
  try {
    const certificate = processPEMData(pem, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
    spki = spkiFromX509(certificate);
  } catch (cause) {
    throw new TypeError("Failed to parse the X.509 certificate", { cause });
  }
  return genericImport("spki", spki, alg, options);
};
export {
  fromPKCS8,
  fromSPKI,
  fromX509,
  toPKCS8,
  toSPKI
};
