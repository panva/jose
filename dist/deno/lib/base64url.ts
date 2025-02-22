import { encoder, decoder } from '../lib/buffer_utils.ts'

export function encodeBase64(input: Uint8Array): string {
  // @ts-ignore
  if (Uint8Array.prototype.toBase64) {
    // @ts-ignore
    return input.toBase64()
  }

  const CHUNK_SIZE = 0x8000
  const arr = []
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    // @ts-expect-error
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)))
  }
  return btoa(arr.join(''))
}

export function encode(input: Uint8Array | string): string {
  let unencoded = input
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded)
  }

  // @ts-ignore
  if (Uint8Array.prototype.toBase64) {
    // @ts-ignore
    return unencoded.toBase64({ alphabet: 'base64url', omitPadding: true })
  }

  return encodeBase64(unencoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function decodeBase64(encoded: string): Uint8Array {
  // @ts-ignore
  if (Uint8Array.fromBase64) {
    // @ts-ignore
    return Uint8Array.fromBase64(encoded)
  }

  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function decode(input: Uint8Array | string): Uint8Array {
  // @ts-ignore
  if (Uint8Array.fromBase64) {
    // @ts-ignore
    return Uint8Array.fromBase64(typeof input === 'string' ? input : decoder.decode(input), {
      alphabet: 'base64url',
    })
  }

  let encoded = input
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded)
  }
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
  try {
    return decodeBase64(encoded)
  } catch {
    throw new TypeError('The input to be decoded is not correctly encoded.')
  }
}
