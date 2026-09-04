import { unsupportedAlg, algArgument } from "../lib/key_algorithm.js";
import { validateExtractableOption } from "../lib/key_options.js";
async function generateSecret(alg, options) {
  const extractable = validateExtractableOption(options?.extractable);
  let length, algorithm, keyUsages;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      length = +alg.slice(-3), algorithm = { name: "HMAC", hash: `SHA-${length}`, length }, keyUsages = ["sign", "verify"];
      break;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return crypto.getRandomValues(new Uint8Array(+alg.slice(-3) >> 3));
    case "A128KW":
    case "A192KW":
    case "A256KW":
      length = +alg.slice(1, 4), algorithm = { name: "AES-KW", length }, keyUsages = ["wrapKey", "unwrapKey"];
      break;
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW":
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      length = +alg.slice(1, 4), algorithm = { name: "AES-GCM", length }, keyUsages = ["encrypt", "decrypt"];
      break;
    default:
      unsupportedAlg(algArgument);
  }
  return crypto.subtle.generateKey(algorithm, extractable ?? !1, keyUsages);
}
export {
  generateSecret
};
