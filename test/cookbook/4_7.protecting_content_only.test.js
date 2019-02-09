const test = require('ava')

const recipe = require('./recipes').get('4.7')

const { JWS, JWK } = require('../..')

const { input: { payload, key: jwk }, signing: { unprotected } } = recipe

const key = JWK.importKey(jwk)

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
