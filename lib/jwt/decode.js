const base64url = require('../help/base64url')
const errors = require('../errors')

module.exports = (token, { complete = false } = {}) => {
  if (typeof token !== 'string' || !token) {
    throw new TypeError('JWT must be a string')
  }

  const { 0: header, 1: payload, 2: signature, length } = token.split('.')

  if (length === 5) {
    throw new TypeError('JWTs must be decrypted first')
  }

  if (length !== 3) {
    throw new errors.JWTMalformed('JWTs must have three components')
  }

  try {
    const result = {
      header: base64url.JSON.decode(header),
      payload: base64url.JSON.decode(payload),
      signature
    }

    return complete ? result : result.payload
  } catch (err) {
    throw new errors.JWTMalformed('JWT is malformed')
  }
}
