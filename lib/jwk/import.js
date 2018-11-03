const { createPublicKey, createPrivateKey } = require('crypto')

const Key = require('./base')
const RSAKey = require('./rsa')
const ECKey = require('./ec')

const { PrivateKeyObject, PublicKeyObject } = require('../help/key_objects')
const { jwkToPem } = require('../help/key_utils')

function importKey (key, opts) {
  let privateKey, publicKey
  if (key instanceof Key) {
    if (key.private) {
      privateKey = key.keyObject
    } else if (key.public) {
      publicKey = key.keyObject
    } else { // secret
      // TODO: symmetrical keys
      // secret = key
    }
  } else if (key instanceof PrivateKeyObject) {
    privateKey = key
  } else if (key instanceof PublicKeyObject) {
    publicKey = key
  } else if (key && key.kty) { // assume JWK formatted <Object>
    let parsedJWK
    try {
      parsedJWK = jwkToPem(key)
    } catch (err) {}
    if (parsedJWK && key.d) {
      privateKey = createPrivateKey(parsedJWK)
    } else if (parsedJWK) {
      publicKey = createPublicKey(parsedJWK)
    }
  } else { // <Object> | <string> | <Buffer> passed to crypto.createPrivateKey or crypto.createPublicKey
    try {
      privateKey = createPrivateKey(key)
    } catch (err) {}
    try {
      publicKey = createPublicKey(key)
    } catch (err) {}
  }

  if (!privateKey && !publicKey) {
    throw new Error('import failed')
  }

  const keyObject = privateKey || publicKey

  switch (keyObject.asymmetricKeyType) {
    case 'rsa':
      return new RSAKey(keyObject, opts)
    case 'ec':
      return new ECKey(keyObject, opts)
    default:
  }
}

module.exports = importKey
