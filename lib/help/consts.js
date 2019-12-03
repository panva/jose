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
