const { pemToJwk } = require('../../help/key_utils')
const thumbprint = require('../thumbprint')
const { TODO } = require('../../errors')

const RSA_PUBLIC = ['e', 'n']
const RSA_PRIVATE = [...RSA_PUBLIC, 'd', 'p', 'q', 'dp', 'dq', 'qi']
const EC_PUBLIC = ['crv', 'x', 'y']
const EC_PRIVATE = [...EC_PUBLIC, 'd']

const props = {
  EC: {
    public: EC_PUBLIC,
    private: EC_PRIVATE
  },
  RSA: {
    public: RSA_PUBLIC,
    private: RSA_PRIVATE
  }
}

const USES = new Set(['sig', 'enc'])

function defineLazyComponents (obj) {
  Object.defineProperties(obj, props[obj.keyObject.asymmetricKeyType.toUpperCase()][obj.keyObject.type].reduce((acc, component) => {
    acc[component] = {
      get () {
        const jwk = pemToJwk(this.keyObject)
        Object.defineProperties(
          this,
          Object.entries(jwk)
            .filter(([key]) => props[this.kty][this.keyObject.type].includes(key))
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
      if (typeof alg !== 'string') {
        throw new TypeError('`alg` must be a string when provided')
      }
    }

    if (kid !== undefined) {
      if (typeof kid !== 'string') {
        throw new TypeError('`kid` must be a string when provided')
      }
    }

    Object.defineProperties(this, {
      keyObject: { value: keyObject },
      kty: { value: keyObject.type === 'secret' ? 'oct' : keyObject.asymmetricKeyType.toUpperCase(), enumerable: true },
      private: { value: keyObject.type === 'private', enumerable: keyObject.type === 'private' },
      public: { value: keyObject.type === 'public', enumerable: keyObject.type === 'public' },
      alg: { value: alg, enumerable: alg !== undefined },
      use: { value: use, enumerable: use !== undefined },
      kid: {
        enumerable: true,
        ...(kid ? { value: kid } : {
          get () {
            Object.defineProperty(this, 'kid', { value: thumbprint.kid(this.thumbprintMaterial()), configurable: false })
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

  thumbprintMaterial () {
    throw new TODO('not implemented')
  }
}

module.exports = Key
