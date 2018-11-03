const { createSign, createVerify, constants } = require('crypto')

const Key = require('./base')

const SIG_ALGS = new Set([
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512'
])

const WRAP_ALGS = new Set([
  'RSA-OAEP',
  'RSA1_5'
])

class RSAKey extends Key {
  constructor (...args) {
    super(...args)
    Object.defineProperties(this, {
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

        return new Set(SIG_ALGS)
      case 'verify':
        if (this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set(SIG_ALGS)
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
      case 'RS256':
      case 'PS256':
        return 'RSA-SHA256'
      case 'RS384':
      case 'PS384':
        return 'RSA-SHA384'
      case 'RS512':
      case 'PS512':
        return 'RSA-SHA512'
      default:
        throw new Error('invalid alg')
    }
  }

  signPadding (alg) {
    if (alg.startsWith('PS')) {
      return {
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: constants.RSA_PSS_SALTLEN_DIGEST
      }
    }

    return undefined
  }

  sign (alg, payload) {
    if (!this.algorithms('sign').has(alg)) {
      throw new Error('the key does not support this signing algorithm')
    }
    const sign = createSign(this.signAlg(alg))
    sign.update(payload)

    return sign.sign({ key: this.keyObject, ...this.signPadding(alg) })
  }

  verify (alg, payload, signature) {
    if (!this.algorithms('verify').has(alg)) {
      throw new Error('the key does not support this verify algorithm')
    }
    const verify = createVerify(this.signAlg(alg))
    verify.update(payload)

    return verify.verify({ key: this.keyObject, ...this.signPadding(alg) }, signature)
  }
}

module.exports = RSAKey
