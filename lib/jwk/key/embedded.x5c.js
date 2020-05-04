const { inspect } = require('util')

const Key = require('./base')

class EmbeddedX5C extends Key {
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
    return 'Embedded.X5C {}'
  }

  algorithms () {
    return new Set()
  }
}

module.exports = new EmbeddedX5C()
