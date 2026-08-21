import type * as types from '../types.d.ts'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { concat } from './buffer_utils.js'

export function validateZip(
  joseHeader: types.JWEHeaderParameters,
  protectedHeader: types.JWEHeaderParameters | undefined,
): void {
  if (joseHeader.zip !== undefined && joseHeader.zip !== 'DEF') {
    throw new JOSENotSupported(
      'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
    )
  }

  if (joseHeader.zip !== undefined && !protectedHeader?.zip) {
    throw new JWEInvalid(
      'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    )
  }
}

function supported(name: 'CompressionStream' | 'DecompressionStream') {
  if (typeof globalThis[name] === 'undefined') {
    throw new JOSENotSupported(
      `JWE "zip" (Compression Algorithm) Header Parameter requires the ${name} API.`,
    )
  }
}

export async function compress(input: Uint8Array): Promise<Uint8Array> {
  supported('CompressionStream')

  const cs = new CompressionStream('deflate-raw')
  const writer = cs.writable.getWriter()
  writer.write(input as Uint8Array<ArrayBuffer>).catch(() => {})
  writer.close().catch(() => {})

  const chunks: Uint8Array[] = []
  const reader = cs.readable.getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  return concat(...chunks)
}

export async function decompress(input: Uint8Array, maxLength: number): Promise<Uint8Array> {
  supported('DecompressionStream')

  const ds = new DecompressionStream('deflate-raw')
  const writer = ds.writable.getWriter()
  writer.write(input as Uint8Array<ArrayBuffer>).catch(() => {})
  writer.close().catch(() => {})

  const chunks: Uint8Array[] = []
  let length = 0
  const reader = ds.readable.getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
    length += value.byteLength
    if (maxLength !== Infinity && length > maxLength) {
      throw new JWEInvalid('Decompressed plaintext exceeded the configured limit')
    }
  }

  return concat(...chunks)
}
