const { keyObjectToJWK } = require('../../help/key_utils')
const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS, JWK_MEMBERS } = require('../../help/symbols')
const { KEYOBJECT } = require('../../help/symbols')
const isObject = require('../../help/is_object')
const thumbprint = require('../thumbprint')

const USES = new Set(['sig', 'enc'])

class Key {
  constructor (keyObject, { alg, use, kid } = {}) {
    if (use !== undefined) {
      if (typeof use !== 'string' || !USES.has(use)) {
        throw new TypeError('`use` must be either "sig" or "enc" string when provided')
      }
    }

    if (alg !== undefined) {
      if (typeof alg !== 'string' || !alg) {
        throw new TypeError('`alg` must be a non-empty string when provided')
      }
    }

    if (kid !== undefined) {
      if (typeof kid !== 'string' || !kid) {
        throw new TypeError('`kid` must be a non-empty string when provided')
      }
    }

    Object.defineProperties(this, {
      [KEYOBJECT]: { value: isObject(keyObject) ? undefined : keyObject },
      type: { value: keyObject.type },
      private: { value: keyObject.type === 'private' },
      public: { value: keyObject.type === 'public' },
      secret: { value: keyObject.type === 'secret' },
      alg: { value: alg, enumerable: alg !== undefined },
      use: { value: use, enumerable: use !== undefined },
      kid: {
        enumerable: true,
        ...(kid ? { value: kid } : {
          get () {
            Object.defineProperty(this, 'kid', { value: thumbprint.kid(this[THUMBPRINT_MATERIAL]()), configurable: false })
            return this.kid
          },
          configurable: true
        })
      }
    })
  }

  toJWK (priv = false) {
    if (priv && this.public === true) {
      throw new TypeError('public key cannot be exported as private')
    }

    let members
    if (priv) {
      members = this.constructor[PRIVATE_MEMBERS]
    } else {
      members = this.constructor[PUBLIC_MEMBERS]
    }

    const result = [...members].reduce((acc, key) => {
      acc[key] = this[key]
      return acc
    }, { kty: this.kty, kid: this.kid })

    if (this.alg) {
      result.alg = this.alg
    }

    if (this.use) {
      result.use = this.use
    }

    return result
  }

  [JWK_MEMBERS] () {
    const props = this[KEYOBJECT].type === 'private' ? this.constructor[PRIVATE_MEMBERS] : this.constructor[PUBLIC_MEMBERS]
    Object.defineProperties(this, [...props].reduce((acc, component) => {
      acc[component] = {
        get () {
          const jwk = keyObjectToJWK(this[KEYOBJECT])
          Object.defineProperties(
            this,
            Object.entries(jwk)
              .filter(([key]) => props.has(key))
              .reduce((acc, [key, value]) => {
                acc[key] = { value, enumerable: this.constructor[PUBLIC_MEMBERS].has(key), configurable: false }
                return acc
              }, {})
          )

          return this[component]
        },
        enumerable: this.constructor[PUBLIC_MEMBERS].has(component),
        configurable: true
      }
      return acc
    }, {}))
  }

  /* istanbul ignore next */
  [THUMBPRINT_MATERIAL] () {
    throw new Error(`"[THUMBPRINT_MATERIAL]()" is not implemented on ${this.constructor.name}`)
  }

  /* istanbul ignore next */
  algorithms () {
    throw new Error(`"algorithms()" is not implemented on ${this.constructor.name}`)
  }

  /* istanbul ignore next */
  static async generate () {
    throw new Error(`"static async generate()" is not implemented on ${this.name}`)
  }

  /* istanbul ignore next */
  static generateSync () {
    throw new Error(`"static generateSync()" is not implemented on ${this.name}`)
  }

  /* istanbul ignore next */
  static get [PUBLIC_MEMBERS] () {
    throw new Error(`"static get [PUBLIC_MEMBERS]()" is not implemented on ${this.name}`)
  }

  /* istanbul ignore next */
  static get [PRIVATE_MEMBERS] () {
    throw new Error(`"static get [PRIVATE_MEMBERS]()" is not implemented on ${this.name}`)
  }
}

module.exports = Key
