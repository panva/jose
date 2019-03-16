const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS, JWK_MEMBERS } = require('../../help/symbols')

const Key = require('./base')

const generateKeyPair = promisify(async)
const SIG_ALGS = new Set([
  'PS256',
  'RS256',
  'PS384',
  'RS384',
  'PS512',
  'RS512'
])

const WRAP_ALGS = new Set([
  'RSA-OAEP',
  'RSA1_5'
])

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

  [THUMBPRINT_MATERIAL] () {
    return { e: this.e, kty: 'RSA', n: this.n }
  }

  algorithms (operation, { use = this.use, alg = this.alg } = {}) {
    if (this.length < 2048) {
      return new Set()
    }

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

        return new Set(SIG_ALGS)
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return new Set(SIG_ALGS)
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

  static async generate (len = 2048, opts, privat = true) {
    if (!Number.isSafeInteger(len) || len < 2048 || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    const { privateKey, publicKey } = await generateKeyPair('rsa', { modulusLength: len })

    return new RSAKey(privat ? privateKey : publicKey, opts)
  }

  static generateSync (len = 2048, opts, privat = true) {
    if (!Number.isSafeInteger(len) || len < 2048 || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: len })

    return new RSAKey(privat ? privateKey : publicKey, opts)
  }
}

module.exports = RSAKey
