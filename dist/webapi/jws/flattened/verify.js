import { JWSInvalid } from "../../util/errors.js";
import { isObject } from "../../lib/type_checks.js";
import { encodeJsonUnencodedPayload, prepareVerify, snapshotJws, verifySignature, verifyResult } from "../../lib/jws_verify.js";
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws))
    throw new JWSInvalid("Flattened JWS must be an object");
  const snapshot = snapshotJws(jws);
  if (snapshot.protected === void 0 && snapshot.header === void 0)
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  if (snapshot.protected !== void 0 && typeof snapshot.protected != "string")
    throw new JWSInvalid("JWS Protected Header incorrect type");
  if (snapshot.payload === void 0)
    throw new JWSInvalid("JWS Payload missing");
  if (typeof snapshot.signature != "string")
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  if (snapshot.header !== void 0 && !isObject(snapshot.header))
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  return verifyResult(snapshot, await verifySignature(snapshot, prepareVerify(options), key, encodeJsonUnencodedPayload));
}
export {
  flattenedVerify
};
