const { randomBytes } = require('crypto')

const { createSecretKey } = require('../../help/key_object')
const base64url = require('../../help/base64url')
const {
  THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS,
  KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT, KEYOBJECT
} = require('../../help/consts')

const Key = require('./base')

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

  [KEY_MANAGEMENT_ENCRYPT] () {
    return new Set([
      ...this.algorithms('wrapKey'),
      ...this.algorithms('deriveKey')
    ])
  }

  [KEY_MANAGEMENT_DECRYPT] () {
    return this[KEY_MANAGEMENT_ENCRYPT]()
  }

  algorithms (...args) {
    if (!this[KEYOBJECT]) {
      return new Set()
    }

    return Key.prototype.algorithms.call(this, ...args)
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
