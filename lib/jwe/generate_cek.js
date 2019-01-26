const { randomBytes, createSecretKey } = require('crypto')

const OctKey = require('../jwk/key/oct')

const KEYLENGTHS = {
  'A128CBC-HS256': 256 / 8,
  'A192CBC-HS384': 384 / 8,
  'A256CBC-HS512': 512 / 8,
  'A128GCM': 128 / 8,
  'A192GCM': 192 / 8,
  'A256GCM': 256 / 8
}

module.exports = (alg) => {
  const byteLength = KEYLENGTHS[alg]

  if (byteLength === undefined) {
    throw new TypeError('unsupported intended content encryption key alg')
  }

  return new OctKey(createSecretKey(randomBytes(byteLength)), { use: 'enc', alg })
}
