const { createPublicKey, createPrivateKey, createSecretKey } = require('crypto')

const Key = require('./key/base')
const RSAKey = require('./key/rsa')
const ECKey = require('./key/ec')
const OctKey = require('./key/oct')
const base64url = require('../help/base64url')
const { TODO } = require('../errors')

const { PrivateKeyObject, PublicKeyObject, SecretKeyObject } = require('../help/key_objects')
const { jwkToPem } = require('../help/key_utils')

function importKey (key, opts) {
  let privateKey, publicKey, secret
  if (key instanceof Key) {
    // TODO: carry over opts from the Key instance
    if (key.private) {
      privateKey = key.keyObject
    } else if (key.public) {
      publicKey = key.keyObject
    } else { // secret
      secret = key.keyObject
    }
  } else if (key instanceof PrivateKeyObject) {
    privateKey = key
  } else if (key instanceof PublicKeyObject) {
    publicKey = key
  } else if (key instanceof SecretKeyObject) {
    secret = createSecretKey(key.export())
  } else if (key && key.kty === 'oct') { // symmetric key <Object>
    // TODO: carry over opts from the JWK
    secret = createSecretKey(base64url.decodeToBuffer(key.k))
  } else if (key && key.kty) { // assume JWK formatted asymmetric key <Object>
    let parsedJWK
    try {
      // TODO: carry over opts from the JWK
      parsedJWK = jwkToPem(key)
    } catch (err) {}
    if (parsedJWK && key.d) {
      privateKey = createPrivateKey(parsedJWK)
    } else if (parsedJWK) {
      publicKey = createPublicKey(parsedJWK)
    }
  } else { // <Object> | <string> | <Buffer> passed to crypto.createPrivateKey or crypto.createPublicKey or <Buffer> passed to crypto.createSecretKey
    try {
      privateKey = createPrivateKey(key)
    } catch (err) {}
    try {
      publicKey = createPublicKey(key)
    } catch (err) {}
    try {
      secret = createSecretKey(Buffer.isBuffer(key) ? key : Buffer.from(key))
    } catch (err) {}
  }

  if (!privateKey && !publicKey && !secret) {
    throw new TODO('import failed')
  }

  const keyObject = privateKey || publicKey || secret

  switch (keyObject.asymmetricKeyType) {
    case 'rsa':
      return new RSAKey(keyObject, opts)
    case 'ec':
      return new ECKey(keyObject, opts)
    default:
      return new OctKey(keyObject, opts)
  }
}

module.exports = importKey
