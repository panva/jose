import { encodeJsonUnencodedPayload, parseProtectedHeader, prepareVerify, snapshotJws, verifySignature, verifyResult } from "../../lib/jws_verify.js";
import { JWSInvalid, JWSSignatureVerificationFailed } from "../../util/errors.js";
import { isObject } from "../../lib/type_checks.js";
function snapshotSignature(signature, payload) {
  try {
    const jws = snapshotJws(signature, [payload]), { protected: encodedProtected, header, signature: encodedSignature } = jws;
    if (encodedProtected === void 0 && header === void 0 || encodedProtected !== void 0 && typeof encodedProtected != "string" || typeof encodedSignature != "string" || header !== void 0 && !isObject(header))
      return;
    const protectedHeader = parseProtectedHeader(encodedProtected), { b64, crit } = protectedHeader;
    return [
      jws,
      protectedHeader,
      Array.isArray(crit) && crit.includes("b64") ? typeof b64 == "boolean" ? b64 ? 1 : 2 : 0 : 1
    ];
  } catch {
    return;
  }
}
async function generalVerify(jws, key, options) {
  if (!isObject(jws))
    throw new JWSInvalid("General JWS must be an object");
  const { signatures, payload: inputPayload } = jws;
  if (!Array.isArray(signatures))
    throw new JWSInvalid("JWS Signatures missing or incorrect type");
  const signatureEntries = Array.from(signatures);
  if (!signatureEntries.every(isObject))
    throw new JWSInvalid("JWS Signatures missing or incorrect type");
  let shared;
  try {
    if (inputPayload === void 0)
      throw new Error();
    shared = prepareVerify(options);
  } catch {
    throw new JWSSignatureVerificationFailed();
  }
  const payload = inputPayload instanceof Uint8Array ? new Uint8Array(inputPayload) : inputPayload, candidates = signatureEntries.map((signature) => snapshotSignature(signature, payload)).filter((candidate) => candidate !== void 0);
  let modes = 0;
  for (const [, , mode] of candidates)
    if (modes |= mode, modes === 3)
      throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
  for (const candidate of candidates)
    try {
      return verifyResult(candidate[0], await verifySignature(candidate[0], shared, key, encodeJsonUnencodedPayload, candidate[1]));
    } catch {
    }
  throw new JWSSignatureVerificationFailed();
}
export {
  generalVerify
};
