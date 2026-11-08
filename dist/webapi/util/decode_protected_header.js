import { parseJoseHeader } from "../lib/validate.js";
function decodeProtectedHeader(token) {
  let encodedProtectedHeader;
  if (typeof token == "string") {
    const parts = token.split(".");
    (parts.length === 3 || parts.length === 5) && ([encodedProtectedHeader] = parts);
  } else if (typeof token == "object" && token)
    if ("protected" in token)
      encodedProtectedHeader = token.protected;
    else
      throw new TypeError("Token does not contain a Protected Header");
  const invalid = "Invalid Token or Protected Header formatting";
  if (typeof encodedProtectedHeader != "string" || !encodedProtectedHeader)
    throw new TypeError(invalid);
  return parseJoseHeader(encodedProtectedHeader, TypeError, invalid);
}
export {
  decodeProtectedHeader
};
