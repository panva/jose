import asJWK from '../runtime/key_to_jwk.js'

import type { JWK, KeyLike } from '../types.d'

/**
 * @deprecated use `jose/key/export`
 */
async function fromKeyLike(key: KeyLike): Promise<JWK> {
  return asJWK(key)
}

export { fromKeyLike }
export default fromKeyLike
export type { KeyLike, JWK }
