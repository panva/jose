const { randomBytes, createSecretKey } = require('crypto')

const base64url = require('../../help/base64url')
const { KEYOBJECT } = require('../../help/symbols')
const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS } = require('../../help/symbols')

const Key = require('./base')

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
  'A128CBC-HS256',
  'A128GCM',
  'A192CBC-HS384',
  'A192GCM',
  'A256CBC-HS512',
  'A256GCM'
])

const WRAP_LEN = new Set([
  128,
  192,
  256
])

const OCT_PUBLIC = new Set()
Object.freeze(OCT_PUBLIC)
const OCT_PRIVATE = new Set(['k'])
Object.freeze(OCT_PRIVATE)

class OctKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        value: this[KEYOBJECT] ? this[KEYOBJECT].symmetricKeySize * 8 : undefined
      },
      k: {
        enumerable: true,
        get () {
          if (this[KEYOBJECT]) {
            Object.defineProperty(this, 'k', {
              value: base64url.encodeBuffer(this[KEYOBJECT].export()),
              configurable: false
            })
          } else {
            Object.defineProperty(this, 'k', {
              value: undefined,
              configurable: false
            })
          }

          return this.k
        },
        configurable: true
      }
    })
  }

  static get [PUBLIC_MEMBERS] () {
    return OCT_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return OCT_PRIVATE
  }

  [THUMBPRINT_MATERIAL] () {
    if (!this[KEYOBJECT]) {
      throw new TypeError('reference "oct" keys without "k" cannot have their "kid" calculated')
    }
    return { k: this.k, kty: 'oct' }
  }

  algorithms (operation, { use = this.use, alg = this.alg } = {}) {
    if (!this[KEYOBJECT]) {
      return new Set()
    }

    if (alg) {
      return new Set(this.algorithms(operation, { alg: null, use }).has(alg) ? [alg] : undefined)
    }

    switch (operation) {
      case 'encrypt':
      case 'decrypt':
        if (this.use === 'sig' || !ENC_LEN.has(this.length)) {
          return new Set()
        }

        return new Set([`A${this.length / 2}CBC-HS${this.length}`, `A${this.length}GCM`].filter(a => ENC_ALGS.has(a)))
      case 'sign':
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return new Set(SIG_ALGS)
      case 'wrapKey':
      case 'unwrapKey':
        if (use === 'sig') {
          return new Set()
        }

        const algs = new Set()

        if (WRAP_LEN.has(this.length)) {
          algs.add(`A${this.length}KW`)
          algs.add(`A${this.length}GCMKW`)
        }

        ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'].forEach(Set.prototype.add.bind(algs))

        if (ENC_LEN.has(this.length)) {
          algs.add('dir')
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

  static async generate (...args) {
    return this.generateSync(...args)
  }

  static generateSync (len = 256, opts, privat = true) {
    if (!privat) {
      throw new TypeError('"oct" keys cannot be generated as public')
    }
    if (!Number.isSafeInteger(len) || !len || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }
    return new OctKey(createSecretKey(randomBytes(len / 8)), opts)
  }
}

module.exports = OctKey
