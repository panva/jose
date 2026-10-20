import { decode as b64u } from "./base64url.js";
import { strictDecoder } from "../lib/buffer_utils.js";
import { isObject } from "../lib/validate.js";
import { JWTInvalid } from "./errors.js";
function decodeJwt(jwt) {
  if (typeof jwt != "string")
    throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
  const { 1: encodedPayload, length } = jwt.split(".");
  if (length === 5)
    throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
  if (length !== 3)
    throw new JWTInvalid("Invalid JWT");
  if (!encodedPayload)
    throw new JWTInvalid("JWTs must contain a payload");
  let claimsSetBytes;
  try {
    claimsSetBytes = b64u(encodedPayload);
  } catch (cause) {
    throw new JWTInvalid("Failed to base64url decode the payload", { cause });
  }
  let claimsSet;
  try {
    claimsSet = JSON.parse(strictDecoder.decode(claimsSetBytes));
  } catch (cause) {
    throw new JWTInvalid("Failed to parse the decoded payload as JSON", { cause });
  }
  if (!isObject(claimsSet))
    throw new JWTInvalid("Invalid JWT Claims Set");
  return claimsSet;
}
export {
  decodeJwt
};
