const test = require('ava')

const recipe = require('./recipes').get('5.13')
const { enc: verifiers } = require('./verifiers')

const { JWE, JWK: { importKey }, JWKS: { KeyStore }, errors: { JWEDecryptionFailed } } = require('../..')

const {
  input: { plaintext, key: jwks },
  encrypting_content: { protected: prot, unprotected },
  encrypting_key: recipients
} = recipe

const keys = jwks.map((jwk) => importKey(jwk))

const keystoreEmpty = new KeyStore()
const keystore = new KeyStore(...keys)
const keystoreMatchNone = new KeyStore()
keys.forEach(({ kty }) => {
  keystoreMatchNone.generateSync(kty)
})

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
  test(`${recipe.title} - general decrypt - key ${i + 1}`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json, key), Buffer.from(plaintext))
  })
})

test(`${recipe.title} - general decrypt - keystore`, t => {
  t.deepEqual(JWE.decrypt(recipe.output.json, keystore), Buffer.from(plaintext))
})

test(`${recipe.title} - general verify (failing)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - general verify (using empty keystore)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreEmpty)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})
