import type * as types from '../types.d.ts'
import * as base64url from '../util/base64url.js'
import { JOSENotSupported, JWTInvalid } from '../util/errors.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })

const ELLIPSIS = '...'
const SD = '_sd'
const SD_ALG = '_sd_alg'
const DISCLOSURES = 'disclosures'
const KB_JWT = 'kb_jwt'

const base64urlPattern = /^[A-Za-z0-9_-]+$/

/** Hash algorithms supported for SD-JWT Disclosure digests. */
export type SdJwtHashAlgorithm = 'sha-256' | 'sha-384' | 'sha-512'

/** The serialization used for an SD-JWT. */
export type SdJwtSerialization = 'compact' | 'flattened' | 'general'

/** The result of separating an SD-JWT into its constituent parts. */
export interface ParsedSdJwt<T> {
  /** Issuer-signed JWS with the SD-JWT transport parameters removed. */
  jws: T
  /** Disclosures in transport order. */
  disclosures: string[]
  /** Key Binding JWT, when the input is an SD-JWT+KB. */
  kbJwt?: string
  /** Serialization used by the input. */
  serialization: SdJwtSerialization
}

/** Decoded contents of a Disclosure. */
export interface ParsedDisclosure {
  /** Per-claim salt. */
  salt: string
  /** Claim name. Present only for an object-property Disclosure. */
  key?: string
  /** Claim value. */
  value: unknown
}

/** Metadata about a single Disclosure in an SD-JWT. */
export interface DisclosureDetail {
  /** The base64url-encoded Disclosure string. */
  disclosure: string
  /** The base64url-encoded digest of the Disclosure. */
  digest: string
  /** The claim name (only present for object-property Disclosures). */
  key?: string
  /** The claim value before recursively processing nested Disclosures. */
  value: unknown
  /** Path in the processed payload where this Disclosure resolves. */
  path: (string | number)[]
  /** RFC 6901 representation of {@link path}. */
  pointer: string
  /** Digest of the directly enclosing recursive Disclosure, when present. */
  parentDigest?: string
}

/** Returns a supported SD-JWT hash algorithm, applying the RFC 9901 default. */
export function getSdAlg(value?: unknown): SdJwtHashAlgorithm {
  switch (value) {
    case undefined:
      return 'sha-256'
    case 'sha-256':
    case 'sha-384':
    case 'sha-512':
      return value
    default:
      throw new JOSENotSupported('unsupported _sd_alg')
  }
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

/** @internal */
export function isPublicAsymmetricJWK(value: unknown): value is types.JWK & { kty: string } {
  if (!isJsonObject(value) || typeof value.kty !== 'string') {
    return false
  }
  for (const member of ['d', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'k', 'priv']) {
    if (Object.hasOwn(value, member)) {
      return false
    }
  }

  const present = (...members: string[]) =>
    members.every((member) => typeof value[member] === 'string' && value[member].length !== 0)

  switch (value.kty) {
    case 'RSA':
      return present('n', 'e')
    case 'EC':
      return present('crv', 'x', 'y')
    case 'OKP':
      return present('crv', 'x')
    case 'AKP':
      return present('alg', 'pub')
    default:
      return false
  }
}

/** @internal */
export function hasMultipleConfirmationKeyRepresentations(
  confirmation: Record<string, unknown>,
): boolean {
  let count = 0
  for (const member of ['jwk', 'jwe', 'jku']) {
    if (Object.hasOwn(confirmation, member) && ++count > 1) {
      return true
    }
  }
  return false
}

function defineDataProperty(target: Record<string, unknown>, key: string, value: unknown) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  })
}

function clone<T>(value: T): T {
  try {
    return structuredClone(value)
  } catch (cause) {
    throw new JWTInvalid('Invalid SD-JWT', { cause })
  }
}

function canonicalBase64url(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || !base64urlPattern.test(value)) {
    throw new JWTInvalid(`${label} must be a non-empty base64url string`)
  }

  try {
    if (base64url.encode(base64url.decode(value)) !== value) {
      throw new TypeError()
    }
  } catch (cause) {
    throw new JWTInvalid(`${label} must be a canonical base64url string`, { cause })
  }
}

