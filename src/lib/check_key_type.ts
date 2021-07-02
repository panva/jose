import type { KeyLike } from '../types'
import invalidKeyInput from '../runtime/invalid_key_input.js'

const checkKeyType = (
  alg: string,
  key: KeyLike,
  usage: 'sign' | 'verify' | 'encrypt' | 'decrypt',
): void => {
  if (!(key instanceof Uint8Array) && !key?.type) {
    throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey', 'Uint8Array'))
  }

  if (
    alg.startsWith('HS') ||
    alg === 'dir' ||
    alg.startsWith('PBES2') ||
    alg.match(/^A\d{3}(?:GCM)?KW$/)
  ) {
    if (key instanceof Uint8Array || key.type === 'secret') {
      return
    }

    throw new TypeError(
      'CryptoKey or KeyObject instances for symmetric algorithms must be of type "secret"',
    )
  }

  if (key instanceof Uint8Array) {
    throw new TypeError(invalidKeyInput(key, 'KeyObject', 'CryptoKey'))
  }

  if (key.type === 'secret') {
    throw new TypeError(
      'CryptoKey or KeyObject instances for asymmetric algorithms must not be of type "secret"',
    )
  }

  if (usage === 'sign' && key.type === 'public') {
    throw new TypeError(
      'CryptoKey or KeyObject instances for asymmetric algorithm signing must be of type "private"',
    )
  }

  if (usage === 'decrypt' && key.type === 'public') {
    throw new TypeError(
      'CryptoKey or KeyObject instances for asymmetric algorithm decryption must be of type "private"',
    )
  }
}

export default checkKeyType
