const test = require('ava')

const recipe = require('./recipes').get('5.4')
const { enc: verifiers } = require('./verifiers')

const { JWE, JWK: { importKey, generateSync }, JWKS: { KeyStore }, errors: { JWEDecryptionFailed } } = require('../..')

const {
  input: { plaintext, key: jwk },
  encrypting_content: { protected: prot }
} = recipe

const key = importKey(jwk)

const keystoreEmpty = new KeyStore()
const keystoreMatchOne = new KeyStore(generateSync(key.kty, key.crv, { alg: key.alg, use: key.use }), key)
const keystoreMatchMore = new KeyStore(generateSync(key.kty, key.crv, { alg: key.alg, use: key.use, kid: key.kid }), key, importKey(key))
const keystoreMatchNone = new KeyStore(generateSync(key.kty), generateSync(key.kty))

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

;[keystoreMatchOne, keystoreMatchMore].forEach((keystore, i) => {
  test(`${recipe.title} - compact decrypt (using keystore ${i + 1}/2)`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.compact, keystore), Buffer.from(plaintext))
  })

  test(`${recipe.title} - flattened decrypt (using keystore ${i + 1}/2)`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json_flat, keystore), Buffer.from(plaintext))
  })

  test(`${recipe.title} - general decrypt (using keystore ${i + 1}/2)`, t => {
    t.deepEqual(JWE.decrypt(recipe.output.json, keystore), Buffer.from(plaintext))
  })
})

test(`${recipe.title} - compact verify (failing)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.compact, keystoreMatchNone)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - flattened verify (failing)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json_flat, keystoreMatchNone)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - general verify (failing)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreMatchNone)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - compact verify (using empty keystore)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.compact, keystoreEmpty)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - flattened verify (using empty keystore)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json_flat, keystoreEmpty)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test(`${recipe.title} - general verify (using empty keystore)`, t => {
  t.throws(() => {
    JWE.decrypt(recipe.output.json, keystoreEmpty)
  }, { instanceOf: JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})
