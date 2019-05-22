// rename 'secp256k1' to 'P-256K'

const { rename } = require('../lib/jwk/key/secp256k1_crv')
rename('P-256K')

module.exports = require('../lib')
