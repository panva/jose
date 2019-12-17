const { deprecate } = require('util')

const deprecation = deprecate(() => {}, '"P-256K" EC curve name is deprecated')

module.exports = {
  name: 'secp256k1',
  rename (value) {
    if (value !== 'secp256k1') {
      deprecation()
    }
    module.exports.name = value
  }
}
