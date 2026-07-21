import type * as types from '../types.d.ts'
import { encoder, decoder } from './buffer_utils.js'
import * as base64url from '../util/base64url.js'
import { hasMultipleConfirmationKeyRepresentations, isPublicAsymmetricJWK } from './sd.js'

const ELLIPSIS = '...'
const SD = '_sd'
const SD_ALG = '_sd_alg'
const SALT_BYTES = 16

interface DecoyConfiguration {
  pointer: string
  tokens: string[]
  min: number
  max: number
}

interface DisclosureOperation {
  kind: 'disclosure'
  pointer: string
  tokens: string[]
}

interface DecoyOperation extends DecoyConfiguration {
  kind: 'decoy'
}

type Operation = DisclosureOperation | DecoyOperation

export interface SDJWTIssuerConfiguration {
  disclosurePaths: readonly string[]
  decoys: readonly DecoyConfiguration[]
  hashAlgorithm: types.SDJWTHashAlgorithm
}

export interface IssuedSDJWTPayload {
  payload: Uint8Array
  disclosures: string[]
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

/** Ensures constructor input is data JSON.stringify can represent without silently changing it. */
export function validateSDJWTPayload(value: unknown): asserts value is types.JWTPayload {
  const ancestors = new Set<object>()

  const visit = (current: unknown, path: string): void => {
    if (current === null || typeof current === 'string' || typeof current === 'boolean') {
      return
    }
    if (typeof current === 'number') {
      if (!Number.isFinite(current)) {
        throw new TypeError(`JWT Claims Set member at ${path} must be a finite number`)
      }
      return
    }
    if (typeof current !== 'object') {
      throw new TypeError(`JWT Claims Set member at ${path} is not a JSON value`)
    }
    if (!Array.isArray(current) && !isJsonObject(current)) {
      throw new TypeError(`JWT Claims Set member at ${path} is not a JSON object`)
    }
    if (ancestors.has(current)) {
      throw new TypeError('JWT Claims Set must not contain circular references')
    }
    if (Object.getOwnPropertySymbols(current).length !== 0) {
      throw new TypeError(`JWT Claims Set member at ${path} contains a symbol property`)
    }

    ancestors.add(current)
    if (Array.isArray(current)) {
      for (const key of Object.getOwnPropertyNames(current)) {
        if (key === 'length') continue
        if (!/^(?:0|[1-9][0-9]*)$/.test(key) || Number(key) >= current.length) {
          throw new TypeError(`JWT Claims Set member at ${path} contains an array property`)
        }
        const descriptor = Object.getOwnPropertyDescriptor(current, key)!
        if (!descriptor.enumerable || !('value' in descriptor)) {
          throw new TypeError(
            `JWT Claims Set member at ${path}/${key} is not an enumerable data property`,
          )
        }
      }
      for (let index = 0; index < current.length; index++) {
        if (!Object.hasOwn(current, index)) {
          throw new TypeError(`JWT Claims Set member at ${path} must not be a sparse array`)
        }
        const descriptor = Object.getOwnPropertyDescriptor(current, index)!
        visit(descriptor.value, `${path}/${index}`)
      }
    } else {
      for (const key of Object.getOwnPropertyNames(current)) {
        const descriptor = Object.getOwnPropertyDescriptor(current, key)!
        if (!descriptor.enumerable || !('value' in descriptor)) {
          throw new TypeError(
            `JWT Claims Set member at ${path}/${escapePointerToken(key)} is not an enumerable data property`,
          )
        }
        visit(descriptor.value, `${path}/${escapePointerToken(key)}`)
      }
    }
    ancestors.delete(current)
  }

  if (!isJsonObject(value)) {
    throw new TypeError('JWT Claims Set MUST be an object')
  }
  visit(value, '')
}

function escapePointerToken(token: string): string {
  return token.replace(/~/g, '~0').replace(/\//g, '~1')
}

export function parseJSONPointer(pointer: string, allowRoot: boolean): string[] {
  if (typeof pointer !== 'string') {
    throw new TypeError('JSON Pointer must be a string')
  }
  if (pointer === '') {
    if (allowRoot) {
      return []
    }
    throw new TypeError('the root JWT Claims Set cannot be selectively disclosed')
  }
  if (pointer[0] !== '/') {
    throw new TypeError(`invalid JSON Pointer: ${pointer}`)
  }

  return pointer
    .slice(1)
    .split('/')
    .map((token) => {
      if (/~(?:[^01]|$)/.test(token)) {
        throw new TypeError(`invalid JSON Pointer escape in: ${pointer}`)
      }
      return token.replace(/~1/g, '/').replace(/~0/g, '~')
    })
}

export function validateDisclosurePaths(paths: unknown): string[] {
  if (!Array.isArray(paths)) {
    throw new TypeError('disclosure paths must be an array')
  }
  const seen = new Set<string>()
  const copy = paths.slice()
  for (const pointer of copy) {
    parseJSONPointer(pointer, false)
    if (seen.has(pointer)) {
      throw new TypeError(`duplicate disclosure path: ${pointer}`)
    }
    seen.add(pointer)

    if (
      pointer === '/iss' ||
      pointer === '/exp' ||
      pointer === '/nbf' ||
      pointer === '/aud' ||
      pointer === '/cnf' ||
      pointer.startsWith('/cnf/')
    ) {
      throw new TypeError(`validity-critical claim cannot be selectively disclosed: ${pointer}`)
    }
  }
  return copy
}

function validatePositiveSafeInteger(value: unknown, label: string): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new TypeError(`${label} must be a positive safe integer`)
  }
}

