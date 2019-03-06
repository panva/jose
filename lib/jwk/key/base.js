const { keyObjectToJWK } = require('../../help/key_utils')
const { THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS } = require('../../help/symbols')
const { KEYOBJECT } = require('../../help/symbols')
const isObject = require('../../help/is_object')
const thumbprint = require('../thumbprint')

const USES = new Set(['sig', 'enc'])

const defineLazyComponents = (obj) => {
  const props = obj[KEYOBJECT].type === 'private' ? obj.constructor[PRIVATE_MEMBERS] : obj.constructor[PUBLIC_MEMBERS]
  Object.defineProperties(obj, [...props].reduce((acc, component) => {
    acc[component] = {
      get () {
        const jwk = keyObjectToJWK(this[KEYOBJECT])
        Object.defineProperties(
          this,
          Object.entries(jwk)
            .filter(([key]) => props.has(key))
            .reduce((acc, [key, value]) => {
              acc[key] = { value, enumerable: true, configurable: false }
              return acc
            }, {})
        )

        return this[component]
      },
      enumerable: true,
      configurable: true
    }
    return acc
  }, {}))
}

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
      kty: { value: keyObject.type === 'secret' ? 'oct' : keyObject.asymmetricKeyType.toUpperCase(), enumerable: true },
      private: { value: keyObject.type === 'private', enumerable: keyObject.type === 'private' },
      public: { value: keyObject.type === 'public', enumerable: keyObject.type === 'public' },
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

    if (keyObject.type !== 'secret') {
      defineLazyComponents(this)
    }
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

    const result = Object.entries(this).reduce((acc, [prop, value]) => {
      if (members.has(prop)) {
        acc[prop] = value
      }

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
