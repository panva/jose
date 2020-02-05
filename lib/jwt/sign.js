const isObject = require('../help/is_object')
const secs = require('../help/secs')
const epoch = require('../help/epoch')
const getKey = require('../help/get_key')
const JWS = require('../jws')

const isString = require('./shared_validations').isString.bind(undefined, TypeError)

const validateOptions = (options) => {
  if (typeof options.iat !== 'boolean') {
    throw new TypeError('options.iat must be a boolean')
  }

  if (typeof options.kid !== 'boolean') {
    throw new TypeError('options.kid must be a boolean')
  }

  isString(options.subject, 'options.subject')
  isString(options.issuer, 'options.issuer')

  if (
    options.audience !== undefined &&
    (
      (typeof options.audience !== 'string' || !options.audience) &&
      (!Array.isArray(options.audience) || options.audience.length === 0 || options.audience.some(a => !a || typeof a !== 'string'))
    )
  ) {
    throw new TypeError('options.audience must be a string or an array of strings')
  }

  if (!isObject(options.header)) {
    throw new TypeError('options.header must be an object')
  }

  isString(options.algorithm, 'options.algorithm')
  isString(options.expiresIn, 'options.expiresIn')
  isString(options.notBefore, 'options.notBefore')
  isString(options.jti, 'options.jti')
  isString(options.nonce, 'options.nonce')

  if (options.now !== undefined && (!(options.now instanceof Date) || !options.now.getTime())) {
    throw new TypeError('options.now must be a valid Date object')
  }
}

module.exports = (payload, key, options = {}) => {
  if (!isObject(options)) {
    throw new TypeError('options must be an object')
  }

  const {
    algorithm, audience, expiresIn, header = {}, iat = true,
    issuer, jti, kid = true, nonce, notBefore, subject, now
  } = options

  validateOptions({
    algorithm, audience, expiresIn, header, iat, issuer, jti, kid, nonce, notBefore, now, subject
  })

  if (!isObject(payload)) {
    throw new TypeError('payload must be an object')
  }

  let unix
  if (expiresIn || notBefore || iat) {
    unix = epoch(now || new Date())
  }

  payload = {
    ...payload,
    sub: subject || payload.sub,
    aud: audience || payload.aud,
    iss: issuer || payload.iss,
    jti: jti || payload.jti,
    iat: iat ? unix : payload.iat,
    nonce: nonce || payload.nonce,
    exp: expiresIn ? unix + secs(expiresIn) : payload.exp,
    nbf: notBefore ? unix + secs(notBefore) : payload.nbf
  }

  key = getKey(key)

  let includeKid

  if (typeof options.kid === 'boolean') {
    includeKid = kid
  } else {
    includeKid = !key.secret
  }

  return JWS.sign(JSON.stringify(payload), key, {
    ...header,
    alg: algorithm || header.alg,
    kid: includeKid ? key.kid : header.kid
  })
}
