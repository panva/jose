const test = require('ava')

const recipe = require('./recipes').get('5.8')
const { enc: verifiers } = require('./verifiers')

const { JWE, JWK } = require('../..')

const {
  input: { plaintext, key: jwk },
  encrypting_content: { protected: prot }
} = recipe

const key = JWK.importKey(jwk)

test(`${recipe.title} - compact encrypt`, t => {
  const res = JWE.encrypt(plaintext, key, prot)
  verifiers.compact(t, res, recipe.output.compact)
  t.deepEqual(JWE.decrypt(res, key), Buffer.from(plaintext))
})

test(`${recipe.title} - flattened encrypt`, t => {
  const res = JWE.encrypt.flattened(plaintext, key, prot)
  verifiers.flattened(t, res, recipe.output.json_flat)
  t.deepEqual(JWE.decrypt(res, key), Buffer.from(plaintext))
})

test(`${recipe.title} - general encrypt`, t => {
  const res = JWE.encrypt.general(plaintext, key, prot)
  verifiers.general(t, res, recipe.output.json)
  t.deepEqual(JWE.decrypt(res, key), Buffer.from(plaintext))
})

test(`${recipe.title} - compact decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.compact, key), Buffer.from(plaintext))
})

test(`${recipe.title} - flattened decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json_flat, key), Buffer.from(plaintext))
})

test(`${recipe.title} - general decrypt`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
})
