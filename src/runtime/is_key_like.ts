import type { CryptoKey, KeyObject } from '../types.d.ts'

export function assertCryptoKey(key: unknown): asserts key is CryptoKey {
  if (!isCryptoKey(key)) {
    throw new Error('unreachable. report.')
  }
}

export function isCryptoKey(key: unknown): key is CryptoKey {
  // @ts-expect-error
  return key?.[Symbol.toStringTag] === 'CryptoKey'
}

export function isKeyObject<T extends KeyObject = KeyObject>(key: unknown): key is T {
  // @ts-expect-error
  return key?.[Symbol.toStringTag] === 'KeyObject'
}

export default (key: unknown): key is CryptoKey | KeyObject => {
  return isCryptoKey(key) || isKeyObject(key)
}

export const types = ['CryptoKey', 'KeyObject']
