const ms = require('ms')

const Key = require('../jwk/base')
const { sign } = require('../jws')
const epoch = require('../help/epoch')
const importKey = require('../jwk/import')

let lastInput
let lastKey

module.exports = (
  payload = {},
  key,
  {
    alg,
    algorithm = alg,
    expiresIn,
    notBefore,
    audience,
    issuer,
    jwtid,
    jti = jwtid,
    subject,
    noTimestamp = false,
    header = {},
    keyid,
    kid = keyid,
    mutatePayload = false
  } = {}
) => {
  if (!(key instanceof Key)) {
    if (key === lastInput) {
      key = lastKey
    } else {
      const imported = importKey(key)
      lastInput = key
      key = lastKey = imported
    }
  }

  // TODO: full options assert

  if (!mutatePayload) {
    payload = { ...payload }
  }

  algorithm = algorithm || header.alg || [...key.algorithms('sign')][0]
  // TODO: assert alg
  header.alg = algorithm

  const iat = payload.iat || epoch()
  if (noTimestamp) {
    delete payload.iat
  } else {
    payload.iat = iat
  }

  if (typeof expiresIn === 'string') {
    expiresIn = ms(expiresIn) / 1000
  }

  if (typeof expiresIn === 'number') {
    payload.exp = iat + expiresIn
  }

  if (typeof notBefore === 'string') {
    notBefore = ms(notBefore) / 1000
  }

  if (typeof notBefore === 'number') {
    payload.nbf = iat + notBefore
  }

  payload.aud = payload.aud || audience
  payload.iss = payload.iss || issuer
  payload.jti = payload.jti || jti
  payload.sub = payload.sub || subject

  header.kid = header.kid || kid

  return sign(payload, key, header)
}
