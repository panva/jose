const Key = require('./key/base')
const None = require('./key/none')
const importKey = require('./import')
const generate = require('./generate')

module.exports = {
  ...generate,
  asKey: importKey,
  isKey: input => input instanceof Key,
  None
}

/* deprecated */
Object.defineProperty(module.exports, 'importKey', {
  value: importKey.deprecated,
  enumerable: false
})
