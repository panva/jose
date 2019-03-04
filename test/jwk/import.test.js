const test = require('ava')
const crypto = require('crypto')

const { JWK: { importKey }, errors } = require('../..')

const fixtures = require('../fixtures')

test('imports PrivateKeyObject and then its Key instance', t => {
  const k = importKey(crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey)
  t.deepEqual(importKey(k).toJWK(), k.toJWK())
})

test('imports PublicKeyObject and then its Key instance', t => {
  const k = importKey(crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' }).publicKey)
  t.deepEqual(importKey(k).toJWK(), k.toJWK())
})

test('imports SecretKeyObject and then its Key instance', t => {
  const k = importKey(crypto.createSecretKey(Buffer.from('foo')))
  t.deepEqual(importKey(k).toJWK(), k.toJWK())
})

test('only imports string, object or buffer', t => {
  ;[Buffer, () => {}, async () => {}, true, Infinity, 1].forEach((val) => {
    t.throws(() => {
      importKey(val)
    }, { instanceOf: TypeError, message: 'key argument must be a string, buffer or an object' })
  })
})

test('parameters must be a plain object', t => {
  ;[Buffer, () => {}, async () => {}, true, Infinity, 1, [], Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      importKey('foo', val)
    }, { instanceOf: TypeError, message: 'parameters argument must be a plain object when provided' })
  })
})

Object.entries(fixtures.PEM).forEach(([type, { private: priv, public: pub }]) => {
  test(`${type} private can be imported as a string`, t => {
    const k = importKey(priv.toString('ascii'))
    t.true(k.private)
  })
  test(`${type} public can be imported as a string`, t => {
    const k = importKey(pub.toString('ascii'))
    t.true(k.public)
  })
  test(`${type} private can be imported as a buffer`, t => {
    const k = importKey(priv)
    t.true(k.private)
  })
  test(`${type} public can be imported as a buffer`, t => {
    const k = importKey(pub)
    t.true(k.public)
  })
})

test('failed to import throws an error', t => {
  t.throws(() => {
    importKey({
      key: fixtures.PEM.RSA.public,
      format: 'der'
    })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
})

;[
  `-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIHXLsXm1lsq5HtyqJwQyFmpfEluuf0KOqP6DqMgGxxDL\n-----END PRIVATE KEY-----`,
  `-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAEXRYV3v5ucrHVR3mKqyPXxXqU34lASwc7Y7MoOvaqcs=\n-----END PUBLIC KEY-----`,
  `-----BEGIN PRIVATE KEY-----\nMEcCAQAwBQYDK2VxBDsEObxytD95dGN3Hxk7kVk+Lig1rGYTRr3YdaHjRog++Sgk\nQD7KwKmxroBURtkE2N0JbQ3ctdrpGRB5DQ==\n-----END PRIVATE KEY-----`,
  `-----BEGIN PUBLIC KEY-----\nMEMwBQYDK2VxAzoAIESY3jnpGdB5UVJDCznrv0vmBFIzgSMu+gafsbCX1rFtsJwR\nM6XUDQiEY7dk6rmm/Fktyawna5EA\n-----END PUBLIC KEY-----`
].forEach((unsupported, i) => {
  test.skip(`fails to import unsupported PEM ${i + 1}/4`, t => {
    t.throws(() => {
      importKey(unsupported)
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
  })
})
