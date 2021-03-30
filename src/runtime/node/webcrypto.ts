import * as crypto from 'crypto'

// @ts-expect-error
const webcrypto = <Crypto>crypto.webcrypto

export default webcrypto
export function isCryptoKey(key: unknown): key is CryptoKey {
  if (webcrypto !== undefined) {
    // @ts-expect-error
    return key instanceof webcrypto.CryptoKey
  }

  return false
}
export function getKeyObject(key: CryptoKey) {
  // @ts-expect-error
  return <crypto.KeyObject>crypto.KeyObject.from(key)
}
