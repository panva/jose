import { withAlg as invalidKeyInput } from './invalid_key_input.ts'
import { isKeyLike } from './is_key_like.ts'
import * as jwk from './is_jwk.ts'
import type * as types from '../types.d.ts'

// @ts-ignore
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
        `Invalid key for this operation, its "use" must be "${expected}" when present`,
      )
    }
  }

  if (key.alg !== undefined && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`)
  }

  if (Array.isArray(key.key_ops)) {
    let expectedKeyOp

    switch (true) {
      case usage === 'sign' || usage === 'verify': // Fall through
      case alg === 'dir': // Fall through
      case alg.includes('CBC-HS'):
        expectedKeyOp = usage
        break
      case alg.startsWith('PBES2'):
        expectedKeyOp = 'deriveBits'
        break
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
        if (!alg.includes('GCM') && alg.endsWith('KW')) {
          expectedKeyOp = usage === 'encrypt' ? 'wrapKey' : 'unwrapKey'
        } else {
          expectedKeyOp = usage
        }
        break
      case usage === 'encrypt' && alg.startsWith('RSA'):
        expectedKeyOp = 'wrapKey'
        break
      case usage === 'decrypt':
        expectedKeyOp = alg.startsWith('RSA') ? 'unwrapKey' : 'deriveBits'
        break
    }

    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(
        `Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`,
      )
    }
  }

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
        throw new TypeError(`JSON Web Key for this operation must be a private JWK`)
      case 'encrypt':
      case 'verify':
        if (jwk.isPublicJWK(key) && jwkMatchesOp(alg, key, usage)) return
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

export function checkKeyType(alg: string, key: unknown, usage: Usage): void {
  switch (alg.substring(0, 2)) {
    case 'A1': // A128.+, A192.+
    case 'A2': // A256.+
    case 'di': // dir
    case 'HS': // HS\d{3}
    case 'PB': // PBES2.+
      symmetricTypeCheck(alg, key, usage)
      break
    default:
      asymmetricTypeCheck(alg, key, usage)
  }
}
