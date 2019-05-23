module.exports = function () {
  this.seq().obj(
    this.key('version').int({ 0: 'two-prime', 1: 'multi' }),
    this.key('n').int(),
    this.key('e').int(),
    this.key('d').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('dp').int(),
    this.key('dq').int(),
    this.key('qi').int()
  )
}
