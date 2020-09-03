const Key = require('./key/base')
const None = require('./key/none')
const EmbeddedJWK = require('./key/embedded.jwk')
const EmbeddedX5C = require('./key/embedded.x5c')
const importKey = require('./import')
const generate = require('./generate')

module.exports = {
  ...generate,
  asKey: importKey,
  isKey: input => input instanceof Key,
  None,
  EmbeddedJWK,
  EmbeddedX5C
}
