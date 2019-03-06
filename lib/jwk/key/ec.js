const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS } = require('../../help/symbols')

const Key = require('./base')

const generateKeyPair = promisify(async)
const WRAP_ALGS = new Set([
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW'
])

const EC_PUBLIC = new Set(['crv', 'x', 'y'])
Object.freeze(EC_PUBLIC)
const EC_PRIVATE = new Set([...EC_PUBLIC, 'd'])
Object.freeze(EC_PRIVATE)

class ECKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        get () {
          Object.defineProperty(this, 'length', {
            value: parseInt(this.crv.substring(2), 10),
            configurable: false
          })

          return this.length
        },
        configurable: true
      }
    })
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

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
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
        return new Set([
          ...this.algorithms('sign'),
          ...this.algorithms('verify'),
          ...this.algorithms('wrapKey'),
          ...this.algorithms('unwrapKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (crv = 'P-256', opts, privat = true) {
    const { privateKey, publicKey } = await generateKeyPair('ec', { namedCurve: crv })

    return new ECKey(privat ? privateKey : publicKey, opts)
  }

  static generateSync (crv = 'P-256', opts, privat = true) {
    const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: crv })

    return new ECKey(privat ? privateKey : publicKey, opts)
  }
}

module.exports = ECKey