export function normalizeDecoyCount(count: types.SDJWTDecoyCount): { min: number; max: number } {
  if (typeof count === 'number') {
    validatePositiveSafeInteger(count, 'decoy count')
    return { min: count, max: count }
  }
  if (!isJsonObject(count)) {
    throw new TypeError('decoy count must be a positive safe integer or a range')
  }
  validatePositiveSafeInteger(count.min, 'decoy minimum')
  validatePositiveSafeInteger(count.max, 'decoy maximum')
  if (count.max < count.min) {
    throw new TypeError('decoy maximum must be greater than or equal to the minimum')
  }
  return { min: count.min, max: count.max }
}

export function createDecoyConfiguration(
  pointer: string,
  count: types.SDJWTDecoyCount,
): DecoyConfiguration {
  const tokens = parseJSONPointer(pointer, true)
  const { min, max } = normalizeDecoyCount(count)
  return { pointer, tokens, min, max }
}

export function normalizeHashAlgorithm(value: unknown): types.SDJWTHashAlgorithm {
  switch (value) {
    case 'sha-256':
    case 'sha-384':
    case 'sha-512':
      return value
    default:
      throw new TypeError('unsupported SD-JWT hash algorithm')
  }
}

function hasReservedClaims(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasReservedClaims)
  }
  if (!isJsonObject(value)) {
    return false
  }
  if (Object.hasOwn(value, SD) || Object.hasOwn(value, SD_ALG) || Object.hasOwn(value, ELLIPSIS)) {
    return true
  }
  return Object.values(value).some(hasReservedClaims)
}

function assertPublicConfirmationJWK(payload: Record<string, unknown>): void {
  if (!Object.hasOwn(payload, 'cnf')) {
    return
  }
  const cnf = payload.cnf
  if (!isJsonObject(cnf)) {
    throw new TypeError('"cnf" claim must be a JSON object')
  }
  if (hasMultipleConfirmationKeyRepresentations(cnf)) {
    throw new TypeError('"cnf" claim must represent only one proof-of-possession key')
  }
  if (!Object.hasOwn(cnf, 'jwk')) {
    return
  }
  if (!isPublicAsymmetricJWK(cnf.jwk)) {
    throw new TypeError('"cnf.jwk" must be a public asymmetric JWK')
  }
}