function decodeJson(encoded: string, label: string): unknown {
  canonicalBase64url(encoded, label)

  try {
    return JSON.parse(decoder.decode(base64url.decode(encoded)))
  } catch (cause) {
    throw new JWTInvalid(`${label} must encode valid UTF-8 JSON`, { cause })
  }
}

/** Decodes a verified JWS payload as an SD-JWT payload without validating JWT claims. */
export function decodeSdJwtPayload(payload: Uint8Array): Record<string, unknown> {
  if (!(payload instanceof Uint8Array)) {
    throw new TypeError('payload must be an instance of Uint8Array')
  }

  let value: unknown
  try {
    value = JSON.parse(decoder.decode(payload))
  } catch (cause) {
    throw new JWTInvalid('SD-JWT payload must be valid UTF-8 JSON', { cause })
  }

  if (!isJsonObject(value)) {
    throw new JWTInvalid('SD-JWT payload must be a top-level JSON object')
  }

  return value
}

function validateCompactJwt(jwt: unknown, label: string): asserts jwt is string {
  if (typeof jwt !== 'string') {
    throw new JWTInvalid(`${label} must be a string`)
  }

  const parts = jwt.split('.')
  if (parts.length !== 3) {
    throw new JWTInvalid(`${label} must use JWS Compact Serialization`)
  }

  const [encodedHeader, encodedPayload, signature] = parts
  const header = decodeJson(encodedHeader, `${label} protected header`)
  if (!isJsonObject(header)) {
    throw new JWTInvalid(`${label} protected header must be a JSON object`)
  }
  if (typeof header.alg !== 'string' || header.alg.length === 0 || header.alg === 'none') {
    throw new JWTInvalid(`${label} must use a signing algorithm`)
  }
  if (header.b64 === false) {
    throw new JWTInvalid('SD-JWTs MUST NOT use unencoded payloads')
  }

  const payload = decodeJson(encodedPayload, `${label} payload`)
  if (!isJsonObject(payload)) {
    throw new JWTInvalid(`${label} payload must be a JSON object`)
  }
  canonicalBase64url(signature, `${label} signature`)
}

/** Strictly decodes and validates the shape of a Disclosure. */
export function parseDisclosure(disclosure: string): ParsedDisclosure {
  const value = decodeJson(disclosure, 'Disclosure')
  if (!Array.isArray(value) || (value.length !== 2 && value.length !== 3)) {
    throw new JWTInvalid('Disclosure must be a JSON array of two or three elements')
  }
  if (typeof value[0] !== 'string') {
    throw new JWTInvalid('Disclosure salt must be a string')
  }

  if (value.length === 2) {
    return { salt: value[0], value: value[1] }
  }

  if (typeof value[1] !== 'string') {
    throw new JWTInvalid('Disclosure claim name must be a string')
  }
  if (value[1] === SD || value[1] === SD_ALG || value[1] === ELLIPSIS) {
    throw new JWTInvalid('Disclosure claim name is reserved')
  }

  return { salt: value[0], key: value[1], value: value[2] }
}

function validateDisclosures(disclosures: readonly string[]): string[] {
  if (!Array.isArray(disclosures)) {
    throw new TypeError('disclosures must be an array')
  }

  const result: string[] = []
  const seen = new Set<string>()
  for (const disclosure of disclosures) {
    parseDisclosure(disclosure)
    if (seen.has(disclosure)) {
      throw new JWTInvalid('A Disclosure must not be included more than once')
    }
    seen.add(disclosure)
    result.push(disclosure)
  }
  return result
}

async function digest(value: string, algorithm: SdJwtHashAlgorithm): Promise<string> {
  return base64url.encode(
    new Uint8Array(await crypto.subtle.digest(algorithm, encoder.encode(value))),
  )
}

/** Calculates the digest of a base64url-encoded Disclosure. */
export async function disclosureDigest(
  disclosure: string,
  algorithm: SdJwtHashAlgorithm = 'sha-256',
): Promise<string> {
  canonicalBase64url(disclosure, 'Disclosure')
  return digest(disclosure, getSdAlg(algorithm))
}

