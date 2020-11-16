export default (alg: string, key: CryptoKey) => {
  if (alg.startsWith('HS')) {
    const bitlen = parseInt(alg.substr(-3), 10)
    const { length } = key.algorithm as HmacKeyAlgorithm
    if (typeof length !== 'number' || length < bitlen) {
      throw new TypeError(`${alg} requires symmetric keys to be ${bitlen} bits or larger`)
    }
  }

  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const { modulusLength } = key.algorithm as RsaKeyAlgorithm
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}
