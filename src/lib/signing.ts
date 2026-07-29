import type * as types from '../types.d.ts'
import type { JWSAlgorithm } from './jws_algorithms.js'
import { checkCryptoKey } from './crypto_key.js'

export function checkModulusLength(alg: string, key: types.CryptoKey): void {
  const { modulusLength } = key.algorithm as RsaKeyAlgorithm
  if (typeof modulusLength !== 'number' || modulusLength < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
  }
}

/** Asserts a caller-supplied CryptoKey is what the algorithm needs. */
function checkSigCryptoKey(entry: JWSAlgorithm, key: types.CryptoKey, usage: KeyUsage): void {
  checkCryptoKey(key, entry.subtle, usage)

  if (entry.minModulusLength) {
    checkModulusLength(entry.alg, key)
  }
}

async function getSigKey(entry: JWSAlgorithm, key: types.CryptoKey | Uint8Array, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey('raw', key as Uint8Array<ArrayBuffer>, entry.subtle, false, [
      usage,
    ])
  }

  checkSigCryptoKey(entry, key, usage)
  return key
}

export async function sign(
  entry: JWSAlgorithm,
  key: types.CryptoKey | Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await getSigKey(entry, key, 'sign')
  const signature = await crypto.subtle.sign(
    entry.operation,
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
      entry.operation,
      cryptoKey,
      signature as Uint8Array<ArrayBuffer>,
      data as Uint8Array<ArrayBuffer>,
    )
  } catch {
    return false
  }
}
