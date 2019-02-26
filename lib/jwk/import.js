const { createPublicKey, createPrivateKey, createSecretKey } = require('crypto')

const RSAKey = require('./key/rsa')
const ECKey = require('./key/ec')
const OctKey = require('./key/oct')
const base64url = require('../help/base64url')
const errors = require('../errors')
const isObject = require('../help/is_object')

const KeyObject = require('../help/key_object')
const { jwkToPem } = require('../help/key_utils')

const importable = new Set(['string', 'buffer', 'object'])

const mergedParameters = (target = {}, source = {}) => {
  return Object.assign({}, { alg: source.alg, use: source.use, kid: source.kid }, target)
}

const importKey = (key, parameters) => {
  let privateKey, publicKey, secret

  if (!importable.has(typeof key)) {
    throw new TypeError('key argument must be a string, buffer or an object')
  }

  if (parameters !== undefined && !isObject(parameters)) {
    throw new TypeError('parameters argument must be a plain object when provided')
  }

  if (key instanceof KeyObject) {
    if (key.type === 'private') {
      privateKey = key
    } else if (key.type === 'public') {
      publicKey = key
    } else if (key.type === 'secret') {
      secret = key
    } else {
      throw new errors.JOSENotSupported()
    }
  } else if ('kty' in key && key.kty === 'oct') { // symmetric key <Object>
    // TODO: fails to import "unusable" symmetric key
    secret = createSecretKey(base64url.decodeToBuffer(key.k))
    parameters = mergedParameters(parameters, key)
  } else if ('kty' in key) { // assume JWK formatted asymmetric key <Object>
    let parsedJWK
    try {
      parsedJWK = jwkToPem(key)
    } catch (err) {}
    if (parsedJWK && key.d) {
      privateKey = createPrivateKey(parsedJWK)
    } else if (parsedJWK) {
      publicKey = createPublicKey(parsedJWK)
    }
    parameters = mergedParameters(parameters, key)
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
    throw new errors.JWKImportFailed('import failed')
  }

  const keyObject = privateKey || publicKey || secret

  switch (keyObject.asymmetricKeyType) {
    case 'rsa':
      return new RSAKey(keyObject, parameters)
    case 'ec':
      return new ECKey(keyObject, parameters)
    default:
      return new OctKey(keyObject, parameters)
  }
}

module.exports = importKey
