// require 'secp256k1' renamed to 'P-256K'
require('../../P-256K')

const test = require('ava')

if ('electron' in process.versions) return

const { JWK: { asKey } } = require('../..')

const ENCS = [
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512'
]

const type = 'P-256K'
const { private: key, public: pub } = require('../fixtures').PEM[type]

const { JWE: { success, failure } } = require('../macros')

const eKey = asKey(pub)
const dKey = asKey(key)

;[...eKey.algorithms('wrapKey'), ...eKey.algorithms('deriveKey')].forEach((alg) => {
  ENCS.forEach((enc) => {
    test(`key ${type} > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
    test(`key ${type} > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
  })
})
