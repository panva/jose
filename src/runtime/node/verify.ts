import * as crypto from 'crypto'
import { promisify } from 'util'

import type { VerifyFunction } from '../interfaces'
import nodeDigest from './dsa_digest.js'
import nodeKey from './node_key.js'
import sign from './sign.js'
import getVerifyKey from './get_sign_verify_key.js'

const [major, minor] = process.version
  .substr(1)
  .split('.')
  .map((str) => parseInt(str, 10))

const oneShotCallbackSupported = major >= 16 || (major === 15 && minor >= 13)

let oneShotVerify: (
  alg: string | undefined,
  data: Uint8Array,
  key: ReturnType<typeof nodeKey>,
  signature: Uint8Array,
) => Promise<boolean> | boolean
if (crypto.verify.length > 4 && oneShotCallbackSupported) {
  oneShotVerify = promisify(crypto.verify)
} else {
  oneShotVerify = crypto.verify
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
    return await oneShotVerify(algorithm, data, keyInput, signature)
  } catch {
    return false
  }
}

export default verify
