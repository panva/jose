const Key = require('./key/base')
const { generate, generateSync } = require('./generate')

module.exports.importKey = require('./import')
module.exports.generate = generate
module.exports.generateSync = generateSync
module.exports.isKey = input => input instanceof Key
