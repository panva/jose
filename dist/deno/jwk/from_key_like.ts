import asJWK from '../runtime/key_to_jwk.ts'

import type { JWK, KeyLike } from '../types.d.ts'

/**
 * @deprecated use `jose/key/export`
 */
async function fromKeyLike(key: KeyLike): Promise<JWK> {
  return asJWK(key)
}

export { fromKeyLike }
export default fromKeyLike
export type { KeyLike, JWK }
