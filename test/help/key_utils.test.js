const test = require('ava')
const { createPublicKey, createPrivateKey } = require('crypto')

const { keyObjectToJWK, jwkToPem } = require('../../lib/help/key_utils')
const { JWK: fixtures } = require('../fixtures')
const clone = obj => JSON.parse(JSON.stringify(obj))

test('jwkToPem only works for EC and RSA', t => {
  t.throws(() => {
    jwkToPem({ kty: 'oct' })
  }, { instanceOf: TypeError, message: 'unsupported kty' })
})

test('RSA Public key', t => {
  const expected = fixtures.RSA_PUBLIC
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('RSA Private key', t => {
  const expected = fixtures.RSA_PRIVATE
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-256 Public key', t => {
  const expected = clone(fixtures['P-256'])
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-256 Private key', t => {
  const expected = fixtures['P-256']
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-384 Public key', t => {
  const expected = clone(fixtures['P-384'])
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-384 Private key', t => {
  const expected = fixtures['P-384']
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-521 Public key', t => {
  const expected = clone(fixtures['P-521'])
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('EC P-521 Private key', t => {
  const expected = fixtures['P-521']
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})
