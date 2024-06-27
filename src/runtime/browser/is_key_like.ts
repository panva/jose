import type { KeyLike } from '../../types.d'
import { isCryptoKey } from './webcrypto.js'

export default (key: unknown): key is KeyLike => {
  if (isCryptoKey(key)) {
    return true
  }

  // @ts-expect-error
  return key?.[Symbol.toStringTag] === 'KeyObject'
}

export const types = ['CryptoKey']
