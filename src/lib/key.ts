import { withAlg as invalidKeyInput } from './invalid_key_input.js'
import { isKeyLike, isCryptoKey } from './is_key_like.js'
import * as jwk from './type_checks.js'
import type * as types from '../types.d.ts'
import { decode } from '../util/base64url.js'
import { jwkToKey } from './jwk_to_key.js'
import type { KeyDescriptor } from './key_descriptor.js'

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

export function checkKeyType(entry: KeyDescriptor, key: unknown, usage: Usage): Tagged {
  const { alg, secret } = entry
  const privateKey = usage === 'decrypt' || usage === 'sign'
  if (secret && key instanceof Uint8Array) return [BYTES, key]

  if (jwk.isJWK(key)) {
    if (
      secret ? !jwk.isSecretJWK(key) : !(privateKey ? jwk.isPrivateJWK(key) : jwk.isPublicJWK(key))
    ) {
      throw new TypeError(
        secret
          ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`
          : `JSON Web Key for this operation must be a ${privateKey ? 'private' : 'public'} JWK`,
      )
    }
    jwkMatchesOp(entry, key, usage)
    return [JWK, key]
  }

  if (!isKeyLike(key)) {
    throw new TypeError(
      secret
        ? invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array')
        : invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'),
    )
  }

  if (secret) {
    if (key.type !== 'secret') {
      throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`)
    }
  } else {
    if (key.type === 'secret') {
      throw new TypeError(
        `${tag(key)} instances for asymmetric algorithms must not be of type "secret"`,
      )
    }

    const expectedType = privateKey ? 'private' : 'public'
    if ((key.type === 'public' || key.type === 'private') && key.type !== expectedType) {
      const operation =
        usage === 'sign'
          ? 'signing'
          : usage === 'verify'
            ? 'verifying'
            : `${usage.slice(0, -1)}tion`
      throw new TypeError(
        `${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`,
      )
    }
  }

  return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key]
}

type Usage = 'sign' | 'verify' | 'encrypt' | 'decrypt'

const BYTES = 0
const CRYPTO = 1
const KEYOBJECT = 2
const JWK = 3

/**
 * What the key turned out to be. Returning it means the conversion that follows does not have to
 * discriminate the input a second time.
 */
type Tagged =
  | [kind: typeof BYTES, key: Uint8Array]
  | [kind: typeof CRYPTO, key: types.CryptoKey]
  | [kind: typeof KEYOBJECT, key: types.KeyObject]
  | [kind: typeof JWK, key: types.JWK]

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

function cached(key: object, alg: string): CryptoKey | undefined
function cached(key: object, alg: string, value: CryptoKey): CryptoKey
function cached(key: object, alg: string, value?: CryptoKey): CryptoKey | undefined {
  cache ||= new WeakMap()
  const entry = cache.get(key)
  if (value) {
    if (entry) {
      entry[alg] = value
    } else {
      cache.set(key, { __proto__: null, [alg]: value } as unknown as Record<string, CryptoKey>)
    }
  }
  return value ?? entry?.[alg]
}

const handleJWK = async (key: types.KeyObject | types.JWK, jwk: types.JWK, entry: KeyDescriptor) =>
  cached(key, entry.alg) ??
  cached(key, entry.alg, await jwkToKey(entry, { ...jwk, alg: entry.alg }))

const handleKeyObject = (keyObject: ConvertibleKeyObject, entry: KeyDescriptor) => {
  const hit = cached(keyObject, entry.alg)
  if (hit) return hit

  const isPublic = keyObject.type === 'public'
  const usages = entry.usages[isPublic ? 0 : 1]

  const { asymmetricKeyType } = keyObject
  const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve!]
  const params = entry.resolve?.({ crv, asymmetricKeyType }) ?? entry.subtle

  return cached(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages))
}

/**
 * Asserts everything there is to assert about `key` for this algorithm and operation, and returns
 * what the crypto primitives consume. The key is discriminated once: checkKeyType reports what it
 * found, and the conversion below acts on that rather than testing the input all over again.
 */
export async function prepareKey(
  entry: KeyDescriptor,
  key: unknown,
  usage: 'sign' | 'verify' | 'encrypt' | 'decrypt',
): Promise<types.CryptoKey | Uint8Array> {
  const tagged: Tagged = checkKeyType(entry, key, usage)

  switch (tagged[0]) {
    case BYTES:
    case CRYPTO:
      return tagged[1]

    case JWK: {
      const key = tagged[1]
      if (key.k) {
        return decode(key.k)
      }
      if (!Object.isFrozen(key)) {
        const { key_ops } = key
        if (Array.isArray(key_ops)) Object.freeze(key_ops)
        Object.freeze(key)
      }
      return handleJWK(key, key, entry)
    }

    case KEYOBJECT: {
      const keyObject = tagged[1] as ConvertibleKeyObject

      if (keyObject.type === 'secret') {
        return keyObject.export()
      }

      if ('toCryptoKey' in keyObject && typeof keyObject.toCryptoKey === 'function') {
        return handleKeyObject(keyObject, entry)
      }

      return handleJWK(keyObject, keyObject.export({ format: 'jwk' }), entry)
    }
  }
}
