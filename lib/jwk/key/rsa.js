const { promisify } = require('util')
const generateKeyPair = promisify(require('crypto').generateKeyPair)

const Key = require('./base')

const SIG_ALGS = new Set([
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512'
])

const WRAP_ALGS = new Set([
  'RSA-OAEP',
  'RSA1_5'
])

class RSAKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        get () {
          Object.defineProperty(this, 'length', {
            value: Buffer.byteLength(this.n, 'base64') * 8,
            configurable: false
          })

          return this.length
        },
        configurable: true
      }
    })
  }

  thumbprintMaterial () {
    return { e: this.e, kty: 'RSA', n: this.n }
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

        return new Set(SIG_ALGS)
      case 'verify':
        if (this.use === 'enc') {
          return new Set()
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : undefined)
        }

        return new Set(SIG_ALGS)
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

  static async generate (len = 2048, opts, privat = true) {
    if (!Number.isSafeInteger(len) || len < 512 || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    const { privateKey, publicKey } = await generateKeyPair('rsa', { modulusLength: len })

    return new RSAKey(privat ? privateKey : publicKey, opts)
  }
}

module.exports = RSAKey
