const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const {
  THUMBPRINT_MATERIAL, JWK_MEMBERS, PUBLIC_MEMBERS,
  PRIVATE_MEMBERS, KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT
} = require('../../help/consts')

const Key = require('./base')

const generateKeyPair = promisify(async)

const SIG_ALGS = ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512']
const WRAP_ALGS = ['RSA-OAEP', 'RSA1_5']

const RSA_PUBLIC = new Set(['e', 'n'])
Object.freeze(RSA_PUBLIC)
const RSA_PRIVATE = new Set([...RSA_PUBLIC, 'd', 'p', 'q', 'dp', 'dq', 'qi'])
Object.freeze(RSA_PRIVATE)

const sigAlgsAvailableFor = (length) => {
  switch (true) {
    case length >= 1040:
      return new Set(SIG_ALGS)
    case length >= 784:
      return new Set(['PS256', 'RS256', 'PS384', 'RS384', 'RS512'])
    case length >= 752:
      return new Set(['PS256', 'RS256', 'RS384', 'RS512'])
    case length >= 624:
      return new Set(['PS256', 'RS256', 'RS384'])
    case length >= 528:
      return new Set(['PS256', 'RS256'])
    default:
      return new Set(['RS256'])
  }
}

const wrapAlgsAvailableFor = (length) => {
  if (length >= 592) {
    return new Set(WRAP_ALGS)
  }

  return new Set(['RSA1_5'])
}

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

  algorithms (operation, /* second argument is private API */ { use = this.use, alg = this.alg, key_ops: ops = this.key_ops } = {}) {
    if (alg) {
      return new Set(this.algorithms(operation, { alg: null }).has(alg) ? [alg] : undefined)
    }

    if (operation === KEY_MANAGEMENT_ENCRYPT) {
      operation = 'wrapKey'
    } else if (operation === KEY_MANAGEMENT_DECRYPT) {
      operation = 'unwrapKey'
    }

    if (operation && ops && !ops.includes(operation)) {
      return new Set()
    }

    switch (operation) {
      case 'deriveKey':
      case 'encrypt':
      case 'decrypt':
        return new Set()
      case 'sign':
        if (this.public || use === 'enc') {
          return new Set()
        }

        return sigAlgsAvailableFor(this.length)
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return sigAlgsAvailableFor(this.length)
      case 'wrapKey':
        if (use === 'sig') {
          return new Set()
        }

        return wrapAlgsAvailableFor(this.length)
      case 'unwrapKey':
        if (this.public || use === 'sig') {
          return new Set()
        }

        return wrapAlgsAvailableFor(this.length)
      case undefined:
        // just the ops needed to return all algs regardless of its use
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

  static async generate (len = 2048, privat = true) {
    if (!Number.isSafeInteger(len) || len < 512 || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    const { privateKey, publicKey } = await generateKeyPair('rsa', { modulusLength: len })

    return privat ? privateKey : publicKey
  }

  static generateSync (len = 2048, privat = true) {
    if (!Number.isSafeInteger(len) || len < 512 || len % 8 !== 0) {
      throw new TypeError('invalid bit length')
    }

    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: len })

    return privat ? privateKey : publicKey
  }
}

module.exports = RSAKey
