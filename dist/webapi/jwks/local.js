import { jwkToKey } from "../lib/jwk_to_key.js";
import { JWS } from "../lib/jws_algorithms.js";
import { JWKSInvalid, JOSENotSupported, JWKSNoMatchingKey, JWKSMultipleMatchingKeys } from "../util/errors.js";
import { isJwkSet } from "../lib/type_checks.js";
import { snapshotJwk } from "../lib/jwk_metadata.js";
function isUsableJWK(jwk, entry, alg, kid) {
  const { kty, key_ops, ext, kid: jwkKid, alg: jwkAlg, use, crv } = snapshotJwk(jwk), keyOps = Array.isArray(key_ops) ? [...key_ops] : key_ops;
  return (ext === void 0 || typeof ext == "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index) => typeof operation == "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid == "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
}
async function importWithAlgCache(cache, jwk, entry) {
  const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk), { alg } = entry;
  if (cached[alg] === void 0) {
    const key = await jwkToKey(entry, { ...jwk, alg, ext: !0 });
    if (key.type !== "public")
      throw new JWKSInvalid("JSON Web Key Set members must be public keys");
    cached[alg] = key;
  }
  return cached[alg];
}
function createLocalJWKSet(jwks) {
  let snapshot;
  try {
    snapshot = structuredClone(jwks);
  } catch {
  }
  if (!isJwkSet(snapshot))
    throw new JWKSInvalid("JSON Web Key Set malformed");
  const cached = /* @__PURE__ */ new WeakMap();
  return Object.defineProperty(async (protectedHeader, token) => {
    const { alg, kid } = { ...protectedHeader, ...token?.header }, entry = typeof alg == "string" ? JWS[alg] : void 0;
    if (!entry || entry.secret)
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    const candidates = snapshot.keys.filter((jwk2) => isUsableJWK(jwk2, entry, alg, kid)), { 0: jwk, length } = candidates;
    if (!length)
      throw new JWKSNoMatchingKey();
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      throw error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates)
          try {
            yield await importWithAlgCache(cached, jwk2, entry);
          } catch {
          }
      }, error;
    }
    return importWithAlgCache(cached, jwk, entry);
  }, "jwks", {
    value: () => structuredClone(snapshot)
  });
}
export {
  createLocalJWKSet
};
