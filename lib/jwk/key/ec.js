const { promisify } = require('util')
const generateKeyPair = promisify(require('crypto').generateKeyPair)

const Key = require('./base')

const SIG_ALGS = new Set([
  'ES256',
  'ES384',
  'ES512'
])

const WRAP_ALGS = new Set([
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW'
])

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

  thumbprintMaterial () {
    return { crv: this.crv, kty: 'EC', x: this.x, y: this.y }
  }

  algorithms (operation) {
    switch (operation) {
      case 'encrypt':
      case 'decrypt':
        return new Set()
      case 'sign':
        if (this.public || this.use === 'enc') {
          return new Set()
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : undefined)
        }

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
      case 'verify':
        if (this.use === 'enc') {
          return new Set()
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : undefined)
        }

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
      case 'wrapKey':
        if (this.use === 'sig') {
          return new Set()
        }

        if (this.alg) {
          return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : undefined)
        }

        return new Set(WRAP_ALGS)
      case 'unwrapKey':
        if (this.public || this.use === 'sig') {
          return new Set()
        }

        if (this.alg) {
          return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : undefined)
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
}

module.exports = ECKey
