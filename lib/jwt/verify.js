const ms = require('ms')

const Key = require('../jwk/base')
const { verify } = require('../jws')
const epoch = require('../help/epoch')
const importKey = require('../jwk/import')

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

  const { header, payload } = decode(jwt)

  if (!header.alg) {
    throw new Error('TODO')
  } else if (algorithms && !algorithms.includes(header.alg)) {
    throw new Error('TODO')
  }

  if (issuer !== payload.issuer) {
    throw new Error('TODO')
  }

  if (subject !== payload.sub) {
    throw new Error('TODO')
  }

  if (nonce !== payload.nonce) {
    throw new Error('TODO')
  }

  if (jti !== payload.jti) {
    throw new Error('TODO')
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
      throw new Error('TODO')
      // return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
    }
  }

  // TODO: full options assert

  return verify(jwt, key)
}
