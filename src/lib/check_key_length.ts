import type * as types from '../types.d.ts'

export default (alg: string, key: types.CryptoKey) => {
  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const { modulusLength } = key.algorithm as RsaKeyAlgorithm
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}
