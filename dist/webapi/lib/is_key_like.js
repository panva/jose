function assertCryptoKey(key) {
  if (!isCryptoKey(key))
    throw new Error("CryptoKey instance expected");
}
const isCryptoKey = (key) => {
  if (key?.[Symbol.toStringTag] === "CryptoKey")
    return !0;
  try {
    return key instanceof CryptoKey;
  } catch {
    return !1;
  }
}, isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject", isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
export {
  assertCryptoKey,
  isCryptoKey,
  isKeyLike,
  isKeyObject
};
