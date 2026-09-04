import { JOSENotSupported, JWEInvalid } from "../util/errors.js";
import { concat } from "./buffer_utils.js";
function validateZip(joseHeader, protectedHeader) {
  if (joseHeader.zip !== void 0 && joseHeader.zip !== "DEF")
    throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
  if (joseHeader.zip !== void 0 && !protectedHeader?.zip)
    throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
}
function supported(name) {
  if (typeof globalThis[name] > "u")
    throw new JOSENotSupported(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${name} API.`);
}
async function compress(input) {
  supported("CompressionStream");
  const cs = new CompressionStream("deflate-raw"), writer = cs.writable.getWriter();
  writer.write(input).catch(() => {
  }), writer.close().catch(() => {
  });
  const chunks = [], reader = cs.readable.getReader();
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done)
      break;
    chunks.push(value);
  }
  return concat(...chunks);
}
async function decompress(input, maxLength) {
  supported("DecompressionStream");
  const ds = new DecompressionStream("deflate-raw"), writer = ds.writable.getWriter();
  writer.write(input).catch(() => {
  }), writer.close().catch(() => {
  });
  const chunks = [];
  let length = 0;
  const reader = ds.readable.getReader();
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done)
      break;
    if (chunks.push(value), length += value.byteLength, maxLength !== 1 / 0 && length > maxLength)
      throw new JWEInvalid("Decompressed plaintext exceeded the configured limit");
  }
  return concat(...chunks);
}
export {
  compress,
  decompress,
  validateZip
};
