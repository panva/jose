import { prepareDecrypt, decryptCompact } from "../../lib/jwe_decrypt.js";
async function compactDecrypt(jwe, key, options) {
  return decryptCompact(jwe, prepareDecrypt(options), key);
}
export {
  compactDecrypt
};
