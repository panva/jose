const { randomBytes } = require('crypto')

const { createSecretKey } = require('../help/key_object')
const { KEYLENGTHS } = require('../registry')
const importKey = require('../jwk/import')

module.exports = alg => importKey(createSecretKey(randomBytes(KEYLENGTHS.get(alg) / 8)), { use: 'enc', alg })