function validateDigest(value: unknown, algorithm: SdJwtHashAlgorithm): asserts value is string {
  canonicalBase64url(value, 'SD-JWT digest')
  const expectedLength = algorithm === 'sha-256' ? 32 : algorithm === 'sha-384' ? 48 : 64
  if (base64url.decode(value).byteLength !== expectedLength) {
    throw new JWTInvalid(`SD-JWT digest has an invalid length for ${algorithm}`)
  }
}

function protectedHeader(encoded: unknown, label: string): Record<string, unknown> | undefined {
  if (encoded === undefined) return undefined
  if (typeof encoded !== 'string') {
    throw new JWTInvalid(`${label} protected header must be a string`)
  }

  const value = decodeJson(encoded, `${label} protected header`)
  if (!isJsonObject(value)) {
    throw new JWTInvalid(`${label} protected header must be a JSON object`)
  }
  return value
}

function unprotectedHeader(value: unknown, label: string): Record<string, unknown> | undefined {
  if (value === undefined) return undefined
  if (!isJsonObject(value)) {
    throw new JWTInvalid(`${label} unprotected header must be a JSON object`)
  }
  return value
}

interface JsonSignatureInspection {
  protectedHeader?: Record<string, unknown>
  unprotectedHeader?: Record<string, unknown>
}

function inspectJsonSignature(
  signature: unknown,
  payload: unknown,
  label: string,
): JsonSignatureInspection {
  if (!isJsonObject(signature)) {
    throw new JWTInvalid(`${label} must be a JSON object`)
  }
  canonicalBase64url(payload, 'SD-JWT payload')
  const payloadValue = decodeJson(payload, 'SD-JWT payload')
  if (!isJsonObject(payloadValue)) {
    throw new JWTInvalid('SD-JWT payload must be a JSON object')
  }
  canonicalBase64url(signature.signature, `${label} signature`)

  const protectedValue = protectedHeader(signature.protected, label)
  const unprotectedValue = unprotectedHeader(signature.header, label)

  if (protectedValue && unprotectedValue) {
    for (const parameter of Object.keys(protectedValue)) {
      if (Object.hasOwn(unprotectedValue, parameter)) {
        throw new JWTInvalid(
          'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
        )
      }
    }
  }

  if (
    protectedValue &&
    (Object.hasOwn(protectedValue, DISCLOSURES) || Object.hasOwn(protectedValue, KB_JWT))
  ) {
    throw new JWTInvalid('SD-JWT transport parameters must be unprotected')
  }

  const joseHeader = { ...protectedValue, ...unprotectedValue }
  if (
    typeof joseHeader.alg !== 'string' ||
    joseHeader.alg.length === 0 ||
    joseHeader.alg === 'none'
  ) {
    throw new JWTInvalid('SD-JWT must use a signing algorithm')
  }
  if (joseHeader.b64 === false) {
    throw new JWTInvalid('SD-JWTs MUST NOT use unencoded payloads')
  }

  return { protectedHeader: protectedValue, unprotectedHeader: unprotectedValue }
}

function readTransportHeader(header: Record<string, unknown> | undefined): {
  disclosures: string[]
  kbJwt?: string
} {
  let disclosures: string[] = []
  let kbJwt: string | undefined

  if (header && Object.hasOwn(header, DISCLOSURES)) {
    if (!Array.isArray(header[DISCLOSURES])) {
      throw new JWTInvalid('SD-JWT disclosures header parameter must be an array')
    }
    disclosures = validateDisclosures(header[DISCLOSURES] as string[])
  }

  if (header && Object.hasOwn(header, KB_JWT)) {
    const value = header[KB_JWT]
    if (typeof value !== 'string' || value.length === 0) {
      throw new JWTInvalid('SD-JWT kb_jwt header parameter must be a non-empty string')
    }
    validateCompactJwt(value, 'KB-JWT')
    kbJwt = value
  }

  return { disclosures, kbJwt }
}

