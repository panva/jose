import type * as types from '../types.d.ts'

export function assertCryptoKey(key: unknown): asserts key is types.CryptoKey {
  if (!isCryptoKey(key)) {
    throw new Error('CryptoKey instance expected')
  }
}

export const isCryptoKey = (key: unknown): key is types.CryptoKey => {
  // @ts-ignore
  if (key?.[Symbol.toStringTag] === 'CryptoKey') return true
  try {
    return key instanceof CryptoKey
  } catch {
    return false
  }
}

export const isKeyObject = <T extends types.KeyObject = types.KeyObject>(key: unknown): key is T =>
  // @ts-ignore
  key?.[Symbol.toStringTag] === 'KeyObject'

export const isKeyLike = (key: unknown): key is types.CryptoKey | types.KeyObject =>
  isCryptoKey(key) || isKeyObject(key)
