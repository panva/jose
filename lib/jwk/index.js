const Key = require('./key/base')
const importKey = require('./import')
const { generate, generateSync } = require('./generate')

module.exports.importKey = importKey
module.exports.generate = generate
module.exports.generateSync = generateSync
module.exports.isKey = input => input instanceof Key
