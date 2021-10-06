import { exportJWK } from '../key/export.ts'

import type { JWK, KeyLike } from '../types.d.ts'

/**
 * @deprecated use `jose/key/export`
 */
async function fromKeyLike(key: KeyLike | Uint8Array): Promise<JWK> {
  return exportJWK(key)
}

export { fromKeyLike }
export default fromKeyLike
export type { KeyLike, JWK }
