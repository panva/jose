const test = require('ava')

const recipe = require('./recipes').get('4.3')
const { sig: verifiers } = require('./verifiers')

const { JWS, JWK: { importKey, generateSync }, JWKS: { KeyStore }, errors: { JWSVerificationFailed } } = require('../..')

const { input: { payload, key: jwk }, signing: { protected: header } } = recipe

const key = importKey(jwk)

const keystoreEmpty = new KeyStore()
const keystoreMatchOne = new KeyStore(generateSync(key.kty, key.crv, { alg: key.alg, use: key.use }), key)
const keystoreMatchMore = new KeyStore(generateSync(key.kty, key.crv, { alg: key.alg, use: key.use, kid: key.kid }), key, importKey(key))
const keystoreMatchNone = new KeyStore(generateSync(key.kty), generateSync(key.kty))

test(`${recipe.title} - compact sign (random)`, t => {
  const res = JWS.sign(payload, key, header)
  verifiers.compact(t, res, recipe.output.compact)
  t.is(JWS.verify(res, key), payload)
})

test(`${recipe.title} - flattened sign (random)`, t => {
  const res = JWS.sign.flattened(payload, key, header)
  verifiers.flattened(t, res, recipe.output.json_flat)
  t.is(JWS.verify(res, key), payload)
})

test(`${recipe.title} - general sign (random)`, t => {
  const res = JWS.sign.general(payload, key, header)
  verifiers.general(t, res, recipe.output.json)
  t.is(JWS.verify(res, key), payload)
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

;[keystoreMatchOne, keystoreMatchMore].forEach((keystore, i) => {
  test(`${recipe.title} - compact verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.compact, keystore), payload)
  })

  test(`${recipe.title} - flattened verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json_flat, keystore), payload)
  })

  test(`${recipe.title} - general verify (using keystore ${i + 1}/2)`, t => {
    t.is(JWS.verify(recipe.output.json, keystore), payload)
  })
})

test(`${recipe.title} - compact verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.compact, keystoreMatchNone)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - flattened verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json_flat, keystoreMatchNone)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - general verify (failing)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - compact verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.compact, keystoreEmpty)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - flattened verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json_flat, keystoreEmpty)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test(`${recipe.title} - general verify (using empty keystore)`, t => {
  t.throws(() => {
    JWS.verify(recipe.output.json, keystoreEmpty)
  }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})
