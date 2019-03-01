const { randomBytes, createSecretKey } = require('crypto')

const base64url = require('../../help/base64url')
const { KEYOBJECT } = require('../../help/consts')
const {
  THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS,
  KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT
} = require('../../help/consts')

const Key = require('./base')

const ENC_ALGS = new Set(['A128CBC-HS256', 'A128GCM', 'A192CBC-HS384', 'A192GCM', 'A256CBC-HS512', 'A256GCM'])
const ENC_LEN = new Set([128, 192, 256, 384, 512])
const WRAP_LEN = new Set([128, 192, 256])

const OCT_PUBLIC = new Set()
Object.freeze(OCT_PUBLIC)
const OCT_PRIVATE = new Set(['k'])
Object.freeze(OCT_PRIVATE)

// Octet sequence Key Type
class OctKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      kty: {
        value: 'oct',
        enumerable: true
      },
      length: {
        value: this[KEYOBJECT] ? this[KEYOBJECT].symmetricKeySize * 8 : undefined
      },
      k: {
        enumerable: false,
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

  // https://tc39.github.io/ecma262/#sec-ordinaryownpropertykeys no need for any special
  // JSON.stringify handling in V8
  [THUMBPRINT_MATERIAL] () {
    if (!this[KEYOBJECT]) {
      throw new TypeError('reference "oct" keys without "k" cannot have their thumbprint calculated')
    }
    return { k: this.k, kty: 'oct' }
  }

  algorithms (operation, /* second argument is private API */ { use = this.use, alg = this.alg, key_ops: ops = this.key_ops } = {}) {
    if (!this[KEYOBJECT]) {
      return new Set()
    }

    if (operation === KEY_MANAGEMENT_ENCRYPT || operation === KEY_MANAGEMENT_DECRYPT) {
      return new Set([
        ...this.algorithms('wrapKey'),
        ...this.algorithms('deriveKey')
      ])
    }

    if (operation && ops && !ops.includes(operation)) {
      return new Set()
    }

    if (alg) {
      return new Set(this.algorithms(operation, { alg: null }).has(alg) ? [alg] : undefined)
    }

    switch (operation) {
      case 'deriveKey':
        if (use === 'sig') {
          return new Set()
        }

        return new Set(['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'])
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

        return new Set(['HS256', 'HS384', 'HS512'])
      case 'wrapKey':
      case 'unwrapKey':
        if (use === 'sig' || !WRAP_LEN.has(this.length)) {
          return new Set()
        }

        return new Set([`A${this.length}KW`, `A${this.length}GCMKW`])
      case undefined:
        return new Set([
          // just the ops needed to return all algs regardless of its use - symmetric keys
          ...this.algorithms('encrypt'),
          ...this.algorithms('decrypt'),
          ...this.algorithms('sign'),
          ...this.algorithms('verify'),
          ...this.algorithms('wrapKey'),
          ...this.algorithms('unwrapKey'),
          ...this.algorithms('deriveKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (...args) {
    return this.generateSync(...args)
  }

  static generateSync (len = 256, privat = true) {
    if (!privat) {
      throw new TypeError('"oct" keys cannot be generated as public')
    }
    if (!Number.isSafeInteger(len) || !len || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    return createSecretKey(randomBytes(len / 8))
  }
}

module.exports = OctKey
