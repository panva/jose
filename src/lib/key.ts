import { isObject } from './validate.js'
import { decode } from '../util/base64url.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'

const tag = (key: object): string | undefined =>
  (key as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]

const jwkMatchesOp = (entry: KeyDescriptor, key: types.JWK, usage: Usage) => {
  const { alg } = entry
  if (key.use !== undefined) {
    const expected = usage === 'sign' || usage === 'verify' ? 'sig' : 'enc'
    if (key.use !== expected) {
      throw new TypeError(
        `Invalid key for this operation, its "use" must be "${expected}" when present`,
      )
    }
  }

  if (key.alg !== undefined && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`)
  }

  if (Array.isArray(key.key_ops)) {
    const expectedKeyOp =
      usage === 'encrypt' || usage === 'decrypt' ? entry.ops?.[usage === 'encrypt' ? 0 : 1] : usage

    if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) {
      throw new TypeError(
        `Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`,
      )
    }
  }
}

/** Validates and converts a key in one pass into the form consumed by the crypto primitives. */
export async function prepareKey(
  entry: KeyDescriptor,
  key: unknown,
  usage: Usage,
): Promise<types.CryptoKey | Uint8Array> {
  const { alg, secret } = entry
  const privateKey = usage === 'decrypt' || usage === 'sign'
  if (secret && key instanceof Uint8Array) return key

  let normalized: types.JWK | undefined
  let keyObject: ConvertibleKeyObject | undefined
  if (isObject<types.JWK>(key)) {
    normalized = normalizeJwk(key)
    if (typeof normalized.kty !== 'string') {
      throw invalidKeyType(alg, key, secret)
    }
    const valid = secret
      ? normalized.kty === 'oct' && typeof normalized.k === 'string'
      : normalized.kty !== 'oct' &&
        (privateKey
          ? (normalized.kty === 'AKP' && typeof normalized.priv === 'string') ||
            typeof normalized.d === 'string'
          : normalized.d === undefined && normalized.priv === undefined)
    if (!valid) {
      throw new TypeError(
        secret
          ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`
          : `JSON Web Key for this operation must be a ${privateKey ? 'private' : 'public'} JWK`,
      )
    }
    jwkMatchesOp(entry, normalized, usage)
    if (normalized.kty === 'oct') {
      return decode(normalized.k!)
    }
    if (!Object.isFrozen(key)) {
      const { key_ops } = key
      if (Array.isArray(key_ops)) Object.freeze(key_ops)
      Object.freeze(key)
    }
  } else {
    if (!isKeyLike(key)) {
      throw invalidKeyType(alg, key, secret)
    }

    const expectedType = secret ? 'secret' : privateKey ? 'private' : 'public'
    if (
      key.type !== expectedType &&
      (secret || ['secret', 'public', 'private'].includes(key.type))
    ) {
      throw new TypeError(
        `${tag(key)} instances must be of type "${expectedType}" for the ${alg} algorithm`,
      )
    }

    if (isCryptoKey(key)) return key

    keyObject = key as ConvertibleKeyObject
    if (keyObject.type === 'secret') {
      return keyObject.export()
    }
  }

  cache ||= new WeakMap()
  const cacheKey = key as object
  let cached = cache.get(cacheKey)
  if (cached?.[alg]) return cached[alg]
  if (!cached) cache.set(cacheKey, (cached = {}))

  if (keyObject && typeof keyObject.toCryptoKey === 'function') {
    const isPublic = keyObject.type === 'public'
    const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve!]
    const params =
      entry.resolve?.({ crv, asymmetricKeyType: keyObject.asymmetricKeyType }) ?? entry.subtle
    return (cached[alg] = keyObject.toCryptoKey(params, isPublic, entry.usages[isPublic ? 0 : 1]))
  }

  normalized ??= keyObject!.export({ format: 'jwk' })
  normalized.alg = alg
  return (cached[alg] = await jwkToKey(entry, normalized))
}

type Usage = 'sign' | 'verify' | 'encrypt' | 'decrypt'

let cache: WeakMap<object, Record<string, CryptoKey>>

interface ConvertibleKeyObject extends types.KeyObject {
  export(): Uint8Array
  export(opts: { format: 'jwk' }): types.JWK
  asymmetricKeyType?: string
  asymmetricKeyDetails?: { namedCurve?: string }
  toCryptoKey(
    alg: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams,
    extractable: boolean,
    usages: string[],
  ): types.CryptoKey
}

/** Node names the NIST curves after the OpenSSL identifiers rather than the JOSE ones. */
const nist: Record<string, string> = {
  // @ts-expect-error
  __proto__: null,
  prime256v1: 'P-256',
  secp384r1: 'P-384',
  secp521r1: 'P-521',
}

export function assertCryptoKey(key: unknown): asserts key is types.CryptoKey {
  if (!isCryptoKey(key)) {
    throw new Error('CryptoKey instance expected')
  }
}

export const isCryptoKey = (key: unknown): key is types.CryptoKey => {
  // @ts-expect-error
  if (key?.[Symbol.toStringTag] === 'CryptoKey') return true
  try {
    return key instanceof CryptoKey
  } catch {
    return false
  }
}

