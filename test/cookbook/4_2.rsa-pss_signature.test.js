const test = require('ava')

const recipe = require('./recipes').get('4.2')

const { JWS, JWK: { importKey, generateSync }, JWKS: { KeyStore } } = require('../..')

const { input: { payload, key: jwk }, signing: { protected: header } } = recipe

const key = importKey(jwk)

const keystoreMatchOne = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use }), key)
const keystoreMatchMore = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use, kid: key.kid }), key, importKey(key))

test(`${recipe.title} - compact sign (random)`, t => {
  const res = JWS.sign(payload, key, header)
  t.truthy(res)
  t.is(JWS.verify(res, key), payload)
})

test(`${recipe.title} - flattened sign (random)`, t => {
  const res = JWS.sign.flattened(payload, key, header)
  t.truthy(res)
  t.is(JWS.verify(res, key), payload)
})

test(`${recipe.title} - general sign (random)`, t => {
  const res = JWS.sign.general(payload, key, header)
  t.truthy(res)
  t.is(JWS.verify(res, key), payload)
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
