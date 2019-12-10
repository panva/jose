const test = require('ava')

const { JWS, JWE, JWK: { asKey, importKey, generate }, errors } = require('../..')

const { edDSASupported, keyObjectSupported } = require('../../lib/help/runtime_support')
const { createSecretKey } = require('../../lib/help/key_object')
const { generateKeyPairSync } = require('../macros/generate')
const fixtures = require('../fixtures')
const base64url = require('../../lib/help/base64url')

test('imports PrivateKeyObject and then its Key instance', t => {
  const k = asKey(generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey)
  t.deepEqual(asKey(k).toJWK(), k.toJWK())
})

test('imports PublicKeyObject and then its Key instance', t => {
  const k = asKey(generateKeyPairSync('ec', { namedCurve: 'P-256' }).publicKey)
  t.deepEqual(asKey(k).toJWK(), k.toJWK())
})

test('imports SecretKeyObject and then its Key instance', t => {
  const k = asKey(createSecretKey(Buffer.from('foo')))
  t.deepEqual(asKey(k).toJWK(), k.toJWK())
})

test('only imports string, object or buffer', t => {
  ;[Buffer, () => {}, async () => {}, true, Infinity, 1].forEach((val) => {
    t.throws(() => {
      asKey(val)
    }, { instanceOf: TypeError, message: 'key argument must be a string, buffer or an object' })
  })
})

test('parameters must be a plain object', t => {
  ;[Buffer, () => {}, async () => {}, true, Infinity, 1, [], Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      asKey('foo', val)
    }, { instanceOf: TypeError, message: 'parameters argument must be a plain object when provided' })
  })
})

