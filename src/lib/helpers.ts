import { decode } from '../util/base64url.js'
import { encode, strictDecoder } from './buffer_utils.js'
import { isObject } from './type_checks.js'

export const unprotected: unique symbol = Symbol()

export function assertNotSet(value: unknown, name: string): void {
  if (value !== undefined) {
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

/**
 * Encodes the ASCII octets of a token member that is used as-is when recomputing a signing input or
 * AEAD additional data, rather than being base64url decoded first.
 */
export function encodeBase64url(
  value: string,
  label: string,
  ErrorClass: new (message: string) => Error,
): Uint8Array {
  try {
    return encode(value)
  } catch {
    throw new ErrorClass(`The ${label} is not a valid base64url string`)
  }
}

export async function digest(
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data as Uint8Array<ArrayBuffer>))
}

/** Base64url decode, UTF-8 decode, JSON parse, and require a JSON object - in one place. */
export function parseJoseHeader<T>(
  b64: string,
  ErrorClass: new (message: string) => Error,
  message: string,
): T {
  let parsed: unknown
  try {
    parsed = JSON.parse(strictDecoder.decode(decode(b64)))
  } catch {
    throw new ErrorClass(message)
  }
  if (!isObject(parsed)) {
    throw new ErrorClass(message)
  }
  return parsed as T
}
