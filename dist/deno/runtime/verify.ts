import type { VerifyFunction } from './interfaces.d.ts'
import subtleAlgorithm from './subtle_dsa.ts'
import crypto from './webcrypto.ts'
import checkKeyLength from './check_key_length.ts'
import getVerifyKey from './get_sign_verify_key.ts'

const verify: VerifyFunction = async (alg, key: unknown, signature, data) => {
  const cryptoKey = await getVerifyKey(alg, key, 'verify')
  checkKeyLength(alg, cryptoKey)
  const algorithm = subtleAlgorithm(alg, cryptoKey.algorithm)
  try {
    return await crypto.subtle.verify(algorithm, cryptoKey, signature, data)
  } catch {
    return false
  }
}

export default verify
