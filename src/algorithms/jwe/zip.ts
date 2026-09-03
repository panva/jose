/** Tree-shakeable JWE compression algorithm capability factories. @module */

import { createAlgorithmFactory as create } from '../../lib/algorithm_capability.js'
import { concat } from '../../lib/buffer_utils.js'
import { JOSENotSupported, JWEInvalid } from '../../util/errors.js'
import type { JWECompressionCapability } from '../../lib/jwe_algorithm.js'

import type { JWECompressionFactory } from '../types.js'

function factory(
  algorithm: 'DEF',
  compress: JWECompressionCapability['compress'],
  decompress: JWECompressionCapability['decompress'],
): JWECompressionFactory<'DEF'> {
  return create(
    { category: 'jwe-compression', algorithm, compress, decompress },
    3,
  ) as JWECompressionFactory<'DEF'>
}

function supported(name: 'CompressionStream' | 'DecompressionStream'): void {
  if (typeof globalThis[name] === 'undefined') {
    throw new JOSENotSupported(
      `JWE "zip" (Compression Algorithm) Header Parameter requires the ${name} API.`,
    )
  }
}

async function compressDeflate(input: Uint8Array): Promise<Uint8Array> {
  supported('CompressionStream')

  const stream = new CompressionStream('deflate-raw')
  const writer = stream.writable.getWriter()
  writer.write(input as Uint8Array<ArrayBuffer>).catch(() => {})
  writer.close().catch(() => {})

  const chunks: Uint8Array[] = []
  const reader = stream.readable.getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  return concat(...chunks)
}

async function decompressDeflate(input: Uint8Array, maxLength: number): Promise<Uint8Array> {
  supported('DecompressionStream')

  const stream = new DecompressionStream('deflate-raw')
  const writer = stream.writable.getWriter()
  writer.write(input as Uint8Array<ArrayBuffer>).catch(() => {})
  writer.close().catch(() => {})

  const chunks: Uint8Array[] = []
  let length = 0
  const reader = stream.readable.getReader()
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

/** The `DEF` JWE compression algorithm capability factory. */
export const DEF: JWECompressionFactory<'DEF'> = /* @__PURE__ */ factory(
  'DEF',
  compressDeflate,
  decompressDeflate,
)

export type { JWECompressionAlgorithmName, JWECompressionAlgorithmOf } from '../types.js'

/** Represents a factory for one built-in JWE compression algorithm capability. */
export type { JWECompressionFactory } from '../types.js'
