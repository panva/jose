const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const {
  THUMBPRINT_MATERIAL, JWK_MEMBERS, PUBLIC_MEMBERS,
  PRIVATE_MEMBERS, KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT
} = require('../../help/consts')
const { OKP_CURVES } = require('../../registry')
const { edDSASupported } = require('../../help/runtime_support')
const errors = require('../../errors')

const Key = require('./base')

const generateKeyPair = promisify(async)

const OKP_PUBLIC = new Set(['crv', 'x'])
Object.freeze(OKP_PUBLIC)
const OKP_PRIVATE = new Set([...OKP_PUBLIC, 'd'])
Object.freeze(OKP_PRIVATE)

// Octet string key pairs Key Type
class OKPKey extends Key {
  constructor (...args) {
    super(...args)

    Object.defineProperties(this, {
      kty: {
        value: 'OKP',
        enumerable: true
      }
    })
    this[JWK_MEMBERS]()
  }

  static get [PUBLIC_MEMBERS] () {
    return OKP_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return OKP_PRIVATE
  }

  // https://tc39.github.io/ecma262/#sec-ordinaryownpropertykeys no need for any special
  // JSON.stringify handling in V8
  [THUMBPRINT_MATERIAL] () {
    return { crv: this.crv, kty: 'OKP', x: this.x }
  }

  [KEY_MANAGEMENT_ENCRYPT] () {
    return this.algorithms('deriveKey')
  }

  [KEY_MANAGEMENT_DECRYPT] () {
    if (this.public) {
      return new Set()
    }
    return this.algorithms('deriveKey')
  }

  static async generate (crv = 'Ed25519', privat = true) {
    if (!edDSASupported) {
      throw new errors.JOSENotSupported('OKP keys are not supported in your Node.js runtime version')
    }

    if (!OKP_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported OKP key curve: ${crv}`)
    }

    const { privateKey, publicKey } = await generateKeyPair(crv.toLowerCase())

    return privat ? privateKey : publicKey
  }

  static generateSync (crv = 'Ed25519', privat = true) {
    if (!edDSASupported) {
      throw new errors.JOSENotSupported('OKP keys are not supported in your Node.js runtime version')
    }

    if (!OKP_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported OKP key curve: ${crv}`)
    }

    const { privateKey, publicKey } = generateKeyPairSync(crv.toLowerCase())

    return privat ? privateKey : publicKey
  }
}

module.exports = OKPKey
