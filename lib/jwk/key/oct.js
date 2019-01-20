const { randomBytes, createSecretKey } = require('crypto')

const Key = require('./base')
const base64url = require('../../help/base64url')

const SIG_ALGS = new Set([
  'HS256',
  'HS384',
  'HS512'
])

const ENC_LEN = new Set([
  128,
  192,
  256,
  384,
  512
])

const ENC_ALGS = new Set([
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512'
])

const WRAP_LEN = new Set([
  128,
  192,
  256
])

const WRAP_ALGS = new Set([
  'A128KW',
  'A192KW',
  'A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'PBES2-HS256+A128KW',
  'PBES2-HS384+A192KW',
  'PBES2-HS512+A256KW',
  'dir'
])

class OctKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        value: this.keyObject.symmetricKeySize * 8
      },
      k: {
        enumerable: true,
        get () {
          Object.defineProperty(this, 'k', {
            value: base64url.encode(this.keyObject.export()),
            configurable: false
          })

          return this.k
        },
        configurable: true
      }
    })
  }

  thumbprintMaterial () {
    return { k: this.k, kty: 'oct' }
  }

  algorithms (operation) {
    switch (operation) {
      case 'encrypt':
      case 'decrypt':
        if (this.use === 'sig' || !ENC_LEN.has(this.length)) {
          return new Set()
        }

        if (this.alg) {
          return new Set(ENC_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set([`A${this.length / 2}CBC-HS${this.length}`, `A${this.length}GCM`].filter(a => ENC_ALGS.has(a)))
      case 'sign':
      case 'verify':
        if (this.use === 'enc') {
          return new Set()
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(SIG_ALGS)
      case 'wrapKey':
      case 'unwrapKey':
        if (this.use === 'sig') {
          return new Set()
        }

        if (this.alg) {
          return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : [])
        }

        const algs = new Set(['dir', 'PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'])

        if (WRAP_LEN.has(this.length)) {
          algs.add(`A${this.length}KW`)
          algs.add(`A${this.length}GCMKW`)
        }

        return algs
      case undefined:
        return new Set([
          ...this.algorithms('encrypt'),
          ...this.algorithms('sign'),
          ...this.algorithms('wrapKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (len = 256, opts) {
    if (!Number.isSafeInteger(len) || !len || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }
    return new OctKey(createSecretKey(randomBytes(len / 8)), opts)
  }
}

module.exports = OctKey
