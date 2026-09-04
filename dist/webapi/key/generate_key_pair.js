import { JOSENotSupported } from "../util/errors.js";
import { validateExtractableOption } from "../lib/key_options.js";
import { keyAlgorithm, unsupportedAlg, algArgument } from "../lib/key_algorithm.js";
function getModulusLengthOption(options) {
  const modulusLength = options?.modulusLength ?? 2048;
  if (typeof modulusLength != "number" || !Number.isInteger(modulusLength) || modulusLength < 2048)
    throw new JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
  return modulusLength;
}
async function generateKeyPair(alg, options) {
  const extractable = validateExtractableOption(options?.extractable), entry = keyAlgorithm(alg, algArgument);
  entry.secret && unsupportedAlg(algArgument);
  let algorithm;
  if (entry.resolve) {
    const crv = options?.crv ?? "P-256";
    switch (crv) {
      case "P-256":
      case "P-384":
      case "P-521":
        algorithm = { name: "ECDH", namedCurve: crv };
        break;
      case "X25519":
        algorithm = { name: "X25519" };
        break;
      default:
        throw new JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519");
    }
  } else {
    if (entry.crv !== void 0 && options?.crv !== void 0 && options.crv !== entry.crv)
      throw new JOSENotSupported(`Invalid or unsupported crv option provided, the only supported value for ${alg} is ${entry.crv}`);
    algorithm = entry.kty[0] === "RSA" ? {
      ...entry.subtle,
      publicExponent: Uint8Array.of(1, 0, 1),
      modulusLength: getModulusLengthOption(options)
    } : entry.subtle;
  }
  return crypto.subtle.generateKey(algorithm, extractable ?? !1, [
    ...entry.usages[1],
    ...entry.usages[0]
  ]);
}
export {
  generateKeyPair
};
