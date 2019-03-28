const { createSecretKey, KeyObject } = require('crypto')

if (KeyObject) {
  module.exports = KeyObject
} else {
  const SecretKeyObject = Object.getPrototypeOf(createSecretKey(Buffer.allocUnsafe(1)))
  module.exports = Object.getPrototypeOf(SecretKeyObject).constructor
}
