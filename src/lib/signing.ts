import type * as types from '../types.d.ts'
import type { JWSAlgorithm } from './jws_algorithm.js'
import { checkCryptoKey, checkModulusLength } from './crypto_key.js'

async function getSigKey(entry: JWSAlgorithm, key: types.CryptoKey | Uint8Array, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, entry.subtle, false, [
      usage,
    ])
  }

  checkCryptoKey(key, entry.subtle, usage)
  if (entry.minRsaBits) checkModulusLength(entry.alg, key)
  return key
}

export async function sign(
  entry: JWSAlgorithm,
  key: types.CryptoKey | Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await getSigKey(entry, key, 'sign')
  const signature = await crypto.subtle.sign(
    entry.signing,
    cryptoKey,
    data as Uint8Array<ArrayBuffer>,
  )
  return new Uint8Array(signature)
}

export async function verify(
  entry: JWSAlgorithm,
  key: types.CryptoKey | Uint8Array,
  signature: Uint8Array,
  data: Uint8Array,
): Promise<boolean> {
  const cryptoKey = await getSigKey(entry, key, 'verify')
  try {
    return await crypto.subtle.verify(
      entry.signing,
      cryptoKey,
      signature as Uint8Array<ArrayBuffer>,
      data as Uint8Array<ArrayBuffer>,
    )
  } catch {
    return false
  }
}
