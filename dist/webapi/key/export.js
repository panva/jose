import { toSPKI as exportPublic, toPKCS8 as exportPrivate } from "../lib/asn1.js";
import { invalidKeyInput, isCryptoKey, isKeyObject } from "../lib/key.js";
import { encode as b64u } from "../util/base64url.js";
function exportSPKI(key) {
  return exportPublic(key);
}
function exportPKCS8(key) {
  return exportPrivate(key);
}
async function exportJWK(key) {
  if (isKeyObject(key))
    if (key.type === "secret")
      key = key.export();
    else
      return key.export({ format: "jwk" });
  if (key instanceof Uint8Array)
    return {
      kty: "oct",
      k: b64u(key)
    };
  if (!isCryptoKey(key))
    throw new TypeError(invalidKeyInput(key, "CryptoKey", "KeyObject", "Uint8Array"));
  if (!key.extractable)
    throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");
  const jwk = await crypto.subtle.exportKey("jwk", key);
  delete jwk.ext, delete jwk.key_ops, delete jwk.use, jwk.kty !== "AKP" && delete jwk.alg;
  for (const parameter of Object.keys(jwk))
    jwk[parameter] === void 0 && delete jwk[parameter];
  return jwk;
}
export {
  exportJWK,
  exportPKCS8,
  exportSPKI
};
