const { strict: assert } = require('assert')
const { inspect } = require('util')
const { EOL } = require('os')

const { keyObjectSupported } = require('../../help/runtime_support')
const { createPublicKey } = require('../../help/key_object')
const { keyObjectToJWK } = require('../../help/key_utils')
const {
  THUMBPRINT_MATERIAL, PUBLIC_MEMBERS, PRIVATE_MEMBERS, JWK_MEMBERS, KEYOBJECT,
  USES_MAPPING, OPS, USES
} = require('../../help/consts')
const isObject = require('../../help/is_object')
const thumbprint = require('../thumbprint')
const errors = require('../../errors')

const privateApi = Symbol('privateApi')
const { JWK } = require('../../registry')

class Key {
  constructor (keyObject, { alg, use, kid, key_ops: ops, x5c, x5t, 'x5t#S256': x5t256 } = {}) {
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
      if (!Array.isArray(ops) || !ops.length || ops.some(o => typeof o !== 'string')) {
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

    if (keyObjectSupported && x5c !== undefined) {
      if (!Array.isArray(x5c) || !x5c.length || x5c.some(c => typeof c !== 'string')) {
        throw new TypeError('`x5c` must be an array of one or more PKIX certificates when provided')
      }

      x5c.forEach((cert, i) => {
        let publicKey
        try {
          publicKey = createPublicKey({
            key: `-----BEGIN CERTIFICATE-----${EOL}${cert.match(/.{1,64}/g).join(EOL)}${EOL}-----END CERTIFICATE-----`, format: 'pem'
          })
        } catch (err) {
          throw new errors.JWKInvalid(`\`x5c\` member at index ${i} is not a valid base64-encoded DER PKIX certificate`)
        }
        if (i === 0) {
          try {
            assert.deepEqual(
              publicKey.export({ type: 'spki', format: 'der' }),
              (keyObject.type === 'public' ? keyObject : createPublicKey(keyObject)).export({ type: 'spki', format: 'der' })
            )
          } catch (err) {
            throw new errors.JWKInvalid('The key in the first `x5c` certificate MUST match the public key represented by the JWK')
          }
        }
      })
    }

    Object.defineProperties(this, {
      [KEYOBJECT]: { value: isObject(keyObject) ? undefined : keyObject },
      keyObject: {
        get () {
          if (!keyObjectSupported) {
            throw new errors.JOSENotSupported('KeyObject class is not supported in your Node.js runtime version')
          }

          return this[KEYOBJECT]
        }
      },
      type: { value: keyObject.type },
      private: { value: keyObject.type === 'private' },
      public: { value: keyObject.type === 'public' },
      secret: { value: keyObject.type === 'secret' },
      alg: { value: alg, enumerable: alg !== undefined },
      use: { value: use, enumerable: use !== undefined },
      x5c: {
        enumerable: x5c !== undefined,
        ...(x5c ? { get () { return [...x5c] } } : { value: undefined })
      },
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
      ...(x5c ? {
        x5t: {
          enumerable: true,
          ...(x5t ? { value: x5t } : {
            get () {
              Object.defineProperty(this, 'x5t', { value: thumbprint.x5t(this.x5c[0]), configurable: false })
              return this.x5t
            },
            configurable: true
          })
        }
      } : undefined),
      ...(x5c ? {
        'x5t#S256': {
          enumerable: true,
          ...(x5t256 ? { value: x5t256 } : {
            get () {
              Object.defineProperty(this, 'x5t#S256', { value: thumbprint['x5t#S256'](this.x5c[0]), configurable: false })
              return this['x5t#S256']
            },
            configurable: true
          })
        }
      } : undefined),
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

    const components = [...this.constructor[priv ? PRIVATE_MEMBERS : PUBLIC_MEMBERS]]
      .map(k => [k, this[k]])

    const result = {}

    Object.keys(components).forEach((key) => {
      const [k, v] = components[key]

      result[k] = v
    })

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

    if (this.x5c) {
      result.x5c = this.x5c
    }

    if (this.x5t) {
      result.x5t = this.x5t
    }

    if (this['x5t#S256']) {
      result['x5t#S256'] = this['x5t#S256']
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

  algorithms (operation, /* the rest is private API */ int, opts) {
    const { use = this.use, alg = this.alg, key_ops: ops = this.key_ops } = int === privateApi ? opts : {}
    if (alg) {
      return new Set(this.algorithms(operation, privateApi, { alg: null, use, key_ops: ops }).has(alg) ? [alg] : undefined)
    }

    if (typeof operation === 'symbol') {
      try {
        return this[operation]()
      } catch (err) {
        return new Set()
      }
    }

    if (operation && ops && !ops.includes(operation)) {
      return new Set()
    }

    switch (operation) {
      case 'decrypt':
      case 'deriveKey':
      case 'encrypt':
      case 'sign':
      case 'unwrapKey':
      case 'verify':
      case 'wrapKey':
        return new Set(Object.entries(JWK[this.kty][operation]).map(([alg, fn]) => fn(this) ? alg : undefined).filter(Boolean))
      case undefined:
        return new Set([
          ...this.algorithms('sign'),
          ...this.algorithms('verify'),
          ...this.algorithms('decrypt'),
          ...this.algorithms('encrypt'),
          ...this.algorithms('unwrapKey'),
          ...this.algorithms('wrapKey'),
          ...this.algorithms('deriveKey')
        ])
      default:
        throw new TypeError('invalid key operation')
    }
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
