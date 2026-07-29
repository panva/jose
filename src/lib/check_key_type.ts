import { withAlg as invalidKeyInput } from './invalid_key_input.js'
import { isKeyLike } from './is_key_like.js'
import * as jwk from './type_checks.js'
import type * as types from '../types.d.ts'
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

const symmetricTypeCheck = (entry: KeyDescriptor, key: unknown, usage: Usage) => {
  const { alg } = entry
  if (key instanceof Uint8Array) return

  if (jwk.isJWK(key)) {
    if (jwk.isSecretJWK(key) && jwkMatchesOp(entry, key, usage)) return
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

const asymmetricTypeCheck = (entry: KeyDescriptor, key: unknown, usage: Usage) => {
  const { alg } = entry
  if (jwk.isJWK(key)) {
    switch (usage) {
      case 'decrypt':
      case 'sign':
        if (jwk.isPrivateJWK(key) && jwkMatchesOp(entry, key, usage)) return
        throw new TypeError(`JSON Web Key for this operation must be a private JWK`)
      case 'encrypt':
      case 'verify':
        if (jwk.isPublicJWK(key) && jwkMatchesOp(entry, key, usage)) return
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
}

type Usage = 'sign' | 'verify' | 'encrypt' | 'decrypt'

export function checkKeyType(entry: KeyDescriptor, key: unknown, usage: Usage): void {
  if (entry.symmetric) {
    symmetricTypeCheck(entry, key, usage)
  } else {
    asymmetricTypeCheck(entry, key, usage)
  }
}
