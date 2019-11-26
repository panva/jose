const test = require('ava')

const { createSecretKey, generateKeyPairSync } = require('crypto')

const { keyObjectSupported } = require('../../lib/help/runtime_support')
const errors = require('../../lib/errors')
const getKey = require('../../lib/help/get_key')
const { JWKS, JWK } = require('../..')

test('key must not be a KeyStore instance unless keyStoreAllowed is true', t => {
  const ks = new JWKS.KeyStore()
  t.throws(() => {
    getKey(ks)
  }, { instanceOf: TypeError, message: 'key argument for this operation must not be a JWKS.KeyStore instance' })
  t.is(getKey(ks, true), ks)
})

test('Key instances are passed through', async t => {
  const k = await JWK.generate('oct')
  t.is(getKey(k, true), k)
})

test('JWK is instantiated', async t => {
  const jwk = (await JWK.generate('RSA')).toJWK()
  const key = getKey(jwk)
  t.truthy(key)
  t.true(JWK.isKey(key))
})

if (keyObjectSupported) {
  test('KeyObject is instantiated', async t => {
    const key = getKey(createSecretKey(Buffer.from('foo')))
    t.truthy(key)
    t.true(JWK.isKey(key))
  })
}

test('Buffer is instantiated', async t => {
  const key = getKey(Buffer.from('foo'))
  t.truthy(key)
  t.true(JWK.isKey(key))
  t.is(key.kty, 'oct')
})

test('oct tring is instantiated', async t => {
  const key = getKey(Buffer.from('foo'))
  t.truthy(key)
  t.true(JWK.isKey(key))
  t.is(key.kty, 'oct')
})

test('PEM key is instantiated', async t => {
  const pem = (await JWK.generate('RSA')).toPEM()
  const key = getKey(pem)
  t.truthy(key)
  t.true(JWK.isKey(key))
  t.is(key.kty, 'RSA')
})

test('invalid inputs throw TypeError', t => {
  ;[{}, new Object(), false, null, Infinity, 0, 1].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      getKey(val)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey, or a valid JWK.asKey input' })
    t.throws(() => {
      getKey(val, true)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey, a valid JWK.asKey input, or a JWKS.KeyStore instance' })
  })

  if (keyObjectSupported && !('electron' in process.versions)) {
    const { privateKey, publicKey } = generateKeyPairSync('dsa', { modulusLength: 1024 })
    ;[privateKey, publicKey].forEach((val) => {
      t.throws(() => {
        getKey(val)
      }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'only RSA, EC and OKP asymmetric keys are supported' })
    })
  }
})
