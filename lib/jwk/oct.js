const { timingSafeEqual, createHmac } = require('crypto')

const Key = require('./base')
const base64url = require('../help/base64url')

const SIG_ALGS = new Set([
  'HS256',
  'HS384',
  'HS512'
])

class OctKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        value: this.keyObject.symmetricKeySize * 8
      },
      k: {
        value: base64url.encode(this.keyObject.export()),
        enumerable: true
      }
    })
  }

  thumbprintMaterial () {
    return { k: this.k, kty: 'oct' }
  }

  algorithms (operation) {
    // TODO: operation empty, return all supported or throw

    switch (operation) {
      case 'sign':
        if (this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(SIG_ALGS)
      case 'verify':
        if (this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(SIG_ALGS)
      default:
        return new Set([])
    }
  }

  // TODO: move to jwa
  signAlg (alg) {
    switch (alg) {
      case 'HS256':
        return 'sha256'
      case 'HS384':
        return 'sha384'
      case 'HS512':
        return 'sha512'
      default:
        throw new Error('invalid alg')
    }
  }

  sign (alg, payload) {
    if (!this.algorithms('sign').has(alg)) {
      throw new Error('the key does not support this signing algorithm')
    }
    const hmac = createHmac(this.signAlg(alg), this.keyObject)
    hmac.update(payload)

    return hmac.digest()
  }

  verify (alg, payload, signature) {
    if (!this.algorithms('verify').has(alg)) {
      throw new Error('the key does not support this verify algorithm')
    }
    const hmac = createHmac(this.signAlg(alg), this.keyObject)
    hmac.update(payload)
    const expected = hmac.digest()
    const actual = signature

    if (expected.length !== actual.length) {
      return timingSafeEqual(actual, Buffer.allocUnsafe(actual.length))
    }

    return timingSafeEqual(actual, expected)
  }
}

module.exports = OctKey
