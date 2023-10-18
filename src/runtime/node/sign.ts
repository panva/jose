import * as crypto from 'node:crypto'
import { promisify } from 'node:util'

import type { SignFunction } from '../interfaces.d'
import nodeDigest from './dsa_digest.js'
import hmacDigest from './hmac_digest.js'
import nodeKey from './node_key.js'
import getSignKey from './get_sign_verify_key.js'

const oneShotSign = promisify(crypto.sign)

const sign: SignFunction = async (alg, key: unknown, data) => {
  const keyObject = getSignKey(alg, key, 'sign')

  if (alg.startsWith('HS')) {
    const hmac = crypto.createHmac(hmacDigest(alg), keyObject)
    hmac.update(data)
    return hmac.digest()
  }

  return oneShotSign(nodeDigest(alg), data, nodeKey(alg, keyObject))
}

export default sign