function removeTransportHeader(header: types.JWSHeaderParameters | undefined) {
  if (!header) return
  delete header[DISCLOSURES]
  delete header[KB_JWT]
}

function parseFlattenedSdJwt(token: types.FlattenedJWS): ParsedSdJwt<types.FlattenedJWS> {
  if (!isJsonObject(token) || Object.hasOwn(token, 'signatures')) {
    throw new JWTInvalid('Invalid Flattened SD-JWT')
  }

  const inspected = inspectJsonSignature(token, token.payload, 'Flattened JWS signature')
  const { disclosures, kbJwt } = readTransportHeader(inspected.unprotectedHeader)
  const jws = clone(token)
  removeTransportHeader(jws.header)
  if (jws.header && Object.keys(jws.header).length === 0) {
    delete jws.header
  }

  return { jws, disclosures, kbJwt, serialization: 'flattened' }
}

function parseGeneralSdJwt(token: types.GeneralJWS): ParsedSdJwt<types.GeneralJWS> {
  if (!isJsonObject(token) || !Array.isArray(token.signatures) || token.signatures.length === 0) {
    throw new JWTInvalid('Invalid General SD-JWT')
  }

  let transport: ReturnType<typeof readTransportHeader> | undefined
  for (let index = 0; index < token.signatures.length; index++) {
    const inspected = inspectJsonSignature(
      token.signatures[index],
      token.payload,
      `General JWS signature at index ${index}`,
    )
    if (index === 0) {
      transport = readTransportHeader(inspected.unprotectedHeader)
    } else if (
      inspected.unprotectedHeader &&
      (Object.hasOwn(inspected.unprotectedHeader, DISCLOSURES) ||
        Object.hasOwn(inspected.unprotectedHeader, KB_JWT))
    ) {
      throw new JWTInvalid('SD-JWT transport parameters must only be in the first signature')
    }
  }

  const jws = clone(token)
  removeTransportHeader(jws.signatures[0].header)
  if (jws.signatures[0].header && Object.keys(jws.signatures[0].header!).length === 0) {
    delete jws.signatures[0].header
  }

  return {
    jws,
    disclosures: transport!.disclosures,
    kbJwt: transport!.kbJwt,
    serialization: 'general',
  }
}

/** Separates a Compact SD-JWT or SD-JWT+KB into its constituent parts. */
export function parseSdJwt(token: string): ParsedSdJwt<string>
/** Separates a Flattened JWS JSON serialized SD-JWT or SD-JWT+KB. */
export function parseSdJwt(token: types.FlattenedJWS): ParsedSdJwt<types.FlattenedJWS>
/** Separates a General JWS JSON serialized SD-JWT or SD-JWT+KB. */
export function parseSdJwt(token: types.GeneralJWS): ParsedSdJwt<types.GeneralJWS>
export function parseSdJwt(
  token: string | types.FlattenedJWS | types.GeneralJWS,
): ParsedSdJwt<string | types.FlattenedJWS | types.GeneralJWS> {
  if (typeof token === 'string') {
    const parts = token.split('~')
    if (parts.length < 2) {
      throw new JWTInvalid('Invalid SD-JWT Compact Serialization')
    }

    const jws = parts.shift()!
    validateCompactJwt(jws, 'Issuer-signed JWT')

    const final = parts.pop()!
    let kbJwt: string | undefined
    if (final.length !== 0) {
      validateCompactJwt(final, 'KB-JWT')
      kbJwt = final
    }

    const disclosures = validateDisclosures(parts)
    return { jws, disclosures, kbJwt, serialization: 'compact' }
  }

  if (!isJsonObject(token)) {
    throw new JWTInvalid('Invalid SD-JWT')
  }
  if (Object.hasOwn(token, 'signatures')) {
    return parseGeneralSdJwt(token as types.GeneralJWS)
  }
  return parseFlattenedSdJwt(token as types.FlattenedJWS)
}

