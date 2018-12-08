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
}

module.exports = OctKey
