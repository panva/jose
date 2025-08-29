import type * as types from '../types.d.ts'
import { subtleAlgorithm } from './subtle_dsa.js'

import { checkKeyLength } from './check_key_length.js'
import { getSigKey } from './get_sign_verify_key.js'

export async function verify(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  signature: Uint8Array,
  data: Uint8Array,
) {
  const cryptoKey = await getSigKey(alg, key, 'verify')
  checkKeyLength(alg, cryptoKey)
  const algorithm = subtleAlgorithm(alg, cryptoKey.algorithm)
  try {
    return await crypto.subtle.verify(
      algorithm,
      cryptoKey,
      signature as Uint8Array<ArrayBuffer>,
      data as Uint8Array<ArrayBuffer>,
    )
  } catch {
    return false
  }
}
