import { createPrivateKey, createPublicKey } from 'node:crypto'
import type { KeyObject, JsonWebKeyInput } from 'node:crypto'

import type { JWK } from '../../types.d'

const parse = (key: JWK): KeyObject => {
  if (key.d) {
    return createPrivateKey({ format: 'jwk', key } as JsonWebKeyInput)
  }
  return createPublicKey({ format: 'jwk', key } as JsonWebKeyInput)
}
export default parse
