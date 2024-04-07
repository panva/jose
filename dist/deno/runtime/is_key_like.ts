import type { KeyLike } from '../types.d.ts'
import { isCryptoKey } from './webcrypto.ts'

export default (key: unknown): key is KeyLike => {
  return isCryptoKey(key)
}

export const types = ['CryptoKey']
