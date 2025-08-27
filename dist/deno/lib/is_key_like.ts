import type * as types from '../types.d.ts'

export function assertCryptoKey(key: unknown): asserts key is types.CryptoKey {
  if (!isCryptoKey(key)) {
    throw new Error('CryptoKey instance expected')
  }
}

export function isCryptoKey(key: unknown): key is types.CryptoKey {
  // @ts-ignore
  return key?.[Symbol.toStringTag] === 'CryptoKey'
}

export function isKeyObject<T extends types.KeyObject = types.KeyObject>(key: unknown): key is T {
  // @ts-ignore
  return key?.[Symbol.toStringTag] === 'KeyObject'
}

export default (key: unknown): key is types.CryptoKey | types.KeyObject => {
  return isCryptoKey(key) || isKeyObject(key)
}
