const { inspect } = require('util')

const Key = require('./base')

class NoneKey extends Key {
  constructor () {
    super({ type: 'unsecured' }, { alg: 'none' })
    Object.defineProperties(this, {
      kid: { value: undefined },
      thumbprint: { value: undefined },
      toJWK: { value: undefined },
      toPEM: { value: undefined }
    })
  }

  /* c8 ignore next 3 */
  [inspect.custom] () {
    return 'None {}'
  }

  algorithms (operation) {
    switch (operation) {
      case 'sign':
      case 'verify':
      case undefined:
        return new Set(['none'])
      default:
        return new Set()
    }
  }
}

module.exports = new NoneKey({ type: 'unsecured' }, { alg: 'none' })
