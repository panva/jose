import { JWEInvalid } from "../../util/errors.js";
import { isObject } from "../../lib/validate.js";
import { prepareDecrypt, decryptJWE, checkRecipient, snapshotSharedJWE, snapshotRecipientJWE } from "../../lib/jwe_decrypt.js";
async function flattenedDecrypt(jwe, key, options) {
  if (!isObject(jwe))
    throw new JWEInvalid("Flattened JWE must be an object");
  const shared = snapshotSharedJWE(jwe), [recipient, , error] = snapshotRecipientJWE(jwe);
  if (!recipient)
    throw error;
  const snapshot = { ...shared, ...recipient };
  return checkRecipient(snapshot), decryptJWE(snapshot, prepareDecrypt(options), key);
}
export {
  flattenedDecrypt
};
