import * as crypto from 'crypto'
import { promisify } from 'util'

import type { VerifyFunction } from '../interfaces.d'
import nodeDigest from './dsa_digest.js'
import nodeKey from './node_key.js'
import sign from './sign.js'
import getVerifyKey from './get_sign_verify_key.js'

const [major, minor] = process.version
  .substr(1)
  .split('.')
  .map((str) => parseInt(str, 10))

const oneShotCallbackSupported = major >= 16 || (major === 15 && minor >= 13)

let oneShotVerify = crypto.verify
if (oneShotVerify.length > 4 && oneShotCallbackSupported) {
  // @ts-expect-error
  oneShotVerify = promisify(oneShotVerify)
}

const verify: VerifyFunction = async (alg, key: unknown, signature, data) => {
  if (alg.startsWith('HS')) {
    const expected = await sign(alg, getVerifyKey(alg, key, 'verify'), data)
    const actual = signature
    try {
      return crypto.timingSafeEqual(actual, expected)
    } catch {
      // handle incorrect signature lengths
      return false
    }
  }

  const algorithm = nodeDigest(alg)
  const keyObject = getVerifyKey(alg, key, 'verify')
  const keyInput = nodeKey(alg, keyObject)
  try {
    let result = oneShotVerify(algorithm, data, keyInput, signature)
    // @ts-expect-error
    if (result instanceof Promise) {
      result = await result
    }
    return result
  } catch {
    return false
  }
}

export default verify
