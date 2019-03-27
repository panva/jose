const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS, JWK_MEMBERS } = require('../../help/symbols')
const errors = require('../../errors')

const Key = require('./base')

const generateKeyPair = promisify(async)

const WRAP_ALGS = ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']

const EC_PUBLIC = new Set(['crv', 'x', 'y'])
Object.freeze(EC_PUBLIC)
const EC_PRIVATE = new Set([...EC_PUBLIC, 'd'])
Object.freeze(EC_PRIVATE)

const crvToDSA = (crv) => {
  switch (crv) {
    case 'P-256':
      return 'ES256'
    case 'P-256K':
      return 'ES256K'
    case 'P-384':
      return 'ES384'
    case 'P-521':
      return 'ES512'
  }
}

// Elliptic Curve Key Type
class ECKey extends Key {
  constructor (...args) {
    super(...args)
    this[JWK_MEMBERS]()
    Object.defineProperty(this, 'kty', {
      value: 'EC',
      enumerable: true
    })
    if (!this.crv) {
      throw new errors.JOSENotSupported('unsupported EC key curve')
    }
  }

  static get [PUBLIC_MEMBERS] () {
    return EC_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return EC_PRIVATE
  }

  [THUMBPRINT_MATERIAL] () {
    return { crv: this.crv, kty: 'EC', x: this.x, y: this.y }
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
        if (this.public || use === 'enc') {
          return new Set()
        }

        return new Set([crvToDSA(this.crv)])
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return new Set([crvToDSA(this.crv)])
      case 'wrapKey':
        if (use === 'sig') {
          return new Set()
        }

        return new Set(WRAP_ALGS)
      case 'unwrapKey':
        if (this.public || use === 'sig') {
          return new Set()
        }

        return new Set(WRAP_ALGS)
      case undefined:
        // just the ops needed to return all algs regardless of its use
        return new Set([
          ...this.algorithms('verify'),
          ...this.algorithms('wrapKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (crv = 'P-256', privat = true) {
    if (crv === 'P-256K') {
      crv = 'secp256k1'
    }
    const { privateKey, publicKey } = await generateKeyPair('ec', { namedCurve: crv })

    return privat ? privateKey : publicKey
  }

  static generateSync (crv = 'P-256', privat = true) {
    if (crv === 'P-256K') {
      crv = 'secp256k1'
    }
    const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: crv })

    return privat ? privateKey : publicKey
  }
}

module.exports = ECKey
