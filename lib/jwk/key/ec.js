const { generateKeyPairSync, generateKeyPair: async } = require('crypto')
const { promisify } = require('util')

const {
  THUMBPRINT_MATERIAL, JWK_MEMBERS, PUBLIC_MEMBERS, EC_CURVES,
  PRIVATE_MEMBERS, KEY_MANAGEMENT_DECRYPT, KEY_MANAGEMENT_ENCRYPT, ECDH_ALGS
} = require('../../help/consts')
const { keyObjectSupported } = require('../../help/runtime_support')
const { createPublicKey, createPrivateKey } = require('../../help/key_object')

const errors = require('../../errors')
const { name: secp256k1 } = require('./secp256k1_crv')

const Key = require('./base')

const generateKeyPair = promisify(async)

const EC_PUBLIC = new Set(['crv', 'x', 'y'])
Object.freeze(EC_PUBLIC)
const EC_PRIVATE = new Set([...EC_PUBLIC, 'd'])
Object.freeze(EC_PRIVATE)

const crvToDSA = (crv) => {
  switch (crv) {
    case 'P-256':
      return 'ES256'
    case secp256k1:
      return 'ES256K'
    case 'P-384':
      return 'ES384'
    case 'P-521':
      return 'ES512'
  }
}

// Elliptic Curve Key Type
class ECKey extends Key {
  constructor (...args) {
    super(...args)
    this[JWK_MEMBERS]()
    Object.defineProperty(this, 'kty', {
      value: 'EC',
      enumerable: true
    })
    if (!this.crv) {
      throw new errors.JOSENotSupported('unsupported EC key curve')
    }
  }

  static get [PUBLIC_MEMBERS] () {
    return EC_PUBLIC
  }

  static get [PRIVATE_MEMBERS] () {
    return EC_PRIVATE
  }

  // https://tc39.github.io/ecma262/#sec-ordinaryownpropertykeys no need for any special
  // JSON.stringify handling in V8
  [THUMBPRINT_MATERIAL] () {
    return { crv: this.crv, kty: 'EC', x: this.x, y: this.y }
  }

  algorithms (operation, /* second argument is private API */ { use = this.use, alg = this.alg, key_ops: ops = this.key_ops } = {}) {
    if (alg) {
      return new Set(this.algorithms(operation, { alg: null }).has(alg) ? [alg] : undefined)
    }

    if (operation === KEY_MANAGEMENT_ENCRYPT) {
      operation = 'deriveKey'
    } else if (operation === KEY_MANAGEMENT_DECRYPT) {
      if (this.public) {
        return new Set()
      }
      operation = 'deriveKey'
    }

    if (operation && ops && !ops.includes(operation)) {
      return new Set()
    }

    switch (operation) {
      case 'wrapKey':
      case 'unwrapKey':
      case 'encrypt':
      case 'decrypt':
        return new Set()
      case 'sign':
        if (this.public || use === 'enc') {
          return new Set()
        }

        return new Set([crvToDSA(this.crv)])
      case 'verify':
        if (use === 'enc') {
          return new Set()
        }

        return new Set([crvToDSA(this.crv)])
      case 'deriveKey':
        if (use === 'sig' || this.crv === secp256k1) {
          return new Set()
        }

        return new Set(ECDH_ALGS)
      case undefined:
        // just the ops needed to return all algs regardless of its use
        return new Set([
          ...this.algorithms('sign'),
          ...this.algorithms('verify'),
          ...this.algorithms('deriveKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
  }

  static async generate (crv = 'P-256', privat = true) {
    if (!EC_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported EC key curve: ${crv}`)
    }

    if (crv === secp256k1 && crv !== 'secp256k1') {
      crv = 'secp256k1'
    }

    let privateKey, publicKey

    if (keyObjectSupported) {
      ({ privateKey, publicKey } = await generateKeyPair('ec', { namedCurve: crv }))
      return privat ? privateKey : publicKey
    }

    ({ privateKey, publicKey } = await generateKeyPair('ec', {
      namedCurve: crv,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }))

    if (privat) {
      return createPrivateKey(privateKey)
    } else {
      return createPublicKey(publicKey)
    }
  }

  static generateSync (crv = 'P-256', privat = true) {
    if (!EC_CURVES.has(crv)) {
      throw new errors.JOSENotSupported(`unsupported EC key curve: ${crv}`)
    }

    if (crv === secp256k1 && crv !== 'secp256k1') {
      crv = 'secp256k1'
    }

    let privateKey, publicKey

    if (keyObjectSupported) {
      ({ privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: crv }))
      return privat ? privateKey : publicKey
    }

    ({ privateKey, publicKey } = generateKeyPairSync('ec', {
      namedCurve: crv,
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

module.exports = ECKey
