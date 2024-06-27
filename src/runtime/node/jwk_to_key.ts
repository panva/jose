import { createPrivateKey, createPublicKey } from 'node:crypto'
import type { KeyObject } from 'node:crypto'

import type { JWK } from '../../types.d'

const parse = (jwk: JWK): KeyObject => {
  return (jwk.d ? createPrivateKey : createPublicKey)({ format: 'jwk', key: jwk })
}
export default parse
