import { unsupportedAlg, algArgument } from "../lib/key_algorithm.js";
import { validateExtractableOption } from "../lib/key.js";
async function generateSecret(alg, options) {
  const extractable = validateExtractableOption(options?.extractable);
  let keyLengthBits, algorithm, keyUsages;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      keyLengthBits = +alg.slice(-3), algorithm = { name: "HMAC", hash: `SHA-${keyLengthBits}`, length: keyLengthBits }, keyUsages = ["sign", "verify"];
      break;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return crypto.getRandomValues(new Uint8Array(+alg.slice(-3) >> 3));
    case "A128KW":
    case "A192KW":
    case "A256KW":
      keyLengthBits = +alg.slice(1, 4), algorithm = { name: "AES-KW", length: keyLengthBits }, keyUsages = ["wrapKey", "unwrapKey"];
      break;
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW":
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      keyLengthBits = +alg.slice(1, 4), algorithm = { name: "AES-GCM", length: keyLengthBits }, keyUsages = ["encrypt", "decrypt"];
      break;
    default:
      unsupportedAlg(algArgument);
  }
  return crypto.subtle.generateKey(algorithm, extractable ?? !1, keyUsages);
}
export {
  generateSecret
};
