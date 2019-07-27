// require 'secp256k1' renamed to 'P-256K'
require('../../P-256K')

const test = require('ava')

if ('electron' in process.versions) return

const { JWK: { asKey } } = require('../..')

const type = 'P-256K'
const { private: key, public: pub } = require('../fixtures').PEM[type]

const { JWS: { success, failure } } = require('../macros')

const sKey = asKey(key)
const vKey = asKey(pub)

sKey.algorithms('sign').forEach((alg) => {
  test(`key ${type} > alg ${alg}`, success, sKey, vKey, alg)
  test(`key ${type} > alg ${alg} (negative cases)`, failure, sKey, vKey, alg)
})
