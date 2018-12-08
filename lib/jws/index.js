const Sign = require('./sign')
const verify = require('./verify')

const shorthand = (serialization, payload, key, protectedHeader, unprotectedHeader) => {
  const jws = new Sign(payload, protectedHeader, unprotectedHeader)
  jws.recipient(key)
  return jws.sign(serialization)
}

module.exports.Sign = Sign
module.exports.sign = shorthand.bind(undefined, 'compact')
module.exports.sign.flattened = shorthand.bind(undefined, 'flattened')
module.exports.sign.general = shorthand.bind(undefined, 'general')

module.exports.verify = verify
