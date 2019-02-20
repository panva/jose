const { randomBytes, createSecretKey } = require('crypto')

const OctKey = require('../jwk/key/oct')
const KEYLENGTHS = require('../help/key_lengths')

module.exports = alg => new OctKey(createSecretKey(randomBytes(KEYLENGTHS[alg] / 8)), { use: 'enc', alg })
