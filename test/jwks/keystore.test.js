const test = require('ava')

const { KeyStore, asKeyStore } = require('../../lib/jwks')
const { asKey, generateSync } = require('../../lib/jwk')
const errors = require('../../lib/errors')

const withX5C = {
  kty: 'RSA',
  n: 'vrjOfz9Ccdgx5nQudyhdoR17V-IubWMeOZCwX_jj0hgAsz2J_pqYW08PLbK_PdiVGKPrqzmDIsLI7sA25VEnHU1uCLNwBuUiCO11_-7dYbsr4iJmG0Qu2j8DsVyT1azpJC_NG84Ty5KKthuCaPod7iI7w0LK9orSMhBEwwZDCxTWq4aYWAchc8t-emd9qOvWtVMDC2BXksRngh6X5bUYLy6AyHKvj-nUy1wgzjYQDwHMTplCoLtU-o-8SNnZ1tmRoGE9uJkBLdh5gFENabWnU5m1ZqZPdwS-qo-meMvVfJb6jJVWRpl2SUtCnYG2C32qvbWbjZ_jBPD5eunqsIo1vQ',
  e: 'AQAB',
  x5c: [
    'MIIDQjCCAiqgAwIBAgIGATz/FuLiMA0GCSqGSIb3DQEBBQUAMGIxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDTzEPMA0GA1UEBxMGRGVudmVyMRwwGgYDVQQKExNQaW5nIElkZW50aXR5IENvcnAuMRcwFQYDVQQDEw5CcmlhbiBDYW1wYmVsbDAeFw0xMzAyMjEyMzI5MTVaFw0xODA4MTQyMjI5MTVaMGIxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDTzEPMA0GA1UEBxMGRGVudmVyMRwwGgYDVQQKExNQaW5nIElkZW50aXR5IENvcnAuMRcwFQYDVQQDEw5CcmlhbiBDYW1wYmVsbDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL64zn8/QnHYMeZ0LncoXaEde1fiLm1jHjmQsF/449IYALM9if6amFtPDy2yvz3YlRij66s5gyLCyO7ANuVRJx1NbgizcAblIgjtdf/u3WG7K+IiZhtELto/A7Fck9Ws6SQvzRvOE8uSirYbgmj6He4iO8NCyvaK0jIQRMMGQwsU1quGmFgHIXPLfnpnfajr1rVTAwtgV5LEZ4Iel+W1GC8ugMhyr4/p1MtcIM42EA8BzE6ZQqC7VPqPvEjZ2dbZkaBhPbiZAS3YeYBRDWm1p1OZtWamT3cEvqqPpnjL1XyW+oyVVkaZdklLQp2Btgt9qr21m42f4wTw+Xrp6rCKNb0CAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAh8zGlfSlcI0o3rYDPBB07aXNswb4ECNIKG0CETTUxmXl9KUL+9gGlqCz5iWLOgWsnrcKcY0vXPG9J1r9AqBNTqNgHq2G03X09266X5CpOe1zFo+Owb1zxtp3PehFdfQJ610CDLEaS9V9Rqp17hCyybEpOGVwe8fnk+fbEL2Bo3UPGrpsHzUoaGpDftmWssZkhpBJKVMJyf/RuP2SmmaIzmnw9JiSlYhzo4tpzd5rFXhjRbg4zW9C+2qok+2+qDM1iJ684gPHMIY8aLWrdgQTxkumGmTqgawR+N5MDtdPTEQ0XfIBc2cJEUyMTY5MPvACWpkA6SdS4xSvdXK3IVfOWA=='
  ]
}

test('constructor', t => {
  t.notThrows(() => {
    new KeyStore() // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore(generateSync('EC')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore(generateSync('EC'), generateSync('EC')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore([generateSync('EC')], generateSync('EC')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore([[generateSync('EC')], generateSync('EC')]) // eslint-disable-line no-new
  })
})

test('constructor only accepts Key instances created through JWK.asKey', t => {
  t.throws(() => {
    new KeyStore({}) // eslint-disable-line no-new
  }, { instanceOf: TypeError, message: 'all keys must be an instances of a key instantiated by JWK.asKey' })
})

test('.generate()', async t => {
  const ks = new KeyStore()
  await ks.generate('EC')
  t.is(ks.size, 1)
})

test('.generateSync()', t => {
  const ks = new KeyStore()
  ks.generateSync('EC')
  t.is(ks.size, 1)
})

