module.exports = function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').explicit(0).optional().choice({ namedCurve: this.objid() }),
    this.key('publicKey').explicit(1).optional().bitstr()
  )
}
