const test = require('ava')
const { createPublicKey, createPrivateKey } = require('crypto')

const { errors } = require('../..')
const { keyObjectToJWK, jwkToPem } = require('../../lib/help/key_utils')
const { JWK: fixtures } = require('../fixtures')
const clone = obj => JSON.parse(JSON.stringify(obj))

test('jwkToPem only works for EC, RSA and OKP', t => {
  t.throws(() => {
    jwkToPem({ kty: 'foo' })
  }, { instanceOf: errors.JOSENotSupported, message: 'unsupported key type: foo' })
})

test('jwkToPem only handles known EC curves', t => {
  t.throws(() => {
    jwkToPem({ kty: 'EC', crv: 'foo' })
  }, { instanceOf: errors.JOSENotSupported, message: 'unsupported EC key curve: foo' })
})

test('jwkToPem only handles known OKP curves', t => {
  t.throws(() => {
    jwkToPem({ kty: 'OKP', crv: 'foo' })
  }, { instanceOf: errors.JOSENotSupported, message: 'unsupported OKP key curve: foo' })
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

test('Ed25519 Public key', t => {
  const expected = clone(fixtures.Ed25519)
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('Ed25519 Private key', t => {
  const expected = fixtures.Ed25519
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('Ed448 Public key', t => {
  const expected = clone(fixtures.Ed448)
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('Ed448 Private key', t => {
  const expected = fixtures.Ed448
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('X25519 Public key', t => {
  const expected = clone(fixtures.X25519)
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('X25519 Private key', t => {
  const expected = fixtures.X25519
  const pem = createPrivateKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('X448 Public key', t => {
  const expected = clone(fixtures.X448)
  delete expected.d
  const pem = createPublicKey(jwkToPem(expected))
  const actual = keyObjectToJWK(pem)

  t.deepEqual(actual, expected)
})

test('X448 Private key', t => {
  const expected = fixtures.X448
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