Object.entries(fixtures.PEM).forEach(([type, { private: priv, public: pub }]) => {
  if (type === 'P-256K') return
  if ('electron' in process.versions && (type.startsWith('X') || type === 'Ed448' || type === 'secp256k1')) return
  if (!edDSASupported && (type.startsWith('Ed') || type.startsWith('X'))) return

  test(`fails to import ${type} as invalid string`, t => {
    t.throws(() => {
      asKey(priv.toString('ascii').replace(/\n/g, ''))
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
  })
  test(`fails to import ${type} as invalid buffer`, t => {
    t.throws(() => {
      asKey(Buffer.from(priv.toString('ascii').replace(/\n/g, '')))
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
  })
  test(`${type} private can be imported as a string`, t => {
    const k = asKey(priv.toString('ascii'))
    t.true(k.private)
  })
  test(`${type} public can be imported as a string`, t => {
    const k = asKey(pub.toString('ascii'))
    t.true(k.public)
  })
  test(`${type} private can be imported as a buffer`, t => {
    const k = asKey(priv)
    t.true(k.private)
  })
  test(`${type} public can be imported as a buffer`, t => {
    const k = asKey(pub)
    t.true(k.public)
  })
})

test('failed to import throws an error', t => {
  t.throws(() => {
    asKey({
      key: fixtures.PEM.RSA.public,
      format: 'der'
    })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
})

if (!('electron' in process.versions) && keyObjectSupported) {
  ;[
    '-----BEGIN PUBLIC KEY-----\nMIIBtjCCASsGByqGSM44BAEwggEeAoGBANuHjLdqQcKozzWf9fUfe/mw4i5NLT8k\nCIA75k+GNYNbBaGZ2lGNeKsrjHzM8w7mE5k6qx5hDB4n88qFoauqCsUZ4knbTybn\nYV08gfWS375l/EGSpt3c/1dezVZuT/FmEeXbMhOIDORf/9f/6PpEMFN3eghszLvN\ng+L/19HVpWAXAhUAnOFG9vvOiZIz/ZxdpR+EVv8o4T8CgYBDk/ChY3fo4DrxzLZT\n7AjsAiJOzO8QnsV07Gh8gSzUCBsb+Hb4GvMs2U6rB5mxOMib3S2HGbs791uBva2a\nA6pzNzRmgV/w6CyOcxhCkZdVL7MwO9y5iq6V65R4GgfkCrIAYi/BW6XdXOyw/7J0\nt/4wB0/wKtsXf541NLfmUprJ+QOBhAACgYBGbXflbrGGg02+w8Xo6RO+tHoekREZ\nlJA0KKBN4jT0S3/OsLQeHtO7k/gkdMMbXD1J1fae9tIxy1SwYVTR6csgydGuvuyG\nB4A/ZtXEb+dumCBbtw8dyred4Okhl44Fdrs79F1rjSWEcwKqJghxS+GsbA0vcTaf\nAHDL6OblN04uzg==\n-----END PUBLIC KEY-----',
    generateKeyPairSync('dsa', { modulusLength: 1024 }).publicKey,
    generateKeyPairSync('dsa', { modulusLength: 1024 }).privateKey
  ].forEach((unsupported, i) => {
    test(`fails to import unsupported PEM ${i + 1}/4`, t => {
      t.throws(() => {
        asKey(unsupported)
      }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'only RSA, EC and OKP asymmetric keys are supported' })
    })
  })
}

test('minimal RSA test', async t => {
  const key = await generate('RSA')
  const { d, e, n } = key.toJWK(true)
  const minKey = asKey({ kty: 'RSA', d, e, n }, { calculateMissingRSAPrimes: true })
  importKey({ kty: 'RSA', d, e, n }) // deprecated
  key.algorithms('sign').forEach((alg) => {
    JWS.verify(JWS.sign({}, key), minKey, { alg })
    JWS.verify(JWS.sign({}, minKey), key, { alg })
  })
  key.algorithms('wrapKey').forEach((alg) => {
    JWE.decrypt(JWE.encrypt('foo', key), minKey, { alg })
    JWE.decrypt(JWE.encrypt('foo', minKey), key, { alg })
  })
  t.throws(() => {
    asKey({ kty: 'RSA', d: d.substr(3), e, n }, { calculateMissingRSAPrimes: true })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'failed to calculate missing primes' })
  t.throws(() => {
    asKey({ kty: 'RSA', d, e, n })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'importing private RSA keys without all other private key parameters is not enabled, see documentation and its advisory on how and when its ok to enable it' })
  const jwk = {
    kty: 'RSA',
    d: 'YN1ucKFpCsgMuIfTynTbNwEXp2lBkrJYfsVOIGdK3bZMblZqxWElm8HTE06-JH_BC5drAAv1Hu-6SE6-sehq9blG-vMJ0wi-jBYfkhlOLEZJXHPb4aJyS8oWKhVO14qyfS_m2BtAW9Wh5vEOXy7HLgrZWjctm0t1Ipb-b_nfNfisGIMjPdWzu_nTfbzIIwM7wQBGnHLqfQq6iD7I8nSPjsc_gZUeeKYkU_Q6K8tIY0gr850-6wk-Nh9JsPA93lR0woTqqMG6UiFE4Y4Jj3M6puBUSU-R3n-gL35I1Cwa5m0IREG8Bz0RPpAEcRQB1xRuM22xD4yE0I4LDegtH056lw',
    e: 'AQAB',
    n: '1hZ73O4axgytljzb8gCXxdk3Uov_f7U6c_hKH5EtGtr8XdWce1XLLjARqAQfOpbYqkm1ONiIvhQvxvW0a7gXgEw4no9c_Gi8a803O9LZmYAYDxErlvPQPg9KC5cLPChM-Uyxy4TOakjw1ysUKBX7zXpb_1TIOnlhOYeDbejLkp8sR7BJIsDNxqtkV4KHLWQ9pKsMU28itblQ8nN8UJI5Js4UbR-b417uQ9jIVRhWlDjp11sXYqfnqShCDYGYmLL2IHTVf8tTmEOWsNWcE2nT-qMTGMOq2DBkyr31lxc-4eQXZuwcrk_58xQ69xSrdrsy8J11O50nbvwcqFhjeMV2VQ'
  }
  t.throws(() => {
    asKey({ kty: 'RSA', d: `${jwk.d}FF`, e: jwk.e, n: jwk.n }, { calculateMissingRSAPrimes: true })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID', message: 'invalid RSA private exponent' })
})

test('fails to import RSA without all optimization parameters', async t => {
  const full = (await generate('RSA')).toJWK(true)
  for (const param of ['p', 'q', 'dp', 'dq', 'qi']) {
    const { [param]: omit, ...jwk } = full
    t.throws(() => {
      asKey(jwk)
    }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID', message: 'all other private key parameters must be present when any one of them is present' })
  }
})

test('fails to import JWK RSA with oth', async t => {
  const jwk = (await generate('RSA')).toJWK(true)
  t.throws(() => {
    asKey({
      ...jwk,
      oth: []
    })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'Private RSA keys with more than two primes are not supported' })
})

test('invalid encoded jwk import', async t => {
  const jwk = (await generate('oct')).toJWK(true)

  jwk.k = base64url.decodeToBuffer(jwk.k).toString('base64')

  t.throws(() => {
    asKey(jwk)
  }, { instanceOf: errors.JOSEInvalidEncoding, code: 'ERR_JOSE_INVALID_ENCODING', message: 'input is not a valid base64url encoded string' })
})

test('invalid encoded oct jwk import', async t => {
  const jwk = (await generate('EC')).toJWK(true)

  jwk.d = base64url.decodeToBuffer(jwk.d).toString('base64')

  t.throws(() => {
    asKey(jwk)
  }, { instanceOf: errors.JOSEInvalidEncoding, code: 'ERR_JOSE_INVALID_ENCODING', message: 'input is not a valid base64url encoded string' })
})

if (keyObjectSupported) {
  test('importing a certificate file populates the certificate properties', t => {
    const key = asKey(`-----BEGIN CERTIFICATE-----
MIIC4DCCAcgCCQDO8JBSH914NDANBgkqhkiG9w0BAQsFADAyMQswCQYDVQQGEwJD
WjEPMA0GA1UEBwwGUHJhZ3VlMRIwEAYDVQQDDAlwa210bHN0d28wHhcNMTkwNjE4
MTIzMjAxWhcNMjAwNjE3MTIzMjAxWjAyMQswCQYDVQQGEwJDWjEPMA0GA1UEBwwG
UHJhZ3VlMRIwEAYDVQQDDAlwa210bHN0d28wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQDhqVAaMsvnCETzDtKwfKxZC1jwIOhIyUp8xp+2oN+pJwtqP0Up
kLlTV7MD94HZSL3n3f9hsG6appRQGGAJ2ThOw1N9zlAr7Sk9YH6Gtu3bYSDvS6wa
KjVoxGrrmLfyuoEbv3PDqMWuOjE3MT/G1nwUBgIEKYAr8hizY8dUE0Z2qWvKFZJj
6etjCXEppjXuwlSusHWw/tj/ePMMxMAJMPPhzJeh6AL7iUKBisJysPuaWrS9ntdP
xv9PS40sv6cZT4woxmE6tpTCkAxabXqA25SgJOyKOjnvg+BPNlrucLqHw3ErWrxY
TL99cHqhexO6K4FaspW3+1kuWd3fY4Cm+zkTAgMBAAEwDQYJKoZIhvcNAQELBQAD
ggEBALsB6MGWke5vS1TB3Z+NJkC29bEIb3XGC9WaxRovH0jqaaua2AfAF7VZzUyW
S/+r6hvWOtqUVy7YF1ThnEJXuXJG9ra2B2+F5RYNCtrVj6Bi+zDTSJ4IvQfrF0XB
KwwOdRu7VJpAxvweA/3woKl6Cjfy20ZupPH9mxr1R78BMKgEtdFsiLwbB7MOdDbT
LsrUcEcupXv+gZek22upQKrAk/XFP067KIqKmCEhDidxhP251SloUaruv9cHEx0a
DKol9eR465FAiBLvg2N7qJHCKlWdn99SgN4Y3kINsuFR7Tj4QIJZNubOjV0YeOgn
AWzRJlZD89KZAQgjj4Z215QeLxA=
-----END CERTIFICATE-----`)
    t.truthy(key.x5c)
    t.truthy(key.x5t)
    t.truthy(key['x5t#S256'])
  })
}
