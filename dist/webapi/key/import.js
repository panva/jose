import { decode as decodeBase64URL } from "../util/base64url.js";
import { fromSPKI, fromPKCS8, fromX509 } from "../lib/asn1.js";
import { jwkToKey, validateExtractableOption, normalizeJwk } from "../lib/key.js";
import { keyAlgorithm } from "../lib/key_algorithm.js";
import { JOSENotSupported } from "../util/errors.js";
import { isObject } from "../lib/validate.js";
async function importSPKI(spki, alg, options) {
  if (typeof spki != "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0)
    throw new TypeError('"spki" must be SPKI formatted string');
  return fromSPKI(spki, alg, options);
}
async function importX509(x509, alg, options) {
  if (typeof x509 != "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0)
    throw new TypeError('"x509" must be X.509 formatted string');
  return fromX509(x509, alg, options);
}
async function importPKCS8(pkcs8, alg, options) {
  if (typeof pkcs8 != "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0)
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
  return fromPKCS8(pkcs8, alg, options);
}
async function importJWK(jwk, alg, options) {
  if (!isObject(jwk))
    throw new TypeError("JWK must be an object");
  const normalized = normalizeJwk(jwk), extractable = validateExtractableOption(options?.extractable), { alg: jwkAlg } = normalized;
  if (alg ??= jwkAlg, normalized.kty !== "oct" && !alg)
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  switch (normalized.kty) {
    case "oct":
      if (typeof normalized.k != "string")
        throw new TypeError('missing "k" (Key Value) Parameter value');
      return decodeBase64URL(normalized.k);
    case "AKP": {
      if (typeof jwkAlg != "string" || !jwkAlg)
        throw new TypeError('missing "alg" (Algorithm) Parameter value');
      if (alg !== jwkAlg)
        throw new TypeError("JWK alg and alg option value mismatch");
      return jwkToKey(keyAlgorithm(alg), normalized, extractable);
    }
    case "RSA":
    case "EC":
    case "OKP":
      return jwkToKey(keyAlgorithm(alg), normalized, extractable);
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}
export {
  importJWK,
  importPKCS8,
  importSPKI,
  importX509
};
