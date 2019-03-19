module.exports = function () {
  this.octstr().contains().obj(
    this.key('privateKey').octstr()
  )
}
