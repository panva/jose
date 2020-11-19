import crypto, { ensureSecureContext } from './webcrypto.js'
import type { JWKConvertFunction } from '../interfaces.d'
import type { JWK } from '../../types.d'

const keyToJWK: JWKConvertFunction = async (key: CryptoKey): Promise<JWK> => {
  if (!key.extractable) {
    throw new TypeError('non-extractable key cannot be extracted as a JWK')
  }
  ensureSecureContext()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { ext, key_ops, alg, use, ...jwk } = await crypto.subtle.exportKey('jwk', key)
  return jwk
}
export default keyToJWK
