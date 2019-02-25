const Sign = require('./sign')
const verify = require('./verify')

const single = (serialization, payload, key, protectedHeader, unprotectedHeader) => {
  const jws = new Sign(payload)
  jws.recipient(key, protectedHeader, unprotectedHeader)
  return jws.sign(serialization)
}

module.exports.Sign = Sign
module.exports.sign = single.bind(undefined, 'compact')
module.exports.sign.flattened = single.bind(undefined, 'flattened')
module.exports.sign.general = single.bind(undefined, 'general')

module.exports.verify = verify
