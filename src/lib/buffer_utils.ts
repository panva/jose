export const encoder: TextEncoder = new TextEncoder()
export const decoder: TextDecoder = new TextDecoder()
/**
 * Decodes JOSE Headers and JWT Claims Sets. RFC 7519 Section 7.2 step 10 requires verifying that
 * the octets are a UTF-8 encoding, which the lenient decoder never does because it substitutes
 * U+FFFD for ill-formed sequences. A leading BOM is still ignored, as RFC 8259 Section 8.1
 * permits.
 */
export const strictDecoder: TextDecoder = new TextDecoder('utf-8', { fatal: true })

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

export function uint64be(value: number): Uint8Array {
  const high = Math.floor(value / MAX_INT32)
  const low = value % MAX_INT32
  const buf = new Uint8Array(8)
  writeUInt32BE(buf, high, 0)
  writeUInt32BE(buf, low, 4)
  return buf
}

export function uint32be(value: number): Uint8Array {
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

export function encodeBase64(input: Uint8Array, url = false): string {
  // @ts-ignore
  if (Uint8Array.prototype.toBase64) {
    // @ts-ignore
    return input.toBase64({ alphabet: url ? 'base64url' : 'base64', omitPadding: url })
  }

  const CHUNK_SIZE = 0x8000
  const arr = []
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    // @ts-ignore
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)))
  }
  const encoded = btoa(arr.join(''))
  return url ? encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') : encoded
}

export function decodeBase64(encoded: string, url = false): Uint8Array {
  // @ts-ignore
  if (Uint8Array.fromBase64) {
    // @ts-ignore
    return Uint8Array.fromBase64(encoded, { alphabet: url ? 'base64url' : 'base64' })
  }

  if (url) {
    if (encoded.includes('+') || encoded.includes('/')) throw new TypeError('Invalid base64url')
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  }
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function digest(
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data as Uint8Array<ArrayBuffer>))
}
