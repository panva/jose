const test = require('ava')

const recipe = require('./recipes').get('4.2')

const { JWS, JWK } = require('../..')

const { input: { payload, key: jwk }, signing: { protected: header } } = recipe

const key = JWK.importKey(jwk)

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
