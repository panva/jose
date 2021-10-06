import type { KeyLike } from '../../types.d'
import { isCryptoKey } from './webcrypto.js'
import isKeyObject from './is_key_object.js'

export default (key: unknown): key is KeyLike => isKeyObject(key) || isCryptoKey(key)

const types = ['KeyObject']

if (parseInt(process.versions.node) >= 16) {
  types.push('CryptoKey')
}

export { types }
