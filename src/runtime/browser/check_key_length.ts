export default (alg: string, key: CryptoKey) => {
  if (alg.startsWith('HS')) {
    const bitlen = parseInt(alg.substr(-3), 10)
    if (!('length' in key.algorithm) || (key.algorithm as HmacKeyAlgorithm).length < bitlen) {
      throw new TypeError(`${alg} requires symmetric keys to be ${bitlen} bits or larger`)
    }
  }

  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    if (
      !('modulusLength' in key.algorithm) ||
      (key.algorithm as RsaKeyAlgorithm).modulusLength < 2048
    ) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}
