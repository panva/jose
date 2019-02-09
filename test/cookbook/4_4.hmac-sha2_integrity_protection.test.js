const test = require('ava')

const recipe = require('./recipes').get('4.4')

const { JWS, JWK } = require('../..')

const { input: { payload, key: jwk }, signing: { protected: header } } = recipe

const key = JWK.importKey(jwk)

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
