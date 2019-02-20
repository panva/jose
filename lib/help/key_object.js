const { createSecretKey } = require('crypto')

const SecretKeyObject = Object.getPrototypeOf(createSecretKey(Buffer.allocUnsafe(1)))
const KeyObject = Object.getPrototypeOf(SecretKeyObject).constructor

module.exports = KeyObject
