const test = require('ava')

const recipe = require('./recipes').get('5.13')

const { JWE, JWK } = require('../..')

const { input: { plaintext, key: jwks } } = recipe

const keys = jwks.map((jwk) => JWK.importKey(jwk))

// TODO: encrypt

keys.forEach((key, i) => {
  test(`${recipe.title} - general verify - key ${i + 1}`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
  })
})
