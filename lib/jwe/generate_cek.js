const { randomBytes, createSecretKey } = require('crypto')

const { KEYLENGTHS } = require('../help/consts')
const importKey = require('../jwk/import')

module.exports = alg => importKey(createSecretKey(randomBytes(KEYLENGTHS[alg] / 8)), { use: 'enc', alg })
