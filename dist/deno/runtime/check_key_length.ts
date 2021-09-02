export default (alg: string, key: CryptoKey) => {
  if (alg.startsWith('HS')) {
    const bitlen = parseInt(alg.substr(-3), 10)
    // @ts-ignore
    const { length } = <HmacKeyAlgorithm>key.algorithm
    if (typeof length !== 'number' || length < bitlen) {
      throw new TypeError(`${alg} requires symmetric keys to be ${bitlen} bits or larger`)
    }
  }

  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    // @ts-ignore
    const { modulusLength } = <RsaKeyAlgorithm>key.algorithm
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}
