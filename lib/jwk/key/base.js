const { createPublicKey } = require('crypto')
const { inspect } = require('util')

const { keyObjectToJWK } = require('../../help/key_utils')
const {
  THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS, JWK_MEMBERS, KEYOBJECT,
  USES_MAPPING, OPS, USES
} = require('../../help/consts')
const isObject = require('../../help/is_object')
const thumbprint = require('../thumbprint')
const errors = require('../../errors')

class Key {
  constructor (keyObject, { alg, use, kid, key_ops: ops } = {}) {
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

    if (ops !== undefined) {
      if (!Array.isArray(ops) || !ops.length || ops.some(x => typeof x !== 'string')) {
        throw new TypeError('`key_ops` must be a non-empty array of strings when provided')
      }
      ops = Array.from(new Set(ops)).filter(x => OPS.has(x))
    }

    if (ops && use) {
      if (
        (use === 'enc' && ops.some(x => USES_MAPPING.sig.has(x))) ||
        (use === 'sig' && ops.some(x => USES_MAPPING.enc.has(x)))
      ) {
        throw new errors.JWKInvalid('inconsistent JWK "use" and "key_ops"')
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
      key_ops: {
        enumerable: ops !== undefined,
        ...(ops ? { get () { return [...ops] } } : { value: undefined })
      },
      kid: {
        enumerable: true,
        ...(kid ? { value: kid } : {
          get () {
            Object.defineProperty(this, 'kid', { value: this.thumbprint, configurable: false })
            return this.kid
          },
          configurable: true
        })
      },
      thumbprint: {
        get () {
          Object.defineProperty(this, 'thumbprint', { value: thumbprint.kid(this[THUMBPRINT_MATERIAL]()), configurable: false })
          return this.thumbprint
        },
        configurable: true
      }
    })
  }

  toPEM (priv = false, encoding = {}) {
    if (this.secret) {
      throw new TypeError('symmetric keys cannot be exported as PEM')
    }

    if (priv && this.public === true) {
      throw new TypeError('public key cannot be exported as private')
    }

    const { type = priv ? 'pkcs8' : 'spki', cipher, passphrase } = encoding

    let keyObject = this[KEYOBJECT]

    if (!priv) {
      if (this.private) {
        keyObject = createPublicKey(keyObject)
      }
      if (cipher || passphrase) {
        throw new TypeError('cipher and passphrase can only be applied when exporting private keys')
      }
    }

    if (priv) {
      return keyObject.export({ format: 'pem', type, cipher, passphrase })
    }

    return keyObject.export({ format: 'pem', type })
  }

  toJWK (priv = false) {
    if (priv && this.public === true) {
      throw new TypeError('public key cannot be exported as private')
    }

    const result = Object.fromEntries(
      [...this.constructor[priv ? PRIVATE_MEMBERS : PUBLIC_MEMBERS]].map(k => [k, this[k]])
    )

    result.kty = this.kty
    result.kid = this.kid

    if (this.alg) {
      result.alg = this.alg
    }

    if (this.key_ops && this.key_ops.length) {
      result.key_ops = this.key_ops
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

  /* c8 ignore next 8 */
  [inspect.custom] () {
    return `${this.constructor.name} ${inspect(this.toJWK(false), {
      depth: Infinity,
      colors: process.stdout.isTTY,
      compact: false,
      sorted: true
    })}`
  }

  /* c8 ignore next 3 */
  [THUMBPRINT_MATERIAL] () {
    throw new Error(`"[THUMBPRINT_MATERIAL]()" is not implemented on ${this.constructor.name}`)
  }

  /* c8 ignore next 3 */
  algorithms () {
    throw new Error(`"algorithms()" is not implemented on ${this.constructor.name}`)
  }

  /* c8 ignore next 3 */
  static async generate () {
    throw new Error(`"static async generate()" is not implemented on ${this.name}`)
  }

  /* c8 ignore next 3 */
  static generateSync () {
    throw new Error(`"static generateSync()" is not implemented on ${this.name}`)
  }

  /* c8 ignore next 3 */
  static get [PUBLIC_MEMBERS] () {
    throw new Error(`"static get [PUBLIC_MEMBERS]()" is not implemented on ${this.name}`)
  }

  /* c8 ignore next 3 */
  static get [PRIVATE_MEMBERS] () {
    throw new Error(`"static get [PRIVATE_MEMBERS]()" is not implemented on ${this.name}`)
  }
}

module.exports = Key
