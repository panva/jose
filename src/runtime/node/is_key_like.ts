import type { KeyLike } from '../../types.d'
import webcrypto, { isCryptoKey } from './webcrypto.js'
import isKeyObject from './is_key_object.js'

export default (key: unknown): key is KeyLike => isKeyObject(key) || isCryptoKey(key)

const types = ['KeyObject']

// @ts-ignore
if (globalThis.CryptoKey || webcrypto?.CryptoKey) {
  types.push('CryptoKey')
}

export { types }
