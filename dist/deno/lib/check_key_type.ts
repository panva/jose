import invalidKeyInput from './invalid_key_input.ts'
import isKeyLike, { types } from '../runtime/is_key_like.ts'

const symmetricTypeCheck = (key: unknown) => {
  if (key instanceof Uint8Array) return

  if (!isKeyLike(key)) {
    throw new TypeError(invalidKeyInput(key, ...types, 'Uint8Array'))
  }

  if (key.type !== 'secret') {
    throw new TypeError(
      `${types.join(' or ')} instances for symmetric algorithms must be of type "secret"`,
    )
  }
}

const asymmetricTypeCheck = (key: unknown, usage: string) => {
  if (!isKeyLike(key)) {
    throw new TypeError(invalidKeyInput(key, ...types))
  }

  if (key.type === 'secret') {
    throw new TypeError(
      `${types.join(' or ')} instances for asymmetric algorithms must not be of type "secret"`,
    )
  }

  if (usage === 'sign' && key.type === 'public') {
    throw new TypeError(
      `${types.join(' or ')} instances for asymmetric algorithm signing must be of type "private"`,
    )
  }

  if (usage === 'decrypt' && key.type === 'public') {
    throw new TypeError(
      `${types.join(
        ' or ',
      )} instances for asymmetric algorithm decryption must be of type "private"`,
    )
  }

  // KeyObject allows this but CryptoKey does not.
  if ((<CryptoKey>key).algorithm && usage === 'verify' && key.type === 'private') {
    throw new TypeError(
      `${types.join(' or ')} instances for asymmetric algorithm verifying must be of type "public"`,
    )
  }

  // KeyObject allows this but CryptoKey does not.
  if ((<CryptoKey>key).algorithm && usage === 'encrypt' && key.type === 'private') {
    throw new TypeError(
      `${types.join(
        ' or ',
      )} instances for asymmetric algorithm encryption must be of type "public"`,
    )
  }
}

const checkKeyType = (alg: string, key: unknown, usage: string): void => {
  const symmetric =
    alg.startsWith('HS') ||
    alg === 'dir' ||
    alg.startsWith('PBES2') ||
    /^A\d{3}(?:GCM)?KW$/.test(alg)

  if (symmetric) {
    symmetricTypeCheck(key)
  } else {
    asymmetricTypeCheck(key, usage)
  }
}

export default checkKeyType