function ensureNoTransportHeaders(token: types.FlattenedJWS | types.GeneralJWS) {
  if (Object.hasOwn(token, 'signatures')) {
    const general = token as types.GeneralJWS
    if (!Array.isArray(general.signatures) || general.signatures.length === 0) {
      throw new JWTInvalid('Invalid General SD-JWT')
    }
    for (const signature of general.signatures) {
      if (
        isJsonObject(signature.header) &&
        (Object.hasOwn(signature.header, DISCLOSURES) || Object.hasOwn(signature.header, KB_JWT))
      ) {
        throw new JWTInvalid('SD-JWT transport parameters are managed by the SD-JWT producer')
      }
    }
  } else if (
    isJsonObject((token as types.FlattenedJWS).header) &&
    (Object.hasOwn((token as types.FlattenedJWS).header!, DISCLOSURES) ||
      Object.hasOwn((token as types.FlattenedJWS).header!, KB_JWT))
  ) {
    throw new JWTInvalid('SD-JWT transport parameters are managed by the SD-JWT producer')
  }
}

/** Formats an SD-JWT or SD-JWT+KB using the serialization of the supplied JWS. */
export function formatSdJwt(token: string, disclosures: readonly string[], kbJwt?: string): string
/** Formats a Flattened JWS JSON serialized SD-JWT or SD-JWT+KB. */
export function formatSdJwt(
  token: types.FlattenedJWS,
  disclosures: readonly string[],
  kbJwt?: string,
): types.FlattenedJWS
/** Formats a General JWS JSON serialized SD-JWT or SD-JWT+KB. */
export function formatSdJwt(
  token: types.GeneralJWS,
  disclosures: readonly string[],
  kbJwt?: string,
): types.GeneralJWS
export function formatSdJwt(
  token: string | types.FlattenedJWS | types.GeneralJWS,
  disclosures: readonly string[],
  kbJwt?: string,
): string | types.FlattenedJWS | types.GeneralJWS {
  const normalizedDisclosures = validateDisclosures(disclosures)
  if (kbJwt !== undefined) {
    if (kbJwt.length === 0) {
      throw new JWTInvalid('KB-JWT must be a non-empty string')
    }
    validateCompactJwt(kbJwt, 'KB-JWT')
  }

  if (typeof token === 'string') {
    validateCompactJwt(token, 'Issuer-signed JWT')
    return [token, ...normalizedDisclosures, kbJwt ?? ''].join('~')
  }

  ensureNoTransportHeaders(token)
  const parsed = Object.hasOwn(token, 'signatures')
    ? parseGeneralSdJwt(token as types.GeneralJWS)
    : parseFlattenedSdJwt(token as types.FlattenedJWS)
  const result = parsed.jws
  const signature = Object.hasOwn(result, 'signatures')
    ? (result as types.GeneralJWS).signatures[0]
    : (result as types.FlattenedJWS)
  signature.header ||= {}
  signature.header[DISCLOSURES] = normalizedDisclosures
  if (kbJwt !== undefined) {
    signature.header[KB_JWT] = kbJwt
  }
  return result
}

/**
 * Reconstructs the exact no-Key-Binding Compact SD-JWT representation used as the `sd_hash`
 * preimage. For JWS JSON Serialization, the first signature is used as required by RFC 9901.
 */
export function compactSdJwt(
  jws: string | types.FlattenedJWS | types.GeneralJWS,
  disclosures: readonly string[],
): string {
  const normalizedDisclosures = validateDisclosures(disclosures)
  if (typeof jws === 'string') {
    validateCompactJwt(jws, 'Issuer-signed JWT')
    return [jws, ...normalizedDisclosures, ''].join('~')
  }

  ensureNoTransportHeaders(jws)
  const parsed = Object.hasOwn(jws, 'signatures')
    ? parseGeneralSdJwt(jws as types.GeneralJWS)
    : parseFlattenedSdJwt(jws as types.FlattenedJWS)
  const normalized = parsed.jws
  const signature = Object.hasOwn(normalized, 'signatures')
    ? (normalized as types.GeneralJWS).signatures[0]
    : (normalized as types.FlattenedJWS)
  const compactJws = `${signature.protected ?? ''}.${normalized.payload}.${signature.signature}`
  return [compactJws, ...normalizedDisclosures, ''].join('~')
}

