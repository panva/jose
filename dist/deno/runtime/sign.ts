import type { SignFunction } from './interfaces.d.ts'
import subtleAlgorithm from './subtle_dsa.ts'
import crypto from './webcrypto.ts'
import checkKeyLength from './check_key_length.ts'
import getSignKey from './get_sign_verify_key.ts'

const sign: SignFunction = async (alg, key: unknown, data) => {
  const cryptoKey = await getSignKey(alg, key, 'sign')
  checkKeyLength(alg, cryptoKey)
  const signature = await crypto.subtle.sign(
    subtleAlgorithm(alg, cryptoKey.algorithm),
    cryptoKey,
    data,
  )
  return new Uint8Array(signature)
}

export default sign
