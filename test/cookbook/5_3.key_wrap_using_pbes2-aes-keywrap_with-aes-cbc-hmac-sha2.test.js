const test = require('ava')

const recipe = require('./recipes').get('5.3')

const { JWE, JWK } = require('../..')

const { input: { plaintext, pwd } } = recipe

const key = JWK.importKey(Buffer.from(pwd))

test(`${recipe.title} - compact decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.compact, key), Buffer.from(plaintext))
})

test(`${recipe.title} - flattened decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json_flat, key), Buffer.from(plaintext))
})

test(`${recipe.title} - general decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
})
