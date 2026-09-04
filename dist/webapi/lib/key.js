import { withAlg as invalidKeyInput } from "./invalid_key_input.js";
import { isKeyLike, isCryptoKey } from "./is_key_like.js";
import { isObject } from "./type_checks.js";
import { decode } from "../util/base64url.js";
import { jwkToKey } from "./jwk_to_key.js";
import { normalizeJwk } from "./jwk_metadata.js";
const tag = (key) => key[Symbol.toStringTag], jwkMatchesOp = (entry, key, usage) => {
  const { alg } = entry;
  if (key.use !== void 0) {
    const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
    if (key.use !== expected)
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
  }
  if (key.alg !== void 0 && key.alg !== alg)
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  if (Array.isArray(key.key_ops)) {
    const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
    if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp))
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
  }
};
function checkKeyType(entry, key, usage) {
  const { alg, secret } = entry, privateKey = usage === "decrypt" || usage === "sign";
  if (secret && key instanceof Uint8Array)
    return [BYTES, key];
  if (isObject(key)) {
    const normalized = normalizeJwk(key);
    if (typeof normalized.kty != "string")
      throw new TypeError(secret ? invalidKeyInput(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : invalidKeyInput(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
    if (!(secret ? normalized.kty === "oct" && typeof normalized.k == "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv == "string" || typeof normalized.d == "string" : normalized.d === void 0 && normalized.priv === void 0)))
      throw new TypeError(secret ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
    return jwkMatchesOp(entry, normalized, usage), [JWK, key, normalized];
  }
  if (!isKeyLike(key))
    throw new TypeError(secret ? invalidKeyInput(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : invalidKeyInput(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
  if (secret) {
    if (key.type !== "secret")
      throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  } else {
    if (key.type === "secret")
      throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    const expectedType = privateKey ? "private" : "public";
    if ((key.type === "public" || key.type === "private") && key.type !== expectedType) {
      const operation = usage === "sign" ? "signing" : usage === "verify" ? "verifying" : `${usage.slice(0, -1)}tion`;
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`);
    }
  }
  return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key];
}
const BYTES = 0, CRYPTO = 1, KEYOBJECT = 2, JWK = 3;
let cache;
const nist = {
  __proto__: null,
  prime256v1: "P-256",
  secp384r1: "P-384",
  secp521r1: "P-521"
};
function cached(key, alg, value) {
  cache ||= /* @__PURE__ */ new WeakMap();
  const entry = cache.get(key);
  return value && (entry ? entry[alg] = value : cache.set(key, { [alg]: value })), value ?? entry?.[alg];
}
const handleJWK = async (key, jwk, entry) => cached(key, entry.alg) ?? cached(key, entry.alg, await jwkToKey(entry, { ...jwk, alg: entry.alg })), handleKeyObject = (keyObject, entry) => {
  const hit = cached(keyObject, entry.alg);
  if (hit)
    return hit;
  const isPublic = keyObject.type === "public", usages = entry.usages[isPublic ? 0 : 1], { asymmetricKeyType } = keyObject, crv = nist[keyObject.asymmetricKeyDetails?.namedCurve], params = entry.resolve?.({ crv, asymmetricKeyType }) ?? entry.subtle;
  return cached(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
async function prepareKey(entry, key, usage) {
  const tagged = checkKeyType(entry, key, usage);
  switch (tagged[0]) {
    case BYTES:
    case CRYPTO:
      return tagged[1];
    case JWK: {
      const key2 = tagged[1], normalized = tagged[2];
      if (normalized.kty === "oct")
        return decode(normalized.k);
      if (!Object.isFrozen(key2)) {
        const { key_ops } = key2;
        Array.isArray(key_ops) && Object.freeze(key_ops), Object.freeze(key2);
      }
      return handleJWK(key2, normalized, entry);
    }
    case KEYOBJECT: {
      const keyObject = tagged[1];
      return keyObject.type === "secret" ? keyObject.export() : "toCryptoKey" in keyObject && typeof keyObject.toCryptoKey == "function" ? handleKeyObject(keyObject, entry) : handleJWK(keyObject, keyObject.export({ format: "jwk" }), entry);
    }
  }
}
export {
  checkKeyType,
  prepareKey
};
