const isObject = require('../help/is_object')
const { generate, generateSync } = require('../jwk/generate')
const Key = require('../jwk/key/base')
const importKey = require('../jwk/import')

const keyscore = (key, { alg, kid, use }) => {
  let score = 0

  if (alg && key.alg) {
    score++
  }

  if (kid && key.kid) {
    score++
  }

  if (use && key.use) {
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
      throw new TypeError('all keys must be an instances of a key instantiated by JWK.importKey')
    }

    this.#keys = new Set(keys);
  }

  static fromJWKS (jwks) {
    if (!isObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some(k => !isObject(k) || !('kty' in k))) {
      throw new TypeError('jwks must be a JSON Web Key Set formatted object')
    }

    const keys = jwks.keys.map((jwk) => importKey(jwk))

    return new KeyStore(...keys)
  }

  all ({ alg, kid, use, kty, operation } = {}) {
    return [...this.#keys]
      .filter((key) => {
        let candidate = true

        if (alg !== undefined && !key.algorithms(operation).has(alg)) {
          candidate = false
        }

        if (candidate && kid !== undefined && key.kid !== kid) {
          candidate = false
        }

        if (candidate && kty !== undefined && key.kty !== kty) {
          candidate = false
        }

        if (candidate && use !== undefined && (key.use !== undefined && key.use !== use)) {
          candidate = false
        }

        return candidate
      })
      .sort((first, second) => keyscore(second, { alg, kid, use }) - keyscore(first, { alg, kid, use }))
  }

  get (...args) {
    return this.all(...args)[0]
  }

  add (key) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }

    this.#keys.add(key)
  }

  remove (key) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
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
}

module.exports = KeyStore
