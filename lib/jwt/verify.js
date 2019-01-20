const ms = require('ms')

const Key = require('../jwk/key/base')
const { verify } = require('../jws')
const epoch = require('../help/epoch')
const importKey = require('../jwk/import')
const errors = require('../errors')

const decode = require('./decode')

let lastInput
let lastKey

module.exports = (
  jwt,
  key,
  {
    algorithms,
    audience,
    issuer,
    ignoreExpiration = false,
    ignoreNotBefore = false,
    subject,
    clockTolerance = 0,
    maxAge,
    jwtid,
    jti = jwtid,
    clockTimestamp,
    complete = false,
    nonce
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

  const { header, payload, signature } = decode(jwt, { complete: true })

  if (!header.alg || (algorithms && !algorithms.includes(header.alg))) {
    throw new errors.JWTInvalidAlgorithm('invalid JWS algorithm')
  }

  if (issuer && issuer !== payload.issuer) {
    throw new errors.JWTIssuerMismatch('jwt issuer invalid')
  }

  if (subject && subject !== payload.sub) {
    throw new errors.JWTSubjectMismatch('jwt subject invalid')
  }

  if (nonce && nonce !== payload.nonce) {
    throw new errors.JWTNonceMismatch('jwt nonce invalid')
  }

  if (jti && jti !== payload.jti) {
    throw new errors.JWTTokenIdMismatch('jwt jti invalid')
  }

  if (audience) {
    const audiences = Array.isArray(audience) ? new Set(audience) : new Set([audience])
    const target = Array.isArray(payload.aud) ? new Set(payload.aud) : new Set([payload.aud])

    const match = target.find((targetAudience) => {
      return audiences.find((audience) => {
        return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience
      })
    })

    if (!match) {
      throw new errors.JWTAudienceMismatch('jwt audience invalid')
    }
  }

  // TODO: full options assert

  verify(jwt, key)

  return complete ? { header, payload, signature } : payload
}
