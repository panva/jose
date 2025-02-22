import { encoder, decoder, Buffer } from '../lib/buffer_utils.ts'

export function encodeBase64(input: Uint8Array | string): string {
  if (Buffer) return Buffer.from(input).toString('base64')
  let unencoded = input
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded)
  }
  const CHUNK_SIZE = 0x8000
  const arr = []
  for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
    // @ts-expect-error
    arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)))
  }
  return btoa(arr.join(''))
}

export function encode(input: Uint8Array | string): string {
  if (Buffer) return Buffer.from(input).toString('base64url')
  return encodeBase64(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function decodeBase64(encoded: string): Uint8Array {
  if (Buffer) return Buffer.from(encoded, 'base64')
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function decode(input: Uint8Array | string): Uint8Array {
  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  if (Buffer) return Buffer.from(encoded, 'base64url')
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  try {
    return decodeBase64(encoded)
  } catch {
    throw new TypeError('The input to be decoded is not correctly encoded.')
  }
}
