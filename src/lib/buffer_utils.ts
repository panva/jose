import digest from '../runtime/digest.js'
import { encoder as encoderRuntime, decoder as decoderRuntime } from '../runtime/encoding.js'
export const encoder = encoderRuntime
export const decoder = decoderRuntime

const MAX_INT32 = 2 ** 32

export function concat(...buffers: Uint8Array[]): Uint8Array {
  const size = buffers.reduce((acc, { length }) => acc + length, 0)
  const buf = new Uint8Array(size)
  let i = 0
  buffers.forEach((buffer) => {
    buf.set(buffer, i)
    i += buffer.length
  })
  return buf
}

export function p2s(alg: string, p2sInput: Uint8Array) {
  return concat(encoder.encode(alg), new Uint8Array([0]), p2sInput)
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

export function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input)
}

export async function concatKdf(secret: Uint8Array, bits: number, value: Uint8Array) {
  const iterations = Math.ceil((bits >> 3) / 32)
  const res = new Uint8Array(iterations * 32)
  for (let iter = 0; iter < iterations; iter++) {
    const buf = new Uint8Array(4 + secret.length + value.length)
    buf.set(uint32be(iter + 1))
    buf.set(secret, 4)
    buf.set(value, 4 + secret.length)
    res.set(await digest('sha256', buf), iter * 32)
  }
  return res.slice(0, bits >> 3)
}
