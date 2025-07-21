export function encodeBase64(input: Uint8Array): string {
  // @ts-ignore
  if (Uint8Array.prototype.toBase64) {
    // @ts-ignore
    return input.toBase64()
  }

  const CHUNK_SIZE = 0x8000
  const arr = []
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    // @ts-ignore
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)))
  }
  return btoa(arr.join(''))
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
