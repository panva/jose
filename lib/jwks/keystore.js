const { deprecate, inspect } = require('util')

const isObject = require('../help/is_object')
const { generate, generateSync } = require('../jwk/generate')
const { USES_MAPPING } = require('../help/consts')
const { None, isKey, asKey: importKey } = require('../jwk')

const keyscore = (key, { alg, use, ops }) => {
  let score = 0

  if (alg && key.alg) {
    score++
  }

  if (use && key.use) {
    score++
  }

  if (ops && key.key_ops) {
    score++
  }

  return score
}

class KeyStore {
  constructor (...keys) {
    while (keys.some(Array.isArray)) {
      keys = keys.flat ? keys.flat() : keys.reduce((acc, val) => {
        if (Array.isArray(val)) {
          return [...acc, ...val]
        }

        acc.push(val)
        return acc
      }, [])
    }
    if (keys.some(k => !isKey(k) || k === None)) {
      throw new TypeError('all keys must be instances of a key instantiated by JWK.asKey')
    }

    this._keys = new Set(keys)
  }

  all ({ alg, kid, thumbprint, use, kty, key_ops: ops, x5t, 'x5t#S256': x5t256, crv } = {}) {
    if (ops !== undefined && (!Array.isArray(ops) || !ops.length || ops.some(x => typeof x !== 'string'))) {
      throw new TypeError('`key_ops` must be a non-empty array of strings')
    }

    const search = { alg, use, ops }
    return [...this._keys]
      .filter((key) => {
        let candidate = true

        if (candidate && kid !== undefined && key.kid !== kid) {
          candidate = false
        }

        if (candidate && thumbprint !== undefined && key.thumbprint !== thumbprint) {
          candidate = false
        }

        if (candidate && x5t !== undefined && key.x5t !== x5t) {
          candidate = false
        }

        if (candidate && x5t256 !== undefined && key['x5t#S256'] !== x5t256) {
          candidate = false
        }

        if (candidate && kty !== undefined && key.kty !== kty) {
          candidate = false
        }

        if (candidate && crv !== undefined && (key.crv !== crv)) {
          candidate = false
        }

        if (alg !== undefined && !key.algorithms().has(alg)) {
          candidate = false
        }

        if (candidate && use !== undefined && (key.use !== undefined && key.use !== use)) {
          candidate = false
        }

        // TODO:
        if (candidate && ops !== undefined && (key.key_ops !== undefined || key.use !== undefined)) {
          let keyOps
          if (key.key_ops) {
            keyOps = new Set(key.key_ops)
          } else {
            keyOps = USES_MAPPING[key.use]
          }
          if (ops.some(x => !keyOps.has(x))) {
            candidate = false
          }
        }

        return candidate
      })
      .sort((first, second) => keyscore(second, search) - keyscore(first, search))
  }

  get (...args) {
    return this.all(...args)[0]
  }

  add (key) {
    if (!isKey(key) || key === None) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    this._keys.add(key)
  }

  remove (key) {
    if (!isKey(key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    this._keys.delete(key)
  }

  toJWKS (priv = false) {
    return {
      keys: [...this._keys.values()].map(
        key => key.toJWK(priv && (key.private || (key.secret && key.k)))
      )
    }
  }

  async generate (...args) {
    this._keys.add(await generate(...args))
  }

  generateSync (...args) {
    this._keys.add(generateSync(...args))
  }

  get size () {
    return this._keys.size
  }

  /* c8 ignore next 8 */
  [inspect.custom] () {
    return `${this.constructor.name} ${inspect(this.toJWKS(false), {
      depth: Infinity,
      colors: process.stdout.isTTY,
      compact: false,
      sorted: true
    })}`
  }

  * [Symbol.iterator] () {
    for (const key of this._keys) {
      yield key
    }
  }
}

function asKeyStore (jwks, { ignoreErrors = false, calculateMissingRSAPrimes = false } = {}) {
  if (!isObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some(k => !isObject(k) || !('kty' in k))) {
    throw new TypeError('jwks must be a JSON Web Key Set formatted object')
  }

  const keys = jwks.keys.map((jwk) => {
    try {
      return importKey(jwk, { calculateMissingRSAPrimes })
    } catch (err) {
      if (!ignoreErrors) {
        throw err
      }
    }
  }).filter(Boolean)

  return new KeyStore(...keys)
}

Object.defineProperty(KeyStore, 'fromJWKS', {
  value: deprecate(jwks => asKeyStore(jwks, { calculateMissingRSAPrimes: true }), 'JWKS.KeyStore.fromJWKS() is deprecated, use JWKS.asKeyStore() instead'),
  enumerable: false
})

module.exports = { KeyStore, asKeyStore }
