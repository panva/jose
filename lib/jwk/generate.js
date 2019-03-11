const errors = require('../errors')

const RSAKey = require('./key/rsa')
const ECKey = require('./key/ec')
const OctKey = require('./key/oct')

const generate = async (kty, ...args) => {
  switch (kty) {
    case 'RSA':
      return RSAKey.generate(...args)
    case 'EC':
      return ECKey.generate(...args)
    case 'oct':
      return OctKey.generate(...args)
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${kty}`)
  }
}

const generateSync = (kty, ...args) => {
  switch (kty) {
    case 'RSA':
      return RSAKey.generateSync(...args)
    case 'EC':
      return ECKey.generateSync(...args)
    case 'oct':
      return OctKey.generateSync(...args)
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${kty}`)
  }
}

module.exports.generate = generate
module.exports.generateSync = generateSync
