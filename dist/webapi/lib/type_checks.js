function assertUint8Array(input, label) {
  if (!(input instanceof Uint8Array))
    throw new TypeError(`${label} must be an instance of Uint8Array`);
}
function isObject(input) {
  if (typeof input != "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]")
    return !1;
  const prototype = Object.getPrototypeOf(input);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function isJwkSet(input) {
  return isObject(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject);
}
function isDisjoint(...headers) {
  const parameters = /* @__PURE__ */ new Set();
  for (const header of headers)
    if (header)
      for (const parameter of Object.keys(header)) {
        if (parameters.has(parameter))
          return !1;
        parameters.add(parameter);
      }
  return !0;
}
export {
  assertUint8Array,
  isDisjoint,
  isJwkSet,
  isObject
};
