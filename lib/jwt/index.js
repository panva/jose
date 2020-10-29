const decode = require('./decode')
const sign = require('./sign')
const verify = require('./verify')
const profiles = require('./profiles')

module.exports = {
  sign,
  verify,
  ...profiles
}

Object.defineProperty(module.exports, 'decode', {
  enumerable: false,
  configurable: true,
  value: decode
})
