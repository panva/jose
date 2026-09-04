import { decode } from "../util/base64url.js";
import { encode, strictDecoder } from "./buffer_utils.js";
import { isObject } from "./type_checks.js";
const unprotected = /* @__PURE__ */ Symbol();
function assertNotSet(value, name) {
  if (value !== void 0)
    throw new TypeError(`${name} can only be called once`);
}
function decodeBase64url(value, label, ErrorClass) {
  try {
    return decode(value);
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`);
  }
}
function encodeBase64url(value, label, ErrorClass) {
  try {
    return encode(value);
  } catch {
    throw new ErrorClass(`The ${label} is not a valid base64url string`);
  }
}
async function digest(algorithm, data) {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`;
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
}
function parseJoseHeader(b64, ErrorClass, message) {
  let parsed;
  try {
    parsed = JSON.parse(strictDecoder.decode(decode(b64)));
  } catch {
    throw new ErrorClass(message);
  }
  if (!isObject(parsed))
    throw new ErrorClass(message);
  return parsed;
}
export {
  assertNotSet,
  decodeBase64url,
  digest,
  encodeBase64url,
  parseJoseHeader,
  unprotected
};
