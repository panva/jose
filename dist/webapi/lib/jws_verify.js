import { jwsAlgorithm } from "./jws_algorithms.js";
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from "../util/errors.js";
import { concat, decoder, encoder, encode } from "./buffer_utils.js";
import { decodeBase64url, encodeBase64url, parseJoseHeader, isDisjoint, isObject, validateB64, validateCrit, validateAlgorithms, JWS_RECOGNIZED } from "./validate.js";
import { prepareKey, rawKey, checkModulusLength } from "./key.js";
function snapshotJws(jws, sharedPayload) {
  const encodedProtected = jws.protected, inputHeader = jws.header, header = isObject(inputHeader) ? { ...inputHeader } : inputHeader;
  let payload = sharedPayload ? sharedPayload[0] : jws.payload;
  !sharedPayload && payload instanceof Uint8Array && (payload = new Uint8Array(payload));
  const signature = jws.signature, snapshot = { payload, signature };
  if (encodedProtected !== void 0 && (snapshot.protected = encodedProtected), inputHeader !== void 0 && (snapshot.header = header), encodedProtected === void 0 && header === void 0)
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  if (encodedProtected !== void 0 && typeof encodedProtected != "string")
    throw new JWSInvalid("JWS Protected Header incorrect type");
  if (payload === void 0)
    throw new JWSInvalid("JWS Payload missing");
  if (typeof signature != "string")
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  if (header !== void 0 && !isObject(header))
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  return snapshot;
}
function prepareVerify(options) {
  return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
function parseProtectedHeader(encodedProtected) {
  return encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid");
}
function encodeJsonUnencodedPayload(payload) {
  const invalid = /[\p{Cs}\p{Cn}]/u.exec(payload)?.[0];
  if (invalid !== void 0)
    throw new JWSInvalid(/\p{Cs}/u.test(invalid) ? "JWS Payload must be a well-formed Unicode string" : "JWS Payload must not contain unassigned Unicode code points");
  return encoder.encode(payload);
}
function encodeCompactUnencodedPayload(payload) {
  try {
    return encode(payload);
  } catch {
    throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
  }
}
async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
  const { protected: encodedProtected, header, payload: inputPayload } = jws, parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected);
  if (!isDisjoint(parsedProt, header))
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const joseHeader = { ...parsedProt, ...header }, b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader)), { alg } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  if (shared[0] && !shared[0].has(alg))
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  if (b64) {
    if (typeof inputPayload != "string")
      throw new JWSInvalid("JWS Payload must be a string");
  } else if (typeof inputPayload != "string" && !(inputPayload instanceof Uint8Array))
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  const signingPayload = b64 || typeof inputPayload != "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
  let resolvedKey = !1;
  typeof key == "function" && (key = await key(parsedProt, jws), resolvedKey = !0);
  const entry = jwsAlgorithm(alg), data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array(), encode("."), typeof signingPayload == "string" ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload), signature = decodeBase64url(jws.signature, "signature", JWSInvalid), k = await prepareKey(entry, key, "verify"), cryptoKey = await rawKey(k, entry.subtle, "verify");
  entry.minRsaBits && checkModulusLength(entry.alg, cryptoKey);
  let verified = !1;
  try {
    verified = await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
  } catch {
  }
  if (!verified)
    throw new JWSSignatureVerificationFailed();
  const result = { payload: typeof signingPayload == "string" ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload };
  return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? [{ ...result, key: k }, b64] : [result, b64];
}
async function verifyCompact(jws, shared, key) {
  if (jws instanceof Uint8Array && (jws = decoder.decode(jws)), typeof jws != "string")
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3)
    throw new JWSInvalid("Invalid Compact JWS");
  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key, encodeCompactUnencodedPayload);
}
export {
  encodeJsonUnencodedPayload,
  parseProtectedHeader,
  prepareVerify,
  snapshotJws,
  verifyCompact,
  verifySignature
};
