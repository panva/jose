const keyto = require('@trust/keyto')

const errors = require('../errors')

const EC_CURVES = new Set(['P-256', 'P-384', 'P-521'])

module.exports.keyObjectToJWK = (keyObject) => {
  const type = keyObject.type === 'private' ? 'pkcs8' : 'spki'
  const format = 'pem'

  let pem = keyObject.export({ type, format })

  return keyto.from(pem, 'pem').toJwk(keyObject.type)
}

module.exports.jwkToPem = (jwk) => {
  switch (jwk.kty) {
    case 'EC':
      if (!EC_CURVES.has(jwk.crv)) {
        throw new errors.JOSENotSupported(`unsupported EC key curve: ${jwk.crv}`)
      }
      break
    case 'RSA':
      break
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${jwk.kty}`)
  }

  return keyto.from(jwk, 'jwk').toString('pem', jwk.d ? 'private_pkcs8' : 'public_pkcs8')
}
