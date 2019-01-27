const { randomBytes, createSecretKey } = require('crypto')

const OctKey = require('../jwk/key/oct')
const KEYLENGTHS = require('../help/key_lengths')

module.exports = (alg) => {
  const byteLength = KEYLENGTHS[alg] / 8

  if (byteLength === undefined) {
    throw new TypeError('unsupported intended content encryption key alg')
  }

  return new OctKey(createSecretKey(randomBytes(byteLength)), { use: 'enc', alg })
}
