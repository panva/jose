const oids = require('./oids')

module.exports = function () {
  this.seq().obj(
    this.key('algorithm').objid(oids),
    this.key('parameters').optional().choice({ namedCurve: this.objid(oids), null: this.null_() })
  )
}
