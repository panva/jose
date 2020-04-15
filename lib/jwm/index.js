const encrypt = require('./encrypt')
const decrypt = require('./decrypt')
const inspect = require('./inspect')

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
module.exports.inspect = inspect

// TODO: inspection methods to validate that it is a JWM, and
//   what form it is (JWS/JWE), which serialization (compact, general)
//   and retrieve the kids of the recipients for a JWE.
