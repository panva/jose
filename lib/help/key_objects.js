const { generateKeyPairSync, createSecretKey } = require('crypto')

// TODO: reach out to @tniessen to request constructors being exposed for this exact purpose
//       (verifying inputs are already KeyObjects)
// TODO: what's the least blocking way to get to the constructors
const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

const PrivateKeyObject = privateKey.constructor
const PublicKeyObject = publicKey.constructor
const SecretKeyObject = createSecretKey(Buffer.allocUnsafe(1)).constructor

module.exports = { PrivateKeyObject, PublicKeyObject, SecretKeyObject }
