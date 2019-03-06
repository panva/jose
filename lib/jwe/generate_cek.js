const { randomBytes, createSecretKey } = require('crypto')

const KEYLENGTHS = require('../help/key_lengths')
const OctKey = require('../jwk/key/oct')

module.exports = alg => new OctKey(createSecretKey(randomBytes(KEYLENGTHS[alg] / 8)), { use: 'enc', alg })
