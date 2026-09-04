import { prepareDecrypt, shareJWE, decryptRecipient, decryptResult, checkRecipient, snapshotSharedJWE, snapshotRecipientJWE } from "../../lib/jwe_decrypt.js";
import { JWEDecryptionFailed, JWEInvalid } from "../../util/errors.js";
import { isObject } from "../../lib/type_checks.js";
import { JWE, isJWECEKTransport } from "../../lib/jwe_algorithms.js";
async function generalDecrypt(jwe, key, options) {
  if (!isObject(jwe))
    throw new JWEInvalid("General JWE must be an object");
  const inputRecipients = jwe.recipients;
  if (!Array.isArray(inputRecipients))
    throw new JWEInvalid("JWE Recipients missing or incorrect type");
  const recipients = Array.from(inputRecipients);
  if (!recipients.every(isObject))
    throw new JWEInvalid("JWE Recipients missing or incorrect type");
  if (!recipients.length)
    throw new JWEInvalid("JWE Recipients has no members");
  let shared, sharedJwe, token;
  try {
    shared = prepareDecrypt(options), sharedJwe = snapshotSharedJWE(jwe), token = shareJWE(sharedJwe);
  } catch {
    throw new JWEDecryptionFailed();
  }
  const recipientSnapshots = recipients.map((recipient) => snapshotRecipientJWE(recipient)), recipientAlgorithms = recipientSnapshots.map(([, headerAlg]) => token[0]?.alg ?? headerAlg ?? sharedJwe.unprotected?.alg);
  if (recipients.length > 1)
    for (const alg of recipientAlgorithms) {
      const algEntry = typeof alg == "string" ? JWE[alg] : void 0;
      if (algEntry && !isJWECEKTransport(algEntry))
        throw new JWEInvalid(`"${alg}" alg may only have a single recipient`);
    }
  for (const [recipient] of recipientSnapshots)
    if (recipient)
      try {
        const flattened = { ...sharedJwe, ...recipient };
        return checkRecipient(flattened), decryptResult(flattened, await decryptRecipient(flattened, token, shared, key));
      } catch {
      }
  throw new JWEDecryptionFailed();
}
export {
  generalDecrypt
};
