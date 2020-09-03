const Encrypt = require('./encrypt')
const decrypt = require('./decrypt')

const single = (serialization, cleartext, key, protectedHeader, aad, unprotectedHeader) => {
  return new Encrypt(cleartext, protectedHeader, aad, unprotectedHeader)
    .recipient(key)
    .encrypt(serialization)
}

module.exports.Encrypt = Encrypt
module.exports.encrypt = single.bind(undefined, 'compact')
module.exports.encrypt.flattened = single.bind(undefined, 'flattened')
module.exports.encrypt.general = single.bind(undefined, 'general')

module.exports.decrypt = decrypt
