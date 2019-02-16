const test = require('ava')

const recipe = require('./recipes').get('4.7')

const { JWS, JWK: { importKey, generateSync }, JWKS: { KeyStore } } = require('../..')

const { input: { payload, key: jwk }, signing: { unprotected } } = recipe

const key = importKey(jwk)

const keystoreMatchOne = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use }), key)
const keystoreMatchMore = new KeyStore(generateSync(key.kty, key.length, { alg: key.alg, use: key.use, kid: key.kid }), key, importKey(key))

test(`${recipe.title} - flattened sign`, t => {
  t.deepEqual(JWS.sign.flattened(payload, key, undefined, unprotected), recipe.output.json_flat)
})

test(`${recipe.title} - general sign`, t => {
  t.deepEqual(JWS.sign.general(payload, key, undefined, unprotected), recipe.output.json)
})

test(`${recipe.title} - flattened verify`, t => {
  t.is(JWS.verify(recipe.output.json_flat, key), payload)
})

test(`${recipe.title} - general verify`, t => {
  t.is(JWS.verify(recipe.output.json, key), payload)
})

;[keystoreMatchOne, keystoreMatchMore].forEach((keystore, i) => {
  test(`${recipe.title} - flattened verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json_flat, keystore), payload)
  })

  test(`${recipe.title} - general verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json, keystore), payload)
  })
})
