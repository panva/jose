const { createSign, createVerify } = require('crypto')
const { derToJose, joseToDer } = require('../help/ecdsa_signatures')

const Key = require('./base')

const SIG_ALGS = new Set([
  'ES256',
  'ES384'
  // 'ES512'
])

const WRAP_ALGS = new Set([
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW'
])

class ECKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
      length: {
        get () {
          Object.defineProperty(this, 'length', {
            value: parseInt(this.crv.substring(2), 10),
            configurable: false
          })

          return this.length
        },
        configurable: true
      }
    })
  }

  algorithms (operation) {
    // TODO: operation empty, return all supported or throw

    switch (operation) {
      case 'sign':
        if (this.public || this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set([`ES${this.length}`])
      case 'verify':
        if (this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set([`ES${this.length}`])
      case 'unwrapKey':
        if (this.public || this.use === 'sig') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(WRAP_ALGS)
      case 'wrapKey':
        if (this.use === 'sig') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(WRAP_ALGS)
      default:
        return new Set([])
    }
  }

  // TODO: move to jwa
  signAlg (alg) {
    switch (alg) {
      case 'ES256':
        return 'RSA-SHA256'
      case 'ES384':
        return 'RSA-SHA384'
      // case 'ES512':
      //   return 'RSA-SHA512'
      default:
        throw new Error('invalid alg')
    }
  }

  sign (alg, payload) {
    if (!this.algorithms('sign').has(alg)) {
      throw new Error('the key does not support this signing algorithm')
    }
    const sign = createSign(this.signAlg(alg))
    sign.update(payload)

    return derToJose(sign.sign(this.keyObject), alg)
  }

  verify (alg, payload, signature) {
    if (!this.algorithms('verify').has(alg)) {
      throw new Error('the key does not support this verify algorithm')
    }
    const verify = createVerify(this.signAlg(alg))
    verify.update(payload)

    try {
      return verify.verify(this.keyObject, joseToDer(signature, alg))
    } catch (err) {
      return false
    }
  }
}

module.exports = ECKey
