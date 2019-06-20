const { deprecate, inspect } = require('util')

const isObject = require('../help/is_object')
const { generate, generateSync } = require('../jwk/generate')
const Key = require('../jwk/key/base')
const importKey = require('../jwk/import')
const { USES_MAPPING } = require('../help/consts')

const keyscore = (key, { alg, kid, use, ops, x5t, x5t256 }) => {
  let score = 0

  if (alg && key.alg) {
    score++
  }

  if (kid && key.kid) {
    score++
  }

  if (x5t && key.x5t) {
    score++
  }

  if (x5t256 && key['x5t#S256']) {
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
  #keys

  constructor (...keys) {
    while (keys.some(Array.isArray)) {
      keys = keys.flat()
    }
    if (keys.some(k => !(k instanceof Key))) {
      throw new TypeError('all keys must be an instances of a key instantiated by JWK.asKey')
    }

    this.#keys = new Set(keys)
  }

  all ({ alg, kid, use, kty, key_ops: ops, x5t, 'x5t#S256': x5t256 } = {}) {
    if (ops !== undefined && (!Array.isArray(ops) || !ops.length || ops.some(x => typeof x !== 'string'))) {
      throw new TypeError('`key_ops` must be a non-empty array of strings')
    }

    const search = { alg, kid, use, ops, x5t, x5t256 }
    return [...this.#keys]
      .filter((key) => {
        let candidate = true

        if (alg !== undefined && !key.algorithms().has(alg)) {
          candidate = false
        }

        if (candidate && kid !== undefined && key.kid !== kid) {
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

        if (candidate && use !== undefined && (key.use !== undefined && key.use !== use)) {
          candidate = false
        }

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
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    this.#keys.add(key)
  }

  remove (key) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    this.#keys.delete(key)
  }

  toJWKS (priv = false) {
    return { keys: [...this.#keys.values()].map(key => key.toJWK(priv)) }
  }

  async generate (...args) {
    this.#keys.add(await generate(...args))
  }

  generateSync (...args) {
    this.#keys.add(generateSync(...args))
  }

  get size () {
    return this.#keys.size
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
    for (const key of this.#keys) {
      yield key
    }
  }
}

function asKeyStore (jwks, { calculateMissingRSAPrimes = false } = {}) {
  if (!isObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some(k => !isObject(k) || !('kty' in k))) {
    throw new TypeError('jwks must be a JSON Web Key Set formatted object')
  }

  const keys = jwks.keys.map((jwk) => importKey(jwk, { calculateMissingRSAPrimes }))

  return new KeyStore(...keys)
}

Object.defineProperty(KeyStore, 'fromJWKS', {
  value: deprecate(jwks => asKeyStore(jwks, { calculateMissingRSAPrimes: true }), 'JWKS.KeyStore.fromJWKS() is deprecated, use JWKS.asKeyStore() instead'),
  enumerable: false
})

module.exports = { KeyStore, asKeyStore }
