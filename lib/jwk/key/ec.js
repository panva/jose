const { promisify } = require('util')
const generateKeyPair = promisify(require('crypto').generateKeyPair)

const Key = require('./base')

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
}

module.exports = ECKey
