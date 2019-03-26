module.exports = (AlgorithmIdentifier) => function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('privateKey').octstr()
  )
}
