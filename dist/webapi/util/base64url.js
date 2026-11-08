import { encoder, decoder, encodeBase64, decodeBase64 } from "../lib/buffer_utils.js";
const invalid = "The input to be decoded is not correctly encoded.";
function decode(input) {
  try {
    return decodeBase64(typeof input == "string" ? input : decoder.decode(input), !0);
  } catch (cause) {
    throw new TypeError(invalid, { cause });
  }
}
function encode(input) {
  return encodeBase64(typeof input == "string" ? encoder.encode(input) : input, !0);
}
export {
  decode,
  encode
};
