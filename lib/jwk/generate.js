const errors = require('../errors')

const importKey = require('./import')

const RSAKey = require('./key/rsa')
const ECKey = require('./key/ec')
const OKPKey = require('./key/okp')
const OctKey = require('./key/oct')

const generate = async (kty, crvOrSize, params, generatePrivate = true) => {
  switch (kty) {
    case 'RSA':
      return importKey(
        await RSAKey.generate(crvOrSize, generatePrivate),
        params
      )
    case 'EC':
      return importKey(
        await ECKey.generate(crvOrSize, generatePrivate),
        params
      )
    case 'OKP':
      return importKey(
        await OKPKey.generate(crvOrSize, generatePrivate),
        params
      )
    case 'oct':
      return importKey(
        await OctKey.generate(crvOrSize, generatePrivate),
        params
      )
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${kty}`)
  }
}

const generateSync = (kty, crvOrSize, params, generatePrivate = true) => {
  switch (kty) {
    case 'RSA':
      return importKey(RSAKey.generateSync(crvOrSize, generatePrivate), params)
    case 'EC':
      return importKey(ECKey.generateSync(crvOrSize, generatePrivate), params)
    case 'OKP':
      return importKey(OKPKey.generateSync(crvOrSize, generatePrivate), params)
    case 'oct':
      return importKey(OctKey.generateSync(crvOrSize, generatePrivate), params)
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${kty}`)
  }
}

module.exports.generate = generate
module.exports.generateSync = generateSync