/** Calculates an RFC 9901 `sd_hash` value. */
export async function calculateSdHash(
  jws: string | types.FlattenedJWS | types.GeneralJWS,
  disclosures: readonly string[],
  algorithm: SdJwtHashAlgorithm = 'sha-256',
): Promise<string> {
  return digest(compactSdJwt(jws, disclosures), getSdAlg(algorithm))
}

interface DisclosureInfo extends ParsedDisclosure {
  disclosure: string
  digest: string
  used: boolean
  path: (string | number)[]
  parentDigest?: string
}

function jsonPointer(path: readonly (string | number)[]): string {
  return path.map((part) => `/${String(part).replace(/~/g, '~0').replace(/\//g, '~1')}`).join('')
}

/** Processes RFC 9901 Disclosures against an issuer-signed payload. */
export async function processDisclosures(
  payload: Record<string, unknown>,
  disclosures: readonly string[],
  sdAlgValue?: unknown,
): Promise<{ payload: Record<string, unknown>; disclosureDetails: DisclosureDetail[] }> {
  if (!isJsonObject(payload)) {
    throw new JWTInvalid('SD-JWT payload must be a top-level JSON object')
  }

  const hasPayloadAlgorithm = Object.hasOwn(payload, SD_ALG)
  if (hasPayloadAlgorithm && typeof payload[SD_ALG] !== 'string') {
    throw new JWTInvalid('The _sd_alg claim must be a string')
  }
  const payloadAlgorithm = hasPayloadAlgorithm ? getSdAlg(payload[SD_ALG]) : undefined
  if (
    hasPayloadAlgorithm &&
    sdAlgValue !== undefined &&
    payloadAlgorithm !== getSdAlg(sdAlgValue)
  ) {
    throw new JWTInvalid('Conflicting _sd_alg values')
  }
  const algorithm = payloadAlgorithm ?? getSdAlg(sdAlgValue)

  const normalizedDisclosures = validateDisclosures(disclosures)
  const disclosureInfos = new Map<string, DisclosureInfo>()
  const disclosureInfosByValue = new Map<string, DisclosureInfo>()
  for (const disclosure of normalizedDisclosures) {
    const parsed = parseDisclosure(disclosure)
    const disclosureHash = await digest(disclosure, algorithm)
    if (disclosureInfos.has(disclosureHash)) {
      throw new JWTInvalid('Multiple Disclosures have the same digest')
    }
    const info: DisclosureInfo = {
      ...parsed,
      disclosure,
      digest: disclosureHash,
      path: [],
      used: false,
    }
    disclosureInfos.set(disclosureHash, info)
    disclosureInfosByValue.set(disclosure, info)
  }

  const encounteredDigests = new Set<string>()

  function encounterDigest(value: unknown): DisclosureInfo | undefined {
    validateDigest(value, algorithm)
    if (encounteredDigests.has(value)) {
      throw new JWTInvalid('The same digest value appears more than once in the SD-JWT')
    }
    encounteredDigests.add(value)
    return disclosureInfos.get(value)
  }

  async function processNode(
    value: unknown,
    path: (string | number)[],
    parentDigest: string | undefined,
    topLevel = false,
  ): Promise<unknown> {
    if (Array.isArray(value)) {
      const result: unknown[] = []
      for (const element of value) {
        if (isJsonObject(element) && Object.hasOwn(element, ELLIPSIS)) {
          if (Object.keys(element).length !== 1 || typeof element[ELLIPSIS] !== 'string') {
            throw new JWTInvalid('Invalid SD-JWT array digest placeholder')
          }
          const info = encounterDigest(element[ELLIPSIS])
          if (!info) continue
          if (info.key !== undefined) {
            throw new JWTInvalid('Object-property Disclosure found in an array position')
          }
          const disclosurePath = path.concat(result.length)
          info.used = true
          info.path = disclosurePath
          info.parentDigest = parentDigest
          result.push(await processNode(info.value, disclosurePath, info.digest))
        } else {
          const elementPath = path.concat(result.length)
          result.push(await processNode(element, elementPath, parentDigest))
        }
      }
      return result
    }

    if (isJsonObject(value)) {
      if (Object.hasOwn(value, ELLIPSIS)) {
        throw new JWTInvalid('The "..." claim is only valid as an array digest placeholder')
      }
      if (!topLevel && Object.hasOwn(value, SD_ALG)) {
        throw new JWTInvalid('The _sd_alg claim must only appear at the top level')
      }

      let embeddedDigests: unknown[] = []
      if (Object.hasOwn(value, SD)) {
        if (!Array.isArray(value[SD])) {
          throw new JWTInvalid('The _sd claim must be an array of digest strings')
        }
        embeddedDigests = value[SD]
      }

      const result: Record<string, unknown> = {}
      for (const key of Object.keys(value)) {
        if (key === SD || (topLevel && key === SD_ALG)) continue
        defineDataProperty(
          result,
          key,
          await processNode(value[key], path.concat(key), parentDigest),
        )
      }

      for (const embeddedDigest of embeddedDigests) {
        const info = encounterDigest(embeddedDigest)
        if (!info) continue
        if (info.key === undefined) {
          throw new JWTInvalid('Array-element Disclosure found in an object _sd claim')
        }
        if (Object.hasOwn(result, info.key)) {
          throw new JWTInvalid(`Claim name "${info.key}" already exists at this level`)
        }
        const disclosurePath = path.concat(info.key)
        info.used = true
        info.path = disclosurePath
        info.parentDigest = parentDigest
        defineDataProperty(
          result,
          info.key,
          await processNode(info.value, disclosurePath, info.digest),
        )
      }

      return result
    }

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))
    ) {
      return value
    }

    throw new JWTInvalid('SD-JWT payload contains a value that is not valid JSON')
  }

  const processedPayload = (await processNode(payload, [], undefined, true)) as Record<
    string,
    unknown
  >

  for (const info of disclosureInfos.values()) {
    if (!info.used) {
      throw new JWTInvalid('Unreferenced Disclosure')
    }
  }

  const disclosureDetails = normalizedDisclosures.map((disclosure) => {
    const info = disclosureInfosByValue.get(disclosure)!
    const detail: DisclosureDetail = {
      disclosure: info.disclosure,
      digest: info.digest,
      key: info.key,
      value: info.value,
      path: info.path.slice(),
      pointer: jsonPointer(info.path),
    }
    if (info.parentDigest !== undefined) {
      detail.parentDigest = info.parentDigest
    }
    return detail
  })

  return { payload: processedPayload, disclosureDetails }
}

