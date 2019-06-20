const test = require('ava')

const recipes = require('./recipes')

const { JWK: { asKey }, JWKS: { KeyStore } } = require('../..')

test('public EC', t => {
  const jwk = recipes.get('3.1')
  const key = asKey(jwk)
  t.true(key.toPEM().includes('BEGIN PUBLIC KEY'))
  t.deepEqual(key.toJWK(), jwk)
  t.deepEqual(key.toJWK(false), jwk)
  t.throws(() => {
    key.toJWK(true)
  }, { instanceOf: TypeError, message: 'public key cannot be exported as private' })
  t.throws(() => {
    key.toPEM(false, { cipher: 'aes-256-cbc' })
  }, { instanceOf: TypeError, message: 'cipher and passphrase can only be applied when exporting private keys' })
  t.throws(() => {
    key.toPEM(false, { passphrase: 'top secret' })
  }, { instanceOf: TypeError, message: 'cipher and passphrase can only be applied when exporting private keys' })
  t.throws(() => {
    key.toPEM(true)
  }, { instanceOf: TypeError, message: 'public key cannot be exported as private' })
})

test('private EC', t => {
  const jwk = recipes.get('3.2')
  const key = asKey(jwk)
  t.true(key.toPEM(true, { cipher: 'aes-256-cbc', passphrase: 'top secret' }).includes('BEGIN ENCRYPTED PRIVATE KEY'))
  t.true(key.toPEM(true, { type: 'sec1' }).includes('BEGIN EC PRIVATE KEY'))
  t.true(key.toPEM(true, { type: 'sec1', cipher: 'aes-256-cbc', passphrase: 'top secret' }).includes('ENCRYPTED'))
  t.true(key.toPEM(true).includes('BEGIN PRIVATE KEY'))
  t.true(key.toPEM().includes('BEGIN PUBLIC KEY'))
  t.deepEqual(key.toJWK(true), jwk)
  const { d, ...pub } = jwk
  t.deepEqual(key.toJWK(), pub)
  t.deepEqual(key.toJWK(false), pub)
  t.throws(() => {
    key.toPEM(false, { cipher: 'aes-256-cbc' })
  }, { instanceOf: TypeError, message: 'cipher and passphrase can only be applied when exporting private keys' })
  t.throws(() => {
    key.toPEM(false, { passphrase: 'top secret' })
  }, { instanceOf: TypeError, message: 'cipher and passphrase can only be applied when exporting private keys' })
})

test('public RSA', t => {
  const jwk = recipes.get('3.3')
  const key = asKey(jwk)
  t.true(key.toPEM().includes('BEGIN PUBLIC KEY'))
  t.deepEqual(key.toJWK(), jwk)
  t.deepEqual(key.toJWK(false), jwk)
  t.throws(() => {
    key.toJWK(true)
  }, { instanceOf: TypeError, message: 'public key cannot be exported as private' })
  t.throws(() => {
    key.toPEM(true)
  }, { instanceOf: TypeError, message: 'public key cannot be exported as private' })
})

test('private RSA', t => {
  const jwk = recipes.get('3.4')
  const key = asKey(jwk)
  t.true(key.toPEM(true, { type: 'pkcs1' }).includes('BEGIN RSA PRIVATE KEY'))
  t.true(key.toPEM(true, { cipher: 'aes-256-cbc', passphrase: 'top secret', type: 'pkcs1' }).includes('ENCRYPTED'))
  t.true(key.toPEM(true, { type: 'pkcs1', cipher: 'aes-256-cbc', passphrase: 'top secret' }).includes('BEGIN RSA PRIVATE KEY'))
  t.true(key.toPEM(true, { cipher: 'aes-256-cbc', passphrase: 'top secret' }).includes('BEGIN ENCRYPTED PRIVATE KEY'))
  t.true(key.toPEM(true).includes('BEGIN PRIVATE KEY'))
  t.true(key.toPEM().includes('BEGIN PUBLIC KEY'))
  t.deepEqual(key.toJWK(true), jwk)
  const { d, dp, dq, p, q, qi, ...pub } = jwk
  t.deepEqual(key.toJWK(), pub)
  t.deepEqual(key.toJWK(false), pub)
})

test('oct (1/2)', t => {
  const jwk = recipes.get('3.5')
  const key = asKey(jwk)
  t.throws(() => {
    key.toPEM()
  }, { instanceOf: TypeError, message: 'symmetric keys cannot be exported as PEM' })
  t.deepEqual(key.toJWK(true), jwk)
  const { k, ...pub } = jwk
  t.deepEqual(key.toJWK(), pub)
  t.deepEqual(key.toJWK(false), pub)
})

test('oct (2/2)', t => {
  const jwk = recipes.get('3.6')
  const key = asKey(jwk)
  t.deepEqual(key.toJWK(true), jwk)
  const { k, ...pub } = jwk
  t.deepEqual(key.toJWK(), pub)
  t.deepEqual(key.toJWK(false), pub)
})

test('keystore .toJWKS()', t => {
  const ec = recipes.get('3.2')
  const { d: throwaway, ...pubEc } = ec
  const rsa = recipes.get('3.4')
  const { d, dp, dq, p, q, qi, ...pubRsa } = rsa
  const oct = recipes.get('3.5')
  const { k, ...pubOct } = oct
  const ks = new KeyStore(asKey(ec), asKey(rsa), asKey(oct))
  t.deepEqual(ks.toJWKS(true), { keys: [ec, rsa, oct] })
  t.deepEqual(ks.toJWKS(), { keys: [pubEc, pubRsa, pubOct] })
  t.deepEqual(ks.toJWKS(false), { keys: [pubEc, pubRsa, pubOct] })
  ks.add(asKey(pubRsa))
  t.throws(() => {
    ks.toJWKS(true)
  }, { instanceOf: TypeError, message: 'public key cannot be exported as private' })
})
