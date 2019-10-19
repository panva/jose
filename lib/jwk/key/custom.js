const {
  JWK_MEMBERS, PUBLIC_MEMBERS, PRIVATE_MEMBERS
} = require('../../help/consts')

const Key = require('./base')

const CUSTOM_PUBLIC = new Set([])
Object.freeze(CUSTOM_PUBLIC)
const CUSTOM_PRIVATE = new Set([...CUSTOM_PUBLIC])
Object.freeze(CUSTOM_PRIVATE)

class CustomKeyObject {
  constructor (params) {
    params = params || {}

    this._type = params.keyType
    this._symmetricKeySize = params.symmetricKeySize || 0
  }

  get type () {
    return this._type
  }

  get symmetricKeySize () {
    return this._symmetricKeySize
  }
}

// Custom Key Type
class CustomKey extends Key {
  constructor (params) {
    // { alg, use, kid, key_ops: ops, x5c, x5t, 'x5t#S256', keyType, symmetricKeySize } = {}
    super(new CustomKeyObject(params), Object.assign(params || {}, { custom: true }))
    this[JWK_MEMBERS]()
  }

  static get [PUBLIC_MEMBERS] () {
    return CUSTOM_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return CUSTOM_PRIVATE
  }

  algorithms (operation, /* second argument is private API */ { use = this.use, alg = this.alg, key_ops: ops = this.key_ops } = {}) {
    // Should override
  }
}

module.exports = CustomKey