export const isKeyObject = <T extends types.KeyObject = types.KeyObject>(key: unknown): key is T =>
  // @ts-expect-error
  key?.[Symbol.toStringTag] === 'KeyObject'

export const isKeyLike = (key: unknown): key is types.CryptoKey | types.KeyObject =>
  isCryptoKey(key) || isKeyObject(key)

function message(msg: string, actual: unknown, ...types: string[]) {
  if (types.length > 2) {
    const last = types.pop()
    msg += `one of type ${types.join(', ')}, or ${last}.`
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`
  } else {
    msg += `of type ${types[0]}.`
  }

  if (actual == null) {
    msg += ` Received ${actual}`
  } else if (typeof actual === 'function' && actual.name) {
    msg += ` Received function ${actual.name}`
  } else if (typeof actual === 'object' && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`
    }
  }

  return msg
}

export const invalidKeyInput = (actual: unknown, ...types: string[]): string =>
  message('Key must be ', actual, ...types)

function invalidKeyType(alg: string, actual: unknown, secret?: boolean): TypeError {
  const types = ['CryptoKey', 'KeyObject', 'JSON Web Key']
  if (secret) types.push('Uint8Array')
  return new TypeError(message(`Key for the ${alg} algorithm must be `, actual, ...types))
}

const unusable = (name: string | number, prop = 'algorithm.name') =>
  new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`)

type ExpectedAlgorithm = KeyDescriptor['subtle']

export function checkUsage(key: types.CryptoKey, usage?: KeyUsage): void {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

export function checkModulusLength(alg: string, key: types.CryptoKey): void {
  const { modulusLength } = key.algorithm as RsaKeyAlgorithm
  if (typeof modulusLength !== 'number' || modulusLength < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
  }
}

/**
 * Asserts a caller-supplied CryptoKey matches what an algorithm entry describes. Generic - it names
 * no algorithm itself, so it belongs to neither family.
 */
export function checkCryptoKey(
  key: types.CryptoKey,
  expected: ExpectedAlgorithm,
  usage?: KeyUsage,
): void {
  const algorithm = key.algorithm as RsaHashedKeyAlgorithm & EcKeyAlgorithm & AesKeyAlgorithm

  if (algorithm.name !== expected.name) {
    throw unusable(expected.name)
  }

  if (expected.hash && algorithm.hash?.name !== expected.hash) {
    throw unusable(expected.hash, 'algorithm.hash')
  }

  if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) {
    throw unusable(expected.namedCurve, 'algorithm.namedCurve')
  }

  if (expected.length !== undefined && algorithm.length !== expected.length) {
    throw unusable(expected.length, 'algorithm.length')
  }

  checkUsage(key, usage)
}

/** Snapshots a JWK into data properties. */
export function snapshotJwk(jwk: types.JWK): types.JWK {
  return { __proto__: null, ...jwk } as unknown as types.JWK
}

/** Snapshots a JWK and validates the metadata Web Crypto consumes. */
export function normalizeJwk(jwk: types.JWK): types.JWK {
  const normalized = snapshotJwk(jwk)

  if (normalized.ext !== undefined && typeof normalized.ext !== 'boolean') {
    throw new TypeError('"ext" (Extractable) Parameter must be a boolean')
  }

  if (normalized.key_ops !== undefined) {
    const value = normalized.key_ops
    const keyOps = Array.isArray(value) ? [...value] : undefined
    if (
      !keyOps ||
      keyOps.some((operation) => typeof operation !== 'string') ||
      new Set(keyOps).size !== keyOps.length
    ) {
      throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings')
    }
    normalized.key_ops = keyOps
  }

  return normalized
}

export function validateExtractableOption(extractable: unknown): boolean | undefined {
  if (extractable !== undefined && typeof extractable !== 'boolean') {
    throw new TypeError('"extractable" option must be a boolean')
  }

  return extractable
}

export async function jwkToKey(
  entry: KeyDescriptor,
  jwk: types.JWK,
  extractable?: boolean,
): Promise<types.CryptoKey> {
  if (!entry.kty.includes(jwk.kty!)) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }

  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle
  const isPrivate = !!(jwk.d || jwk.priv)

  const keyData: types.JWK = { ...jwk, ext: extractable ?? jwk.ext }
  if (keyData.kty !== 'AKP') {
    delete keyData.alg
  }
  delete keyData.use

  return crypto.subtle.importKey(
    'jwk',
    keyData,
    algorithm,
    keyData.ext ?? !isPrivate,
    (jwk.key_ops as KeyUsage[]) ?? entry.usages[isPrivate ? 1 : 0],
  )
}

/** Imports raw key bytes or validates a supplied CryptoKey against the operation's parameters. */
export async function rawKey(
  key: types.CryptoKey | Uint8Array,
  expected: ExpectedAlgorithm,
  usage: KeyUsage,
  extractable = false,
): Promise<types.CryptoKey> {
  if (key instanceof Uint8Array) {
    key = await crypto.subtle.importKey(
      'raw',
      key as Uint8Array<ArrayBuffer>,
      expected,
      extractable,
      [usage],
    )
  }
  checkCryptoKey(key, expected, usage)
  return key
}
