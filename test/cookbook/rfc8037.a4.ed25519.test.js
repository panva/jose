const test = require('ava')

const { edDSASupported } = require('../../lib/help/runtime_support')

if (!edDSASupported) return

const recipe = require('./recipes').get('A.4 rfc8037')

const { JWS, JWK: { asKey, generateSync }, JWKS: { KeyStore }, errors } = require('../..')

const { input: { payload, key: jwk }, signing: { protected: header } } = recipe

const key = asKey(jwk)

test('OKP JWK Thumbprint Canonicalization', t => {
  t.is(key.kid, 'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k')
})

const keystoreEmpty = new KeyStore()
const keystoreMatchOne = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use }), key)
const keystoreMatchMore = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use, kid: key.kid }), key, asKey(key))
const keystoreMatchNone = new KeyStore(generateSync('EC'), generateSync('RSA'))

test(`${recipe.title} - compact sign`, t => {
  t.is(JWS.sign(payload, key, header), recipe.output.compact)
})

test(`${recipe.title} - flattened sign`, t => {
  t.deepEqual(JWS.sign.flattened(payload, key, header), recipe.output.json_flat)
})

test(`${recipe.title} - general sign`, t => {
  t.deepEqual(JWS.sign.general(payload, key, header), recipe.output.json)
})

test(`${recipe.title} - compact verify`, t => {
  t.is(JWS.verify(recipe.output.compact, key), payload)
})

test(`${recipe.title} - flattened verify`, t => {
  t.is(JWS.verify(recipe.output.json_flat, key), payload)
})

test(`${recipe.title} - general verify`, t => {
  t.is(JWS.verify(recipe.output.json, key), payload)
})

;[keystoreMatchOne, keystoreMatchMore].forEach((keystore, i) => {
  test(`${recipe.title} - compact verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.compact, keystore), payload)
  })

  test(`${recipe.title} - flattened verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json_flat, keystore), payload)
  })

  test(`${recipe.title} - general verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json, keystore), payload)
  })
})

test(`${recipe.title} - compact verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.compact, keystoreMatchNone)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY' })
})

test(`${recipe.title} - flattened verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json_flat, keystoreMatchNone)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY' })
})

test(`${recipe.title} - general verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY' })
})

test(`${recipe.title} - compact verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.compact, keystoreEmpty)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY', message: 'no matching key found in the KeyStore' })
})

test(`${recipe.title} - flattened verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json_flat, keystoreEmpty)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY', message: 'no matching key found in the KeyStore' })
})

test(`${recipe.title} - general verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreEmpty)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY', message: 'no matching key found in the KeyStore' })
})