function arrayIndex(token: string, pointer: string, length: number): number {
  if (!/^(?:0|[1-9][0-9]*)$/.test(token)) {
    throw new TypeError(`JSON Pointer does not identify an array element: ${pointer}`)
  }
  const index = Number(token)
  if (!Number.isSafeInteger(index) || index >= length) {
    throw new TypeError(`JSON Pointer does not exist: ${pointer}`)
  }
  return index
}

function resolvePointer(root: Record<string, unknown>, operation: Operation): unknown {
  let current: unknown = root
  for (const token of operation.tokens) {
    if (Array.isArray(current)) {
      const index = arrayIndex(token, operation.pointer, current.length)
      if (!Object.hasOwn(current, index)) {
        throw new TypeError(`JSON Pointer does not exist: ${operation.pointer}`)
      }
      current = current[index]
    } else if (isJsonObject(current) && Object.hasOwn(current, token)) {
      current = current[token]
    } else {
      throw new TypeError(`JSON Pointer does not exist: ${operation.pointer}`)
    }
  }
  return current
}

function resolveParent(
  root: Record<string, unknown>,
  operation: DisclosureOperation,
): { parent: Record<string, unknown> | unknown[]; member: string | number; value: unknown } {
  const parentOperation: Operation = {
    kind: 'disclosure',
    pointer: operation.pointer,
    tokens: operation.tokens.slice(0, -1),
  }
  const parent = resolvePointer(root, parentOperation)
  const token = operation.tokens[operation.tokens.length - 1]

  if (Array.isArray(parent)) {
    const member = arrayIndex(token, operation.pointer, parent.length)
    if (!Object.hasOwn(parent, member)) {
      throw new TypeError(`JSON Pointer does not exist: ${operation.pointer}`)
    }
    return { parent, member, value: parent[member] }
  }
  if (isJsonObject(parent) && Object.hasOwn(parent, token)) {
    return { parent, member: token, value: parent[token] }
  }
  throw new TypeError(`JSON Pointer does not exist: ${operation.pointer}`)
}

function defineEnumerable(target: object, key: PropertyKey, value: unknown): void {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  })
}

function randomIndex(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new TypeError('random range must be a positive safe integer')
  }

  // A uniformly distributed 53-bit integer, with rejection sampling to avoid modulo bias.
  const range = 2 ** 53
  const limit = range - (range % maxExclusive)
  let value: number
  do {
    const bytes = crypto.getRandomValues(new Uint8Array(7))
    bytes[0] &= 0x1f
    value = 0
    for (const byte of bytes) {
      value = value * 256 + byte
    }
  } while (value >= limit)
  return value % maxExclusive
}

async function hash(value: string, algorithm: types.SDJWTHashAlgorithm): Promise<string> {
  return base64url.encode(
    new Uint8Array(await crypto.subtle.digest(algorithm, encoder.encode(value))),
  )
}

async function uniqueDisclosure(
  value: unknown,
  claimName: string | undefined,
  algorithm: types.SDJWTHashAlgorithm,
  salts: Set<string>,
  digests: Set<string>,
): Promise<{ disclosure: string; digest: string }> {
  for (;;) {
    let salt: string
    do {
      salt = base64url.encode(crypto.getRandomValues(new Uint8Array(SALT_BYTES)))
    } while (salts.has(salt))

    const disclosure = base64url.encode(
      encoder.encode(
        JSON.stringify(claimName === undefined ? [salt, value] : [salt, claimName, value]),
      ),
    )
    const digest = await hash(disclosure, algorithm)
    if (!digests.has(digest)) {
      salts.add(salt)
      digests.add(digest)
      return { disclosure, digest }
    }
  }
}

async function uniqueDecoy(
  algorithm: types.SDJWTHashAlgorithm,
  digests: Set<string>,
): Promise<string> {
  for (;;) {
    const random = base64url.encode(crypto.getRandomValues(new Uint8Array(SALT_BYTES)))
    const digest = await hash(random, algorithm)
    if (!digests.has(digest)) {
      digests.add(digest)
      return digest
    }
  }
}

