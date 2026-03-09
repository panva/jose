import { decode } from '../util/base64url.ts'

export const unprotected = Symbol()

export function assertNotSet(value: unknown, name: string): void {
  if (value) {
    throw new TypeError(`${name} can only be called once`)
  }
}

export function decodeBase64url(
  value: string,
  label: string,
  ErrorClass: new (message: string) => Error,
): Uint8Array {
  try {
    return decode(value)
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`)
  }
}

export async function digest(
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data as Uint8Array<ArrayBuffer>))
}
