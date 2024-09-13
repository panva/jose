import { createPrivateKey, createPublicKey } from 'node:crypto'
import type { KeyObject, JsonWebKeyInput } from 'node:crypto'

import type { JWK } from '../../types.d'

const parse = (key: JWK): KeyObject => {
  if (key.d) {
    return createPrivateKey(<JsonWebKeyInput>{ format: 'jwk', key })
  }
  return createPublicKey(<JsonWebKeyInput>{ format: 'jwk', key })
}
export default parse
