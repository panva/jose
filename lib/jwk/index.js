const Key = require('./key/base')
const CustomKey = require('./key/custom')
const importKey = require('./import')
const { generate, generateSync } = require('./generate')

module.exports.asKey = importKey
module.exports.generate = generate
module.exports.generateSync = generateSync
module.exports.isKey = input => input instanceof Key
module.exports.CustomKey = CustomKey

/* deprecated */
Object.defineProperty(module.exports, 'importKey', {
  value: importKey.deprecated,
  enumerable: false
})
