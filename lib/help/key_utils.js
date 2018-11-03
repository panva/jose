const utils = {
  rsa: require('rasha'),
  ec: require('eckles')
}
const { PrivateKeyObject, PublicKeyObject } = require('./key_objects')

const SUPPORTED = new Set(Object.keys(utils))

module.exports.pemToJwk = (keyObject) => {
  if (!(keyObject instanceof PrivateKeyObject) && !(keyObject instanceof PublicKeyObject)) {
    throw new TypeError('invalid keyObject type')
  }

  const type = keyObject.type === 'private' ? 'pkcs8' : 'spki'
  const format = 'pem'

  return utils[keyObject.asymmetricKeyType].importSync({ pem: keyObject.export({ type, format }) })
}

module.exports.jwkToPem = (jwk) => {
  if (!SUPPORTED.has(jwk.kty)) {
    throw new TypeError('unsupported kty')
  }

  return utils[jwk.kty.toLowerCase()].exportSync({ jwk })
}
