const { name: secp256k1 } = require('../jwk/key/secp256k1_crv')

module.exports.KEYOBJECT = Symbol('KEYOBJECT')
module.exports.PRIVATE_MEMBERS = Symbol('PRIVATE_MEMBERS')
module.exports.PUBLIC_MEMBERS = Symbol('PUBLIC_MEMBERS')
module.exports.THUMBPRINT_MATERIAL = Symbol('THUMBPRINT_MATERIAL')
module.exports.JWK_MEMBERS = Symbol('JWK_MEMBERS')
module.exports.KEY_MANAGEMENT_ENCRYPT = Symbol('KEY_MANAGEMENT_ENCRYPT')
module.exports.KEY_MANAGEMENT_DECRYPT = Symbol('KEY_MANAGEMENT_DECRYPT')

const USES_MAPPING = {
  sig: new Set(['sign', 'verify']),
  enc: new Set(['encrypt', 'decrypt', 'wrapKey', 'unwrapKey', 'deriveKey'])
}
const OPS = new Set([...USES_MAPPING.sig, ...USES_MAPPING.enc])
const USES = new Set(Object.keys(USES_MAPPING))

module.exports.USES_MAPPING = USES_MAPPING
module.exports.OPS = OPS
module.exports.USES = USES

module.exports.OKP_CURVES = new Set(['Ed25519', 'Ed448', 'X25519', 'X448'])
module.exports.EC_CURVES = new Set(['P-256', secp256k1, 'P-384', 'P-521'])
module.exports.ECDH_ALGS = ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']

module.exports.KEYLENGTHS = {
  'A128CBC-HS256': 256,
  'A192CBC-HS384': 384,
  'A256CBC-HS512': 512,
  'A128GCM': 128,
  'A192GCM': 192,
  'A256GCM': 256
}
