export const encoder = new TextEncoder()
export const decoder = new TextDecoder()

const MAX_INT32 = 2 ** 32

export function concat(...buffers: Uint8Array[]): Uint8Array {
  const size = buffers.reduce((acc, { length }) => acc + length, 0)
  const buf = new Uint8Array(size)
  let i = 0
  for (const buffer of buffers) {
    buf.set(buffer, i)
    i += buffer.length
  }
  return buf
}

function writeUInt32BE(buf: Uint8Array, value: number, offset?: number) {
  if (value < 0 || value >= MAX_INT32) {
    throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`)
  }
  buf.set([value >>> 24, value >>> 16, value >>> 8, value & 0xff], offset)
}

export function uint64be(value: number) {
  const high = Math.floor(value / MAX_INT32)
  const low = value % MAX_INT32
  const buf = new Uint8Array(8)
  writeUInt32BE(buf, high, 0)
  writeUInt32BE(buf, low, 4)
  return buf
}

export function uint32be(value: number) {
  const buf = new Uint8Array(4)
  writeUInt32BE(buf, value)
  return buf
}

/** Encodes ASCII-only strings as Uint8Array */
export function encode(string: string): Uint8Array {
  const bytes = new Uint8Array(string.length)
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i)
    if (code > 127) {
      throw new TypeError('non-ASCII string encountered in encode()')
    }
    bytes[i] = code
  }
  return bytes
}
