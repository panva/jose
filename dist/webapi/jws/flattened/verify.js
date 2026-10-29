import { JWSInvalid } from "../../util/errors.js";
import { isObject } from "../../lib/validate.js";
import { encodeJsonUnencodedPayload, prepareVerify, snapshotJws, verifySignature } from "../../lib/jws_verify.js";
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws))
    throw new JWSInvalid("Flattened JWS must be an object");
  const snapshot = snapshotJws(jws), [result] = await verifySignature(snapshot, prepareVerify(options), key, encodeJsonUnencodedPayload);
  return result;
}
export {
  flattenedVerify
};
