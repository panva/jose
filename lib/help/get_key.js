const errors = require('../errors')
const Key = require('../jwk/key/base')
const importKey = require('../jwk/import')
const { KeyStore } = require('../jwks/keystore')

module.exports = (input, keyStoreAllowed = false) => {
  if (input instanceof Key) {
    return input
  }

  if (input instanceof KeyStore) {
    if (!keyStoreAllowed) {
      throw new TypeError('key argument for this operation must not be a JWKS.KeyStore instance')
    }

    return input
  }

  try {
    return importKey(input)
  } catch (err) {
    if (err instanceof errors.JOSEError && !(err instanceof errors.JWKImportFailed)) {
      throw err
    }

    let msg
    if (keyStoreAllowed) {
      msg = 'key must be an instance of a key instantiated by JWK.asKey, a valid JWK.asKey input, or a JWKS.KeyStore instance'
    } else {
      msg = 'key must be an instance of a key instantiated by JWK.asKey, or a valid JWK.asKey input'
    }

    throw new TypeError(msg)
  }
}
