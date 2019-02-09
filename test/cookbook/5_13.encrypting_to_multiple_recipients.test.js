const test = require('ava')

const recipe = require('./recipes').get('5.13')
const { enc: verifiers } = require('./verifiers')

const { JWE, JWK } = require('../..')

const {
  input: { plaintext, key: jwks },
  encrypting_content: { protected: prot, unprotected },
  encrypting_key: recipients
} = recipe

const keys = jwks.map((jwk) => JWK.importKey(jwk))

test(`${recipe.title} - general encrypt`, t => {
  const jwe = new JWE.Encrypt(plaintext, prot, unprotected)
  keys.forEach((key, i) => {
    jwe.recipient(key, recipients[i].header)
  })
  const res = jwe.encrypt('general')
  verifiers.general(t, res, recipe.output.json)

  keys.forEach((key, i) => {
    t.deepEqual(JWE.decrypt(res, key), Buffer.from(plaintext))
  })
})

keys.forEach((key, i) => {
  test(`${recipe.title} - general verify - key ${i + 1}`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
  })
})
