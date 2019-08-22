// require 'secp256k1' renamed to 'P-256K'
require('../../P-256K')

const test = require('ava')

if ('electron' in process.versions) return

const { createPublicKey, createPrivateKey } = require('../../lib/help/key_object')

const { keyObjectToJWK, jwkToPem } = require('../../lib/help/key_utils')
const { JWK: fixtures } = require('../fixtures')
const clone = obj => JSON.parse(JSON.stringify(obj))

test('EC P-256K Public key', t => {
  const expected = clone(fixtures['P-256K'])
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-256K Private key', t => {
  const expected = fixtures['P-256K']
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})
