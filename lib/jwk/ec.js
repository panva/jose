const Key = require('./base')

const SIG_ALGS = new Set([
  'ES256',
  'ES384',
  'ES512'
])

// const WRAP_ALGS = new Set([
//   'ECDH-ES',
//   'ECDH-ES+A128KW',
//   'ECDH-ES+A192KW',
//   'ECDH-ES+A256KW'
// ])

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

  thumbprintMaterial () {
    return { crv: this.crv, kty: 'EC', x: this.x, y: this.y }
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

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
      case 'verify':
        if (this.use === 'enc') {
          return new Set([])
        }

        if (this.alg) {
          return new Set(SIG_ALGS.has(this.alg) ? [this.alg] : [])
        }

        return new Set([`ES${this.length === 521 ? 512 : this.length}`])
      // case 'unwrapKey':
      //   if (this.public || this.use === 'sig') {
      //     return new Set([])
      //   }
      //
      //   if (this.alg) {
      //     return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : [])
      //   }
      //
      //   return new Set(WRAP_ALGS)
      // case 'wrapKey':
      //   if (this.use === 'sig') {
      //     return new Set([])
      //   }
      //
      //   if (this.alg) {
      //     return new Set(WRAP_ALGS.has(this.alg) ? [this.alg] : [])
      //   }
      //
      //   return new Set(WRAP_ALGS)
      default:
        return new Set([])
    }
  }
}

module.exports = ECKey
