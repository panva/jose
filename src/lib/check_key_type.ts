import { withAlg as invalidKeyInput } from './invalid_key_input.js'
import isKeyLike from './is_key_like.js'
import * as jwk from './is_jwk.js'
import type * as types from '../types.d.ts'

// @ts-expect-error
const tag = (key: unknown): string => key?.[Symbol.toStringTag]

const jwkMatchesOp = (alg: string, key: types.JWK, usage: Usage) => {
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
        `Invalid key for this operation, when present its use must be ${expected}`,
      )
    }
  }

  if (key.alg !== undefined && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`)
  }

  // TODO: validate key_ops

  return true
}

const symmetricTypeCheck = (alg: string, key: unknown, usage: Usage) => {
  if (key instanceof Uint8Array) return

  if (jwk.isJWK(key)) {
    if (jwk.isSecretJWK(key) && jwkMatchesOp(alg, key, usage)) return
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
}

const asymmetricTypeCheck = (alg: string, key: unknown, usage: Usage) => {
  if (jwk.isJWK(key)) {
    switch (usage) {
      case 'decrypt':
      case 'sign':
        if (jwk.isPrivateJWK(key) && jwkMatchesOp(alg, key, usage)) return
        throw new TypeError(`JSON Web Key for this operation be a private JWK`)
      case 'encrypt':
      case 'verify':
        if (jwk.isPublicJWK(key) && jwkMatchesOp(alg, key, usage)) return
        throw new TypeError(`JSON Web Key for this operation be a public JWK`)
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

  if (usage === 'sign' && key.type === 'public') {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithm signing must be of type "private"`,
    )
  }

  if (usage === 'decrypt' && key.type === 'public') {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`,
    )
  }

  if (usage === 'verify' && key.type === 'private') {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`,
    )
  }

  if (usage === 'encrypt' && key.type === 'private') {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`,
    )
  }
}

type Usage = 'sign' | 'verify' | 'encrypt' | 'decrypt'

export default (alg: string, key: unknown, usage: Usage): void => {
  const symmetric =
    alg.startsWith('HS') ||
    alg === 'dir' ||
    alg.startsWith('PBES2') ||
    /^A(?:128|192|256)(?:GCM)?(?:KW)?$/.test(alg) ||
    /^A(?:128|192|256)CBC-HS(?:256|384|512)$/.test(alg)

  if (symmetric) {
    symmetricTypeCheck(alg, key, usage)
  } else {
    asymmetricTypeCheck(alg, key, usage)
  }
}
