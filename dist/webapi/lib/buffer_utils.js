const encoder = new TextEncoder(), decoder = new TextDecoder(), strictDecoder = new TextDecoder("utf-8", { fatal: !0 }), MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0), buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers)
    buf.set(buffer, i), i += buffer.length;
  return buf;
}
function writeUInt32BE(buf, value, offset) {
  if (value < 0 || value >= MAX_INT32)
    throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
  buf.set([value >>> 24, value >>> 16, value >>> 8, value & 255], offset);
}
function uint64be(value) {
  const high = Math.floor(value / MAX_INT32), low = value % MAX_INT32, buf = new Uint8Array(8);
  return writeUInt32BE(buf, high, 0), writeUInt32BE(buf, low, 4), buf;
}
function uint32be(value) {
  const buf = new Uint8Array(4);
  return writeUInt32BE(buf, value), buf;
}
function encode(string) {
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127)
      throw new TypeError("non-ASCII string encountered in encode()");
    bytes[i] = code;
  }
  return bytes;
}
export {
  concat,
  decoder,
  encode,
  encoder,
  strictDecoder,
  uint32be,
  uint64be
};
