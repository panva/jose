import { parseJoseHeader } from "../lib/validate.js";
function decodeProtectedHeader(token) {
  let protectedB64u;
  if (typeof token == "string") {
    const parts = token.split(".");
    (parts.length === 3 || parts.length === 5) && ([protectedB64u] = parts);
  } else if (typeof token == "object" && token)
    if ("protected" in token)
      protectedB64u = token.protected;
    else
      throw new TypeError("Token does not contain a Protected Header");
  const invalid = "Invalid Token or Protected Header formatting";
  if (typeof protectedB64u != "string" || !protectedB64u)
    throw new TypeError(invalid);
  return parseJoseHeader(protectedB64u, TypeError, invalid);
}
export {
  decodeProtectedHeader
};