test('.add()', t => {
  const ks = new KeyStore()
  const k = generateSync('EC')
  ks.add(k)
  ks.add(k)
  t.is(ks.size, 1)
  t.throws(() => {
    ks.add({})
  }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey' })
})

test('.remove()', t => {
  const k = generateSync('EC')
  const ks = new KeyStore(k)
  ks.remove(k)
  t.is(ks.size, 0)
  ks.remove(k)
  t.throws(() => {
    ks.remove({})
  }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey' })
})

test('.all() key_ops must be an array', t => {
  const ks = new KeyStore()
  t.throws(() => {
    ks.all({ key_ops: 'wrapKey' })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings' })
})

test('.all() key_ops must not be empty', t => {
  const ks = new KeyStore()
  t.throws(() => {
    ks.all({ key_ops: [] })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings' })
})

test('.all() key_ops must only contain strings', t => {
  const ks = new KeyStore()
  t.throws(() => {
    ks.all({ key_ops: ['wrapKey', true] })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings' })
})

test('.all() with key_ops when keys have key_ops', t => {
  const k = generateSync('RSA', undefined, { key_ops: ['sign', 'verify'] })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ key_ops: ['wrapKey'] }), [])
  t.deepEqual(ks.all({ key_ops: ['sign', 'wrapKey'] }), [])
  t.deepEqual(ks.all({ key_ops: ['sign'] }), [k])
  t.deepEqual(ks.all({ key_ops: ['verify'] }), [k])
  t.deepEqual(ks.all({ key_ops: ['sign', 'verify'] }), [k])
  t.is(ks.get({ key_ops: ['wrapKey'] }), undefined)
  t.is(ks.get({ key_ops: ['sign', 'wrapKey'] }), undefined)
  t.is(ks.get({ key_ops: ['sign'] }), k)
  t.is(ks.get({ key_ops: ['verify'] }), k)
  t.is(ks.get({ key_ops: ['sign', 'verify'] }), k)
})

test('.all() with key_ops when keys have derived key_ops from use', t => {
  const k = generateSync('RSA', undefined, { use: 'sig' })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ key_ops: ['wrapKey'] }), [])
  t.deepEqual(ks.all({ key_ops: ['sign', 'wrapKey'] }), [])
  t.deepEqual(ks.all({ key_ops: ['sign'] }), [k])
  t.deepEqual(ks.all({ key_ops: ['verify'] }), [k])
  t.deepEqual(ks.all({ key_ops: ['sign', 'verify'] }), [k])
  t.is(ks.get({ key_ops: ['wrapKey'] }), undefined)
  t.is(ks.get({ key_ops: ['sign', 'wrapKey'] }), undefined)
  t.is(ks.get({ key_ops: ['sign'] }), k)
  t.is(ks.get({ key_ops: ['verify'] }), k)
  t.is(ks.get({ key_ops: ['sign', 'verify'] }), k)
})

test('.get() with key_ops ranks keys with defined key_ops higher', t => {
  const k = generateSync('RSA')
  const k2 = generateSync('RSA', undefined, { use: 'sig' })
  const k3 = generateSync('RSA', undefined, { key_ops: ['sign', 'verify'] })
  const ks = new KeyStore(k, k2, k3)

  t.deepEqual(ks.all({ key_ops: ['sign'] }), [k3, k, k2])
  t.deepEqual(ks.get({ key_ops: ['sign'] }), k3)
})

test('.all() and .get() use filter', t => {
  const k = generateSync('RSA', undefined, { use: 'sig' })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ use: 'enc' }), [])
  t.deepEqual(ks.all({ use: 'sig' }), [k])
  t.is(ks.get({ use: 'enc' }), undefined)
  t.is(ks.get({ use: 'sig' }), k)
})

test('.all() and .get() use sort', t => {
  const k = generateSync('RSA')
  const k2 = generateSync('RSA', undefined, { use: 'sig' })
  const ks = new KeyStore(k, k2)
  t.deepEqual(ks.all({ use: 'sig' }), [k2, k])
  t.is(ks.get({ use: 'sig' }), k2)
})

test('.all() and .get() kid filter', t => {
  const k = generateSync('RSA', undefined, { kid: 'foobar' })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ kid: 'baz' }), [])
  t.deepEqual(ks.all({ kid: 'foobar' }), [k])
  t.is(ks.get({ kid: 'baz' }), undefined)
  t.is(ks.get({ kid: 'foobar' }), k)
})

