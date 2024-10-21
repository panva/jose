import subtleAlgorithm from './subtle_dsa.js'

import checkKeyLength from './check_key_length.js'
import getSignKey from './get_sign_verify_key.js'

export default async function sign(alg: string, key: CryptoKey | Uint8Array, data: Uint8Array) {
  const cryptoKey = await getSignKey(alg, key, 'sign')
  checkKeyLength(alg, cryptoKey)
  const signature = await crypto.subtle.sign(
    subtleAlgorithm(alg, cryptoKey.algorithm),
    cryptoKey,
    data,
  )
  return new Uint8Array(signature)
}
