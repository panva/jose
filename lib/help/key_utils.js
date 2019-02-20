const keyto = require('@trust/keyto')

const KeyObject = require('./key_object')
const SUPPORTED = new Set(['EC', 'RSA'])

module.exports.pemToJwk = (keyObject) => {
  if (!(keyObject instanceof KeyObject) || keyObject.type === 'secret') {
    throw new TypeError('unsupported keyObject type')
  }

  const type = keyObject.type === 'private' ? 'pkcs8' : 'spki'
  const format = 'pem'

  const pem = keyObject.export({ type, format })

  return keyto.from(pem, 'pem').toJwk(keyObject.type)
}

module.exports.jwkToPem = (jwk) => {
  if (!SUPPORTED.has(jwk.kty)) {
    throw new TypeError('unsupported kty')
  }

  return keyto.from(jwk, 'jwk').toString('pem', jwk.d ? 'private_pkcs8' : 'public_pkcs8')
}
