const { generateKeyPairSync, createSecretKey } = require('crypto')

// TODO: keep an eye out for utils.isCryptoKeyObject() for verifying inputs are already KeyObjects
const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

const PrivateKeyObject = privateKey.constructor
const PublicKeyObject = publicKey.constructor
const SecretKeyObject = createSecretKey(Buffer.allocUnsafe(1)).constructor

module.exports = { PrivateKeyObject, PublicKeyObject, SecretKeyObject }
