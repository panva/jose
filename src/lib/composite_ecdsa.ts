import { concat } from './buffer_utils.js'

function checkSize(size: number) {
  if (size !== 32 && size !== 48) {
    throw new TypeError('Invalid ECDSA key size')
  }
}

function encodeInteger(raw: Uint8Array): Uint8Array {
  let offset = 0
  while (offset < raw.length - 1 && raw[offset] === 0) offset++
  const value = raw.subarray(offset)
  const padding = value[0] & 0x80 ? 1 : 0
  const header = new Uint8Array(2 + padding)
  header.set([0x02, value.length + padding])
  return concat(header, value)
}

export function encodeSignature(raw: Uint8Array): Uint8Array {
  const size = raw.length / 2
  checkSize(size)
  const r = encodeInteger(raw.subarray(0, size))
  const s = encodeInteger(raw.subarray(size))
  return concat(Uint8Array.of(0x30, r.length + s.length), r, s)
}

export function decodeSignature(der: Uint8Array, size: number): Uint8Array {
  checkSize(size)
  const invalid = () => new TypeError('Invalid ECDSA signature encoding')
  if (der.length < 8 || der.length > 2 * size + 8 || der[0] !== 0x30 || der[1] !== der.length - 2) {
    throw invalid()
  }

  const raw = new Uint8Array(2 * size)
  let offset = 2
  for (const start of [0, size]) {
    if (der[offset++] !== 0x02) throw invalid()
    let length = der[offset++]
    if (!length || length > size + 1 || offset + length > der.length || der[offset] & 0x80) {
      throw invalid()
    }
    if (length > 1 && der[offset] === 0) {
      if (der[offset + 1] < 0x80) throw invalid()
      offset++
      length--
    }
    if (length > size) throw invalid()
    raw.set(der.subarray(offset, offset + length), start + size - length)
    offset += length
  }
  if (offset !== der.length) throw invalid()
  return raw
}

function privateKeyEncoding(size: number): [Uint8Array, Uint8Array] {
  checkSize(size)
  return [
    Uint8Array.of(0x30, size === 32 ? 0x31 : 0x3e, 0x02, 0x01, 0x01, 0x04, size),
    size === 32
      ? Uint8Array.of(0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07)
      : Uint8Array.of(0xa0, 0x07, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22),
  ]
}

export function encodePrivateKey(raw: Uint8Array): Uint8Array {
  const [header, footer] = privateKeyEncoding(raw.length)
  return concat(header, raw, footer)
}

export function decodePrivateKey(der: Uint8Array, size: number): Uint8Array {
  const [header, footer] = privateKeyEncoding(size)
  if (
    der.length !== header.length + size + footer.length ||
    header.some((byte, index) => der[index] !== byte) ||
    footer.some((byte, index) => der[header.length + size + index] !== byte)
  ) {
    throw new TypeError('Invalid ECDSA private key encoding')
  }
  return der.subarray(header.length, header.length + size)
}
