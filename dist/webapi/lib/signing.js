import { checkCryptoKey, checkModulusLength } from "./crypto_key.js";
async function getSigKey(entry, key, usage) {
  return key instanceof Uint8Array ? crypto.subtle.importKey("raw", key, entry.subtle, !1, [
    usage
  ]) : (checkCryptoKey(key, entry.subtle, usage), entry.minRsaBits && checkModulusLength(entry.alg, key), key);
}
async function sign(entry, key, data) {
  const cryptoKey = await getSigKey(entry, key, "sign"), signature = await crypto.subtle.sign(entry.signing, cryptoKey, data);
  return new Uint8Array(signature);
}
async function verify(entry, key, signature, data) {
  const cryptoKey = await getSigKey(entry, key, "verify");
  try {
    return await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
  } catch {
    return !1;
  }
}
export {
  sign,
  verify
};
