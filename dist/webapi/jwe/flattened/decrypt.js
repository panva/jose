import { JWEInvalid } from "../../util/errors.js";
import { isObject } from "../../lib/type_checks.js";
import { prepareDecrypt, decryptJWE, decryptResult, checkRecipient, snapshotSharedJWE, snapshotRecipientJWE } from "../../lib/jwe_decrypt.js";
async function flattenedDecrypt(jwe, key, options) {
  if (!isObject(jwe))
    throw new JWEInvalid("Flattened JWE must be an object");
  const shared = snapshotSharedJWE(jwe), [recipient, , error] = snapshotRecipientJWE(jwe);
  if (!recipient)
    throw error;
  const snapshot = { ...shared, ...recipient };
  return checkRecipient(snapshot), decryptResult(snapshot, await decryptJWE(snapshot, prepareDecrypt(options), key));
}
export {
  flattenedDecrypt
};
