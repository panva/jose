import { importJWK } from '../key/import.js'

import type { JWK, KeyLike } from '../types.d'

/**
 * @deprecated use `jose/key/import`
 */
async function parseJwk(jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike> {
  return importJWK(jwk, alg, octAsKeyObject)
}

export { parseJwk }
export default parseJwk
export type { KeyLike, JWK }
