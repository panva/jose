const Sign = require('./sign')
const verify = require('./verify')

module.exports.Sign = Sign
module.exports.sign = (payload, key, protectedHeader, unprotectedHeader, serialization) => {
  const jws = new Sign(payload, protectedHeader, unprotectedHeader)
  jws.recipient(key)
  const result = jws.sign(serialization)
  return result
}

module.exports.verify = verify
