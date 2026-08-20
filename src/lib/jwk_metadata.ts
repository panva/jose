import type * as types from '../types.d.ts'

export function validateJwkMetadata(jwk: types.JWK): void {
  if (jwk.ext !== undefined && typeof jwk.ext !== 'boolean') {
    throw new TypeError('"ext" (Extractable) Parameter must be a boolean')
  }

  if (jwk.key_ops !== undefined) {
    if (!Array.isArray(jwk.key_ops)) {
      throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings')
    }

    const operations = new Set<string>()
    for (const operation of jwk.key_ops) {
      if (typeof operation !== 'string' || operations.has(operation)) {
        throw new TypeError(
          '"key_ops" (Key Operations) Parameter must be an array of unique strings',
        )
      }
      operations.add(operation)
    }
  }
}
