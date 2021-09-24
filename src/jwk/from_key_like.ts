import { exportJWK } from '../key/export.js'

import type { JWK, KeyLike } from '../types.d'

/**
 * @deprecated use `jose/key/export`
 */
async function fromKeyLike(key: KeyLike): Promise<JWK> {
  return exportJWK(key)
}

export { fromKeyLike }
export default fromKeyLike
export type { KeyLike, JWK }
