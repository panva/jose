module.exports = (AlgorithmIdentifier, PrivateKey) => function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('privateKey').use(PrivateKey)
  )
}
