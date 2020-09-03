const test = require('ava')

if ('electron' in process.versions) return

const recipe = require('./recipes').get('5.13')
const { enc: verifiers } = require('./verifiers')

const { JWE, JWK: { asKey }, JWKS: { KeyStore }, errors } = require('../..')

const {
  input: { plaintext, key: jwks },
  encrypting_content: { protected: prot, unprotected },
  encrypting_key: recipients
} = recipe

const keys = jwks.map((jwk) => asKey(jwk))

const keystoreEmpty = new KeyStore()
const keystore = new KeyStore(...keys)
const keystoreMatchNone = new KeyStore()
keys.forEach(({ kty }) => {
  keystoreMatchNone.generateSync(kty)
})

test(`${recipe.title} - general encrypt`, t => {
  const jwe = new JWE.Encrypt(plaintext, prot, undefined, unprotected)
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
  test(`${recipe.title} - general decrypt - key ${i + 1}`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
  })
})

test(`${recipe.title} - general decrypt - keystore`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json, keystore), Buffer.from(plaintext))
})

test(`${recipe.title} - general decrypt (failing)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY', message: 'no matching key found in the KeyStore' })
})

test(`${recipe.title} - general decrypt (using empty keystore)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreEmpty)
  }, { instanceOf: errors.JWKSNoMatchingKey, code: 'ERR_JWKS_NO_MATCHING_KEY', message: 'no matching key found in the KeyStore' })
})
