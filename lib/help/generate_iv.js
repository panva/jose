const { randomBytes } = require('crypto')

const IVLENGTHS = {
  'A128CBC-HS256': 128 / 8,
  'A128GCM': 96 / 8,
  'A128GCMKW': 96 / 8,
  'A192CBC-HS384': 128 / 8,
  'A192GCM': 96 / 8,
  'A192GCMKW': 96 / 8,
  'A256CBC-HS512': 128 / 8,
  'A256GCM': 96 / 8,
  'A256GCMKW': 96 / 8
}

module.exports = alg => randomBytes(IVLENGTHS[alg])
