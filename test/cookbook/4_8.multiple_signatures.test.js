const test = require('ava')

const recipe = require('./recipes').get('4.8')

const { JWS, JWK: { importKey }, JWKS: { KeyStore }, errors: { JWSVerificationFailed } } = require('../..')

const { input: { payload, key: jwks }, signing: recipients } = recipe

const keys = jwks.map((jwk) => importKey(jwk))

const keystoreEmpty = new KeyStore()
const keystore = new KeyStore(...keys)
const keystoreMatchNone = new KeyStore()
keys.forEach(({ kty }) => {
  keystoreMatchNone.generateSync(kty)
})

test(`${recipe.title} - general sign`, t => {
  const jws = new JWS.Sign(payload)

  keys.forEach((key, i) => {
    const { protected: protec, unprotected } = recipients[i]
    jws.recipient(key, protec, unprotected)
  })

  // t.deepEqual(jws.sign('general'), recipe.output.json) // EC cannot be reproduced

  const result = jws.sign('general')
  t.is(result.payload, recipe.output.json.payload)
  t.deepEqual(result.signatures[0], recipe.output.json.signatures[0])
  // t.deepEqual(result.signatures[1], recipe.output.json.signatures[1]) // EC cannot be reproduced
  t.deepEqual(result.signatures[2], recipe.output.json.signatures[2])

  keys.forEach((key) => {
    t.is(JWS.verify(recipe.output.json, key), payload)
  })
})

keys.forEach((key, i) => {
  test(`${recipe.title} - general verify - key ${i + 1}`, t => {
    t.is(JWS.verify(recipe.output.json, key), payload)
  })
})

test(`${recipe.title} - general verify - keystore`, t => {
  t.is(JWS.verify(recipe.output.json, keystore), payload)
})

test(`${recipe.title} - general verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - general verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreEmpty)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})
