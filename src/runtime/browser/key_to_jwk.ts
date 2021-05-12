import crypto, { isCryptoKey } from './webcrypto.js'
import type { JWKConvertFunction } from '../interfaces.d'
import type { JWK } from '../../types.d'

const keyToJWK: JWKConvertFunction = async (key: unknown): Promise<JWK> => {
  if (!isCryptoKey(key)) {
    throw new TypeError('invalid key input')
  }
  if (!key.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { ext, key_ops, alg, use, ...jwk } = await crypto.subtle.exportKey('jwk', key)

  return jwk
}
export default keyToJWK
