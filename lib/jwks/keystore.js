const { generate, generateSync } = require('../jwk/generate')
const { TODO } = require('../errors')
const Key = require('../jwk/key/base')

const KEYS = Symbol('keys')

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
  constructor (...keys) {
    if (keys.some(k => !(k instanceof Key))) {
      throw new TypeError('all keys must be an instances of a key instantiated by JWK.importKey')
    }

    Object.defineProperty(this, KEYS, { value: new Set(keys) })
  }

  all ({ alg, kid, use, kty } = {}) {
    return [...this[KEYS]]
      .filter((key) => {
        let candidate = true

        if (alg !== undefined && !key.algorithms().has(alg)) {
          candidate = false
        }

        if (candidate && kid !== undefined && key.kid !== kid) {
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

    if (this[KEYS].has(key)) {
      throw new TODO()
    }

    this[KEYS].add(key)
  }

  remove (key) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }

    if (!this[KEYS].has(key)) {
      throw new TODO()
    }

    this[KEYS].delete(key)
  }

  async generate (...args) {
    this[KEYS].add(await generate(...args))
  }

  generateSync (...args) {
    this[KEYS].add(generateSync(...args))
  }
}

module.exports = KeyStore
