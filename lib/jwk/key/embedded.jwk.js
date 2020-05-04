const { inspect } = require('util')

const Key = require('./base')

class EmbeddedJWK extends Key {
  constructor () {
    super({ type: 'embedded' })
    Object.defineProperties(this, {
      kid: { value: undefined },
      kty: { value: undefined },
      thumbprint: { value: undefined },
      toJWK: { value: undefined },
      toPEM: { value: undefined }
    })
  }

  /* c8 ignore next 3 */
  [inspect.custom] () {
    return 'Embedded.JWK {}'
  }

  algorithms () {
    return new Set()
  }
}

module.exports = new EmbeddedJWK()
