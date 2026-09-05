import type * as types from '../types.d.ts'
import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js'
import { decode } from '../util/base64url.js'
import { encode, strictDecoder } from './buffer_utils.js'

export function assertUint8Array(input: unknown, label: string): asserts input is Uint8Array {
  if (!(input instanceof Uint8Array)) {
    throw new TypeError(`${label} must be an instance of Uint8Array`)
  }
}

export function isObject<T = object>(input: unknown): input is T {
  if (
    typeof input !== 'object' ||
    input === null ||
    Object.prototype.toString.call(input) !== '[object Object]'
  ) {
    return false
  }
  const prototype = Object.getPrototypeOf(input)
  return prototype === null || Object.getPrototypeOf(prototype) === null
}

export function isJwkSet(input: unknown): input is types.JSONWebKeySet {
  return (
    isObject<types.JSONWebKeySet>(input) &&
    Array.isArray(input.keys) &&
    Array.from(input.keys).every(isObject)
  )
}

export function isDisjoint(...headers: Array<object | undefined>): boolean {
  const parameters = new Set<string>()
  for (const header of headers) {
    if (!header) continue
    for (const parameter of Object.keys(header)) {
      if (parameters.has(parameter)) {
        return false
      }
      parameters.add(parameter)
    }
  }

  return true
}

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

interface CritCheckHeader {
  b64?: boolean
  crit?: string[]
  [propName: string]: unknown
}

/** Extension Header Parameters a JWS implementation recognizes without being asked to. */
export const JWS_RECOGNIZED = { __proto__: null, b64: true } as unknown as Record<string, boolean>

/** JWE defines no Extension Header Parameters that are recognized by default. */
export const JWE_RECOGNIZED = { __proto__: null } as unknown as Record<string, boolean>

export function validateAlgorithms(option: string, algorithms?: string[]): Set<string> | undefined {
  if (
    algorithms !== undefined &&
    (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== 'string'))
  ) {
    throw new TypeError(`"${option}" option must be an array of strings`)
  }

  return algorithms === undefined ? undefined : new Set(algorithms)
}

/**
 * RFC 7515 Section 4.1.11 forbids producers from listing duplicate names in "crit". A recipient
 * only MAY consider such a header invalid, so this is enforced when producing and not when
 * consuming.
 */
export function validateCritDuplicates(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  protectedHeader: CritCheckHeader | undefined,
): void {
  const { crit } = protectedHeader ?? {}
  if (Array.isArray(crit) && new Set(crit).size !== crit.length) {
    throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values')
  }
}

export function validateCrit(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  recognizedDefault: Record<string, boolean>,
  recognizedOption: { [propName: string]: boolean } | undefined,
  protectedHeader: CritCheckHeader | undefined,
  joseHeader: CritCheckHeader,
): string[] {
  if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected')
  }

  if (!protectedHeader || protectedHeader.crit === undefined) {
    return []
  }

  if (
    !Array.isArray(protectedHeader.crit) ||
    protectedHeader.crit.length === 0 ||
    protectedHeader.crit.some((input: string) => typeof input !== 'string' || input.length === 0)
  ) {
    throw new Err(
      '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
    )
  }

  const recognized: Record<string, boolean> =
    recognizedOption === undefined
      ? recognizedDefault
      : ({ __proto__: null, ...recognizedOption, ...recognizedDefault } as unknown as Record<
          string,
          boolean
        >)

  for (const parameter of protectedHeader.crit) {
    if (!(parameter in recognized)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`)
    }

    if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`)
    }
    if (
      recognized[parameter] &&
      (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === undefined)
    ) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return protectedHeader.crit
}

export function validateB64(
  protectedHeader: CritCheckHeader | undefined,
  extensions: string[],
): boolean {
  if (extensions.includes('b64')) {
    const b64 = protectedHeader!.b64
    if (typeof b64 !== 'boolean') {
      throw new JWSInvalid(
        'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
      )
    }
    return b64
  }

  return true
}

export function serializeJoseHeader<T extends CritCheckHeader>(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  header: T,
): [header: T, serialized: string] {
  let serialized: string
  let parsed: unknown
  try {
    serialized = JSON.stringify(header)!
    parsed = JSON.parse(serialized)
  } catch (cause) {
    throw new Err('JOSE Header is not valid JSON', { cause })
  }

  if (!isObject<T>(parsed)) {
    throw new Err('JOSE Header is not a JSON object')
  }

  return [parsed, serialized]
}
