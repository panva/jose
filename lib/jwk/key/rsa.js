const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const {
  THUMBPRINT_MATERIAL, JWK_MEMBERS, PUBLIC_MEMBERS,
  PRIVATE_MEMBERS, KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT
} = require('../../help/consts')
const { keyObjectSupported } = require('../../help/runtime_support')
const { createPublicKey, createPrivateKey } = require('../../help/key_object')

const Key = require('./base')

const generateKeyPair = promisify(async)

const RSA_PUBLIC = new Set(['e', 'n'])
Object.freeze(RSA_PUBLIC)
const RSA_PRIVATE = new Set([...RSA_PUBLIC, 'd', 'p', 'q', 'dp', 'dq', 'qi'])
Object.freeze(RSA_PRIVATE)

// RSA Key Type
class RSAKey extends Key {
  constructor (...args) {
    super(...args)
    this[JWK_MEMBERS]()
    Object.defineProperties(this, {
      kty: {
        value: 'RSA',
        enumerable: true
      },
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

  static get [PUBLIC_MEMBERS] () {
    return RSA_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return RSA_PRIVATE
  }

  // https://tc39.github.io/ecma262/#sec-ordinaryownpropertykeys no need for any special
  // JSON.stringify handling in V8
  [THUMBPRINT_MATERIAL] () {
    return { e: this.e, kty: 'RSA', n: this.n }
  }

  [KEY_MANAGEMENT_ENCRYPT] () {
    return this.algorithms('wrapKey')
  }

  [KEY_MANAGEMENT_DECRYPT] () {
    return this.algorithms('unwrapKey')
  }

  static async generate (len = 2048, privat = true) {
    if (!Number.isSafeInteger(len) || len < 512 || len % 8 !== 0 || (('electron' in process.versions) && len % 128 !== 0)) {
      throw new TypeError('invalid bit length')
    }

    let privateKey, publicKey

    if (keyObjectSupported) {
      ({ privateKey, publicKey } = await generateKeyPair('rsa', { modulusLength: len }))
      return privat ? privateKey : publicKey
    }

    ({ privateKey, publicKey } = await generateKeyPair('rsa', {
      modulusLength: len,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }))

    if (privat) {
      return createPrivateKey(privateKey)
    } else {
      return createPublicKey(publicKey)
    }
  }

  static generateSync (len = 2048, privat = true) {
    if (!Number.isSafeInteger(len) || len < 512 || len % 8 !== 0 || (('electron' in process.versions) && len % 128 !== 0)) {
      throw new TypeError('invalid bit length')
    }

    let privateKey, publicKey

    if (keyObjectSupported) {
      ({ privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: len }))
      return privat ? privateKey : publicKey
    }

    ({ privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: len,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }))

    if (privat) {
      return createPrivateKey(privateKey)
    } else {
      return createPublicKey(publicKey)
    }
  }
}

module.exports = RSAKey