function objectDigests(target: Record<string, unknown>): string[] {
  if (!Object.hasOwn(target, SD)) {
    const digests: string[] = []
    defineEnumerable(target, SD, digests)
    return digests
  }
  if (!Array.isArray(target[SD])) {
    throw new TypeError('invalid generated SD-JWT digest container')
  }
  return target[SD] as string[]
}

async function applyDisclosure(
  root: Record<string, unknown>,
  operation: DisclosureOperation,
  algorithm: types.SDJWTHashAlgorithm,
  salts: Set<string>,
  digests: Set<string>,
  disclosures: string[],
): Promise<void> {
  const { parent, member, value } = resolveParent(root, operation)
  sortObjectDigests(value)
  const claimName = Array.isArray(parent) ? undefined : (member as string)
  const result = await uniqueDisclosure(value, claimName, algorithm, salts, digests)
  disclosures.push(result.disclosure)

  if (Array.isArray(parent)) {
    defineEnumerable(parent, member, { [ELLIPSIS]: result.digest })
  } else {
    delete parent[member]
    objectDigests(parent).push(result.digest)
  }
}

async function applyDecoys(
  root: Record<string, unknown>,
  operation: DecoyOperation,
  algorithm: types.SDJWTHashAlgorithm,
  digests: Set<string>,
): Promise<void> {
  const target = resolvePointer(root, operation)
  if (!Array.isArray(target) && !isJsonObject(target)) {
    throw new TypeError(
      `decoy JSON Pointer does not identify an object or array: ${operation.pointer}`,
    )
  }
  const count = operation.min + randomIndex(operation.max - operation.min + 1)
  for (let index = 0; index < count; index++) {
    const digest = await uniqueDecoy(algorithm, digests)
    if (Array.isArray(target)) {
      target.splice(randomIndex(target.length + 1), 0, { [ELLIPSIS]: digest })
    } else {
      objectDigests(target).push(digest)
    }
  }
}

function sortObjectDigests(value: unknown): void {
  if (Array.isArray(value)) {
    for (const element of value) {
      sortObjectDigests(element)
    }
    return
  }
  if (!isJsonObject(value)) {
    return
  }
  if (Array.isArray(value[SD])) {
    value[SD].sort()
  }
  for (const child of Object.values(value)) {
    sortObjectDigests(child)
  }
}

export async function issueSDJWTPayload(
  encodedPayload: Uint8Array,
  configuration: SDJWTIssuerConfiguration,
): Promise<IssuedSDJWTPayload> {
  const payload = JSON.parse(decoder.decode(encodedPayload)) as Record<string, unknown>
  if (!isJsonObject(payload)) {
    throw new TypeError('JWT Claims Set MUST be an object')
  }
  if (hasReservedClaims(payload)) {
    throw new TypeError('JWT Claims Set contains an SD-JWT reserved claim name')
  }
  assertPublicConfirmationJWK(payload)

  const operations: Operation[] = configuration.disclosurePaths.map((pointer) => ({
    kind: 'disclosure',
    pointer,
    tokens: parseJSONPointer(pointer, false),
  }))
  operations.push(...configuration.decoys.map((decoy) => ({ kind: 'decoy' as const, ...decoy })))
  operations.sort((left, right) => {
    const depth = right.tokens.length - left.tokens.length
    if (depth !== 0) {
      return depth
    }
    if (left.kind === right.kind) {
      return 0
    }
    return left.kind === 'decoy' ? -1 : 1
  })

  const salts = new Set<string>()
  const digests = new Set<string>()
  const disclosures: string[] = []
  for (const operation of operations) {
    if (operation.kind === 'disclosure') {
      await applyDisclosure(
        payload,
        operation,
        configuration.hashAlgorithm,
        salts,
        digests,
        disclosures,
      )
    } else {
      await applyDecoys(payload, operation, configuration.hashAlgorithm, digests)
    }
  }

  sortObjectDigests(payload)
  if (configuration.hashAlgorithm !== 'sha-256') {
    defineEnumerable(payload, SD_ALG, configuration.hashAlgorithm)
  }

  return { payload: encoder.encode(JSON.stringify(payload)), disclosures }
}