/** Selects Disclosures and automatically includes their recursive parent Disclosures. */
export function selectDisclosures(
  allDetails: readonly DisclosureDetail[],
  filter: (info: DisclosureDetail) => boolean,
): string[] {
  if (typeof filter !== 'function') {
    throw new TypeError('filter must be a function')
  }

  const byDigest = new Map<string, DisclosureDetail>()
  for (const detail of allDetails) {
    if (byDigest.has(detail.digest)) {
      throw new JWTInvalid('Duplicate Disclosure detail digest')
    }
    byDigest.set(detail.digest, detail)
  }

  const selected = new Set<string>()
  for (const detail of allDetails) {
    if (filter(detail)) selected.add(detail.digest)
  }

  for (const selectedDigest of [...selected]) {
    let detail = byDigest.get(selectedDigest)
    const ancestors = new Set<string>()
    while (detail?.parentDigest !== undefined) {
      if (ancestors.has(detail.parentDigest)) {
        throw new JWTInvalid('Cyclic Disclosure dependency')
      }
      ancestors.add(detail.parentDigest)
      const parent = byDigest.get(detail.parentDigest)
      if (!parent) {
        throw new JWTInvalid('Missing recursive parent Disclosure')
      }
      selected.add(parent.digest)
      detail = parent
    }
  }

  return allDetails
    .filter((detail) => selected.has(detail.digest))
    .map((detail) => detail.disclosure)
}
