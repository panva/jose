const keyto = require('@trust/keyto')

const SUPPORTED = new Set(['EC', 'RSA'])

module.exports.keyObjectToJWK = (keyObject) => {
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
