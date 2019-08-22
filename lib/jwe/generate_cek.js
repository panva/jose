const { randomBytes } = require('crypto')

const { createSecretKey } = require('../help/key_object')
const { KEYLENGTHS } = require('../help/consts')
const importKey = require('../jwk/import')

module.exports = alg => importKey(createSecretKey(randomBytes(KEYLENGTHS[alg] / 8)), { use: 'enc', alg })
