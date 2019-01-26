const { randomBytes } = require('crypto')

const IVLENGTHS = {
  'A128CBC-HS256': 128 / 8,
  'A192CBC-HS384': 128 / 8,
  'A256CBC-HS512': 128 / 8,
  'A128GCM': 96 / 8,
  'A192GCM': 96 / 8,
  'A256GCM': 96 / 8
}

module.exports = (alg) => {
  const byteLength = IVLENGTHS[alg]

  if (byteLength === undefined) {
    throw new TypeError('unsupported intended content encryption key alg')
  }

  return randomBytes(byteLength)
}
