const asn1 = require('asn1.js')

const types = new Map()

const AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', require('./algorithm_identifier'))
types.set('AlgorithmIdentifier', AlgorithmIdentifier)

const ECPrivateKey = asn1.define('ECPrivateKey', require('./ec_private_key'))
types.set('ECPrivateKey', ECPrivateKey)

const PrivateKeyInfo = asn1.define('PrivateKeyInfo', require('./private_key_info')(AlgorithmIdentifier))
types.set('PrivateKeyInfo', PrivateKeyInfo)

const PublicKeyInfo = asn1.define('PublicKeyInfo', require('./public_key_info')(AlgorithmIdentifier))
types.set('PublicKeyInfo', PublicKeyInfo)

const RSAPrivateKey = asn1.define('RSAPrivateKey', require('./rsa_private_key'))
types.set('RSAPrivateKey', RSAPrivateKey)

const RSAPublicKey = asn1.define('RSAPublicKey', require('./rsa_public_key'))
types.set('RSAPublicKey', RSAPublicKey)

module.exports = types
module.exports.BN = asn1.bignum