test('.all() and .get() x5t filter and sort', t => {
  const k = asKey(withX5C)
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ x5t: 'baz' }), [])
  t.deepEqual(ks.all({ x5t: '4pNenEBLv0JpLIdugWxQkOsZcK0' }), [k])
  t.is(ks.get({ x5t: 'baz' }), undefined)
  t.is(ks.get({ x5t: '4pNenEBLv0JpLIdugWxQkOsZcK0' }), k)
  const k2 = asKey({ ...withX5C, alg: 'RS256' })
  ks.add(k2)
  t.is(ks.get({ x5t: '4pNenEBLv0JpLIdugWxQkOsZcK0', alg: 'RS256' }), k2)
})

test('.all() and .get() x5t#S256 filter and sort', t => {
  const k = asKey(withX5C)
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ 'x5t#S256': 'baz' }), [])
  t.deepEqual(ks.all({ 'x5t#S256': 'pJm2BBpkB8y7tCqrWM0X37WOmQTO8zQw-VpxVgBb21I' }), [k])
  t.is(ks.get({ 'x5t#S256': 'baz' }), undefined)
  t.is(ks.get({ 'x5t#S256': 'pJm2BBpkB8y7tCqrWM0X37WOmQTO8zQw-VpxVgBb21I' }), k)
  const k2 = asKey({ ...withX5C, alg: 'RS256' })
  ks.add(k2)
  t.is(ks.get({ 'x5t#S256': 'pJm2BBpkB8y7tCqrWM0X37WOmQTO8zQw-VpxVgBb21I', alg: 'RS256' }), k2)
})

test('.all() and .get() kty filter', t => {
  const ks = new KeyStore()
  ks.generateSync('RSA')
  ks.generateSync('EC')
  ks.generateSync('oct')
  t.is(ks.all({ kty: 'oct' }).length, 1)
  t.is(ks.all({ kty: 'RSA' }).length, 1)
  t.is(ks.all({ kty: 'EC' }).length, 1)
})

test('.all() and .get() alg filter', t => {
  const k = generateSync('RSA')
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ alg: 'HS256' }), [])
  t.deepEqual(ks.all({ alg: 'RS256' }), [k])
  t.is(ks.get({ alg: 'HS256' }), undefined)
  t.is(ks.get({ alg: 'RS256' }), k)
})

test('.all() and .get() alg sort', t => {
  const k = generateSync('RSA')
  const k2 = generateSync('RSA', undefined, { alg: 'RS256' })
  const ks = new KeyStore(k, k2)
  t.deepEqual(ks.all({ alg: 'HS256' }), [])
  t.deepEqual(ks.all({ alg: 'RS256' }), [k2, k])
  t.is(ks.get({ alg: 'HS256' }), undefined)
  t.is(ks.get({ alg: 'RS256' }), k2)
})

test('.asKeyStore()', t => {
  const ks = new KeyStore()
  ks.generateSync('EC')
  ks.generateSync('RSA')

  const ks2 = asKeyStore(ks.toJWKS())
  t.true(ks2 instanceof KeyStore)
  t.is(ks2.size, 2)
})

test('.asKeyStore() input validation', t => {
  [Buffer, 1, false, '', 'foo', {}, { foo: 'bar' }].forEach((val) => {
    t.throws(() => {
      asKeyStore(val)
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
    t.throws(() => {
      asKeyStore({ keys: val })
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
    t.throws(() => {
      asKeyStore({ keys: [val] })
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
  })
})

test('keystore instance is an iterator', t => {
  const ks = new KeyStore()
  ks.generateSync('EC')
  ks.generateSync('RSA')
  for (const key of ks) {
    t.truthy(key)
  }
  t.pass()
})

test('minimal RSA test', async t => {
  const key = generateSync('RSA')
  const { d, e, n } = key.toJWK(true)
  asKeyStore({ keys: [{ kty: 'RSA', d, e, n }] }, { calculateMissingRSAPrimes: true })
  KeyStore.fromJWKS({ keys: [{ kty: 'RSA', d, e, n }] }) // deprecated
  t.throws(() => {
    asKeyStore({ keys: [{ kty: 'RSA', d: d.substr(1), e, n }] }, { calculateMissingRSAPrimes: true })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'failed to calculate missing primes' })
  t.throws(() => {
    asKeyStore({ keys: [{ kty: 'RSA', d, e, n }] })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'importing private RSA keys without all other private key parameters is not enabled, see documentation and its advisory on how and when its ok to enable it' })
  t.throws(() => {
    asKeyStore({ keys: [{ kty: 'RSA', d: `${d}F`, e, n }] }, { calculateMissingRSAPrimes: true })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID', message: 'invalid RSA private exponent' })
})
