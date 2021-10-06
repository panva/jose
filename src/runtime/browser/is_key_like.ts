import type { KeyLike } from '../../types.d'
import { isCryptoKey } from './webcrypto.js'

export default (key: unknown): key is KeyLike => {
  return isCryptoKey(key)
}

export const types = ['CryptoKey']
