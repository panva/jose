const test = require('ava')

const recipe = require('./recipes').get('5.12')

const { JWE, JWK } = require('../..')

const { input: { plaintext, key: jwk } } = recipe

const key = JWK.importKey(jwk)

// TODO: encrypt

test(`${recipe.title} - flattened decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json_flat, key), Buffer.from(plaintext))
})

test(`${recipe.title} - general decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
})
