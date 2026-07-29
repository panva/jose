import type * as types from '../types.d.ts'

const unusable = (name: string | number, prop = 'algorithm.name') =>
  new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`)

export interface ExpectedAlgorithm {
  name: string
  hash?: string
  namedCurve?: string
  length?: number
}

export function checkUsage(key: types.CryptoKey, usage?: KeyUsage): void {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

/**
 * Asserts a caller-supplied CryptoKey matches what an algorithm entry describes. Generic - it names
 * no algorithm itself, so it belongs to neither family.
 */
export function checkCryptoKey(
  key: types.CryptoKey,
  expected: ExpectedAlgorithm,
  usage?: KeyUsage,
): void {
  const algorithm = key.algorithm as RsaHashedKeyAlgorithm & EcKeyAlgorithm & AesKeyAlgorithm

  if (algorithm.name !== expected.name) {
    throw unusable(expected.name)
  }

  if (expected.hash && algorithm.hash?.name !== expected.hash) {
    throw unusable(expected.hash, 'algorithm.hash')
  }

  if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) {
    throw unusable(expected.namedCurve, 'algorithm.namedCurve')
  }

  if (expected.length !== undefined && algorithm.length !== expected.length) {
    throw unusable(expected.length, 'algorithm.length')
  }

  checkUsage(key, usage)
}
