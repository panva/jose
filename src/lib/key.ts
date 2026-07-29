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
    let expected: string
    switch (usage) {
      case 'sign':
      case 'verify':
        expected = 'sig'
        break
      case 'encrypt':
      case 'decrypt':
        expected = 'enc'
        break
    }
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
    const expectedKeyOp = usage === 'encrypt' || usage === 'decrypt' ? entry.keyOps?.[usage] : usage

    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(
        `Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`,
      )
    }
  }

  return true
}

const symmetricTypeCheck = (entry: KeyDescriptor, key: unknown, usage: Usage): Tagged => {
  const { alg } = entry
  if (key instanceof Uint8Array) return { kind: BYTES, key }

  if (jwk.isJWK(key)) {
    if (jwk.isSecretJWK(key) && jwkMatchesOp(entry, key, usage)) return { kind: JWK, key }
    throw new TypeError(
      `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`,
    )
  }

  if (!isKeyLike(key)) {
    throw new TypeError(
      invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array'),
    )
  }

  if (key.type !== 'secret') {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`)
  }

  return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key }
}

const asymmetricTypeCheck = (entry: KeyDescriptor, key: unknown, usage: Usage): Tagged => {
  const { alg } = entry
  if (jwk.isJWK(key)) {
    switch (usage) {
      case 'decrypt':
      case 'sign':
        if (jwk.isPrivateJWK(key) && jwkMatchesOp(entry, key, usage)) return { kind: JWK, key }
        throw new TypeError(`JSON Web Key for this operation must be a private JWK`)
      case 'encrypt':
      case 'verify':
        if (jwk.isPublicJWK(key) && jwkMatchesOp(entry, key, usage)) return { kind: JWK, key }
        throw new TypeError(`JSON Web Key for this operation must be a public JWK`)
    }
  }

  if (!isKeyLike(key)) {
    throw new TypeError(invalidKeyInput(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'))
  }

  if (key.type === 'secret') {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithms must not be of type "secret"`,
    )
  }

  if (key.type === 'public') {
    switch (usage) {
      case 'sign':
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm signing must be of type "private"`,
        )
      case 'decrypt':
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`,
        )
    }
  }

  if (key.type === 'private') {
    switch (usage) {
      case 'verify':
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`,
        )
      case 'encrypt':
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`,
        )
    }
  }

  return isCryptoKey(key) ? { kind: CRYPTO, key } : { kind: KEYOBJECT, key }
}

type Usage = 'sign' | 'verify' | 'encrypt' | 'decrypt'

const BYTES: unique symbol = Symbol()
const CRYPTO: unique symbol = Symbol()
const KEYOBJECT: unique symbol = Symbol()
const JWK: unique symbol = Symbol()

/**
 * What the key turned out to be. Returning it means the conversion that follows does not have to
 * discriminate the input a second time.
 */
type Tagged =
  | { kind: typeof BYTES; key: Uint8Array }
  | { kind: typeof CRYPTO; key: types.CryptoKey }
  | { kind: typeof KEYOBJECT; key: types.KeyObject }
  | { kind: typeof JWK; key: types.JWK }

export function checkKeyType(entry: KeyDescriptor, key: unknown, usage: Usage): Tagged {
  return entry.symmetric
    ? symmetricTypeCheck(entry, key, usage)
    : asymmetricTypeCheck(entry, key, usage)
}

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

function cached(key: object, alg: string): CryptoKey | undefined {
  cache ||= new WeakMap()
  return cache.get(key)?.[alg]
}

function store(key: object, alg: string, cryptoKey: CryptoKey): CryptoKey {
  const entry = cache.get(key)
  if (entry) {
    entry[alg] = cryptoKey
  } else {
    cache.set(key, { [alg]: cryptoKey })
  }
  return cryptoKey
}

const handleJWK = async (
  key: types.KeyObject | types.JWK,
  jwk: types.JWK,
  entry: KeyDescriptor,
) => {
  const hit = cached(key, entry.alg)
  if (hit) return hit

  const cryptoKey = await jwkToKey(entry, { ...jwk, alg: entry.alg })
  return store(key, entry.alg, cryptoKey)
}

const handleKeyObject = (keyObject: ConvertibleKeyObject, entry: KeyDescriptor) => {
  const hit = cached(keyObject, entry.alg)
  if (hit) return hit

  const isPublic = keyObject.type === 'public'
  const usages = isPublic ? entry.usages.public : entry.usages.private

  const { asymmetricKeyType } = keyObject
  const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve!]
  const params = entry.subtleFor?.({ crv, asymmetricKeyType }) ?? entry.subtle

  return store(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages))
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

  switch (tagged.kind) {
    case BYTES:
    case CRYPTO:
      return tagged.key

    case JWK: {
      if (tagged.key.k) {
        return decode(tagged.key.k)
      }
      if (!Object.isFrozen(tagged.key)) {
        const { key_ops } = tagged.key
        if (Array.isArray(key_ops)) Object.freeze(key_ops)
        Object.freeze(tagged.key)
      }
      return handleJWK(tagged.key, tagged.key, entry)
    }

    case KEYOBJECT: {
      const keyObject = tagged.key as ConvertibleKeyObject

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
