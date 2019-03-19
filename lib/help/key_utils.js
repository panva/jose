const { EOL } = require('os')
const keyto = require('@trust/keyto')

const errors = require('../errors')

const SUPPORTED = new Set(['EC', 'RSA'])

module.exports.keyObjectToJWK = (keyObject) => {
  const type = keyObject.type === 'private' ? 'pkcs8' : 'spki'
  const format = 'pem'

  let pem = keyObject.export({ type, format })

  // keyObject export always uses \n but @trust/keyto splits based on the os.EOL
  if (EOL !== '\n') {
    pem = pem.replace(/\n/g, EOL)
  }

  return keyto.from(pem, 'pem').toJwk(keyObject.type)
}

module.exports.jwkToPem = (jwk) => {
  if (!SUPPORTED.has(jwk.kty)) {
    throw new errors.JOSENotSupported(`unsupported key type: ${jwk.kty}`)
  }

  return keyto.from(jwk, 'jwk').toString('pem', jwk.d ? 'private_pkcs8' : 'public_pkcs8')
}
