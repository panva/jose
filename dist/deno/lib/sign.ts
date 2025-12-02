import type * as types from '../types.d.ts'
import { subtleAlgorithm } from './subtle_dsa.ts'

import { checkKeyLength } from './check_key_length.ts'
import { getSigKey } from './get_sign_verify_key.ts'

export async function sign(alg: string, key: types.CryptoKey | Uint8Array, data: Uint8Array) {
  const cryptoKey = await getSigKey(alg, key, 'sign')
  checkKeyLength(alg, cryptoKey)
  const signature = await crypto.subtle.sign(
    subtleAlgorithm(alg, cryptoKey.algorithm),
    cryptoKey,
    data as Uint8Array<ArrayBuffer>,
  )
  return new Uint8Array(signature)
}
