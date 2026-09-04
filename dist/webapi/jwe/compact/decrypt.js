import { prepareDecrypt, decryptCompact } from "../../lib/jwe_decrypt.js";
async function compactDecrypt(jwe, key, options) {
  const decrypted = await decryptCompact(jwe, prepareDecrypt(options), key), result = { plaintext: decrypted[0], protectedHeader: decrypted[1] };
  return typeof key == "function" ? { ...result, key: decrypted[2] } : result;
}
export {
  compactDecrypt
};
