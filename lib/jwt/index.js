const decode = require('./decode')
const sign = require('./sign')
const verify = require('./verify')
const profiles = require('./profiles')

module.exports = {
  decode,
  sign,
  verify,
  ...profiles
}
