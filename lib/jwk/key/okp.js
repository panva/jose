const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const {
  THUMBPRINT_MATERIAL, JWK_MEMBERS, PUBLIC_MEMBERS, PRIVATE_MEMBERS
} = require('../../help/symbols')
const errors = require('../../errors')

const Key = require('./base')
const OKP_CURVES = new Set(['Ed25519', 'Ed448', 'X25519', 'X448'])

const generateKeyPair = promisify(async)

// const WRAP_ALGS = ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']

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

  [THUMBPRINT_MATERIAL] () {
    return { crv: this.crv, kty: 'OKP', x: this.x }
  }

  algorithms (operation, { use = this.use, alg = this.alg } = {}) {
    if (alg) {
      return new Set(this.algorithms(operation, { alg: null, use }).has(alg) ? [alg] : undefined)
    }

    switch (operation) {
      case 'encrypt':
      case 'decrypt':
        return new Set()
      case 'sign':
        if (this.public || use === 'enc' || this.crv.startsWith('X')) {
          return new Set()
        }

        return new Set(['EdDSA'])
      case 'verify':
        if (use === 'enc' || this.crv.startsWith('X')) {
          return new Set()
        }

        return new Set(['EdDSA'])
      case 'wrapKey':
        if (use === 'sig' || this.crv.startsWith('Ed')) {
          return new Set()
        }

        // return new Set(WRAP_ALGS)
        return new Set()
      case 'unwrapKey':
        if (this.public || use === 'sig' || this.crv.startsWith('Ed')) {
          return new Set()
        }

        // return new Set(WRAP_ALGS)
        return new Set()
      case undefined:
        return new Set([
          ...this.algorithms('verify'),
          ...this.algorithms('wrapKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (crv = 'Ed25519', privat = true) {
    if (!OKP_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported OKP key curve: ${crv}`)
    }

    const { privateKey, publicKey } = await generateKeyPair(crv.toLowerCase())

    return privat ? privateKey : publicKey
  }

  static generateSync (crv = 'Ed25519', privat = true) {
    if (!OKP_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported OKP key curve: ${crv}`)
    }

    const { privateKey, publicKey } = generateKeyPairSync(crv.toLowerCase())

    return privat ? privateKey : publicKey
  }
}

module.exports = OKPKey
