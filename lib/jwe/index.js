const Encrypt = require('./encrypt')
const decrypt = require('./decrypt')

// TODO: in v2.x swap unprotectedHeader and aad
const single = (serialization, cleartext, key, protectedHeader, unprotectedHeader, aad) => {
  return new Encrypt(cleartext, protectedHeader, unprotectedHeader, aad)
    .recipient(key)
    .encrypt(serialization)
}

module.exports.Encrypt = Encrypt
module.exports.encrypt = single.bind(undefined, 'compact')
module.exports.encrypt.flattened = single.bind(undefined, 'flattened')
module.exports.encrypt.general = single.bind(undefined, 'general')

module.exports.decrypt = decrypt
