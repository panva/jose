export default (alg: string, key: CryptoKey) => {
  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const { modulusLength } = <RsaKeyAlgorithm>key.algorithm
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}
