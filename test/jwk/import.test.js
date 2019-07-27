const test = require('ava')
const crypto = require('crypto')

const { JWS, JWE, JWK: { asKey, importKey, generate }, errors } = require('../..')

const fixtures = require('../fixtures')

test('imports PrivateKeyObject and then its Key instance', t => {
  const k = asKey(crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey)
  t.deepEqual(asKey(k).toJWK(), k.toJWK())
})

test('imports PublicKeyObject and then its Key instance', t => {
  const k = asKey(crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' }).publicKey)
  t.deepEqual(asKey(k).toJWK(), k.toJWK())
})

test('imports SecretKeyObject and then its Key instance', t => {
  const k = asKey(crypto.createSecretKey(Buffer.from('foo')))
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

if (!('electron' in process.versions)) {
  ;[
    `-----BEGIN PUBLIC KEY-----\nMIIBtjCCASsGByqGSM44BAEwggEeAoGBANuHjLdqQcKozzWf9fUfe/mw4i5NLT8k\nCIA75k+GNYNbBaGZ2lGNeKsrjHzM8w7mE5k6qx5hDB4n88qFoauqCsUZ4knbTybn\nYV08gfWS375l/EGSpt3c/1dezVZuT/FmEeXbMhOIDORf/9f/6PpEMFN3eghszLvN\ng+L/19HVpWAXAhUAnOFG9vvOiZIz/ZxdpR+EVv8o4T8CgYBDk/ChY3fo4DrxzLZT\n7AjsAiJOzO8QnsV07Gh8gSzUCBsb+Hb4GvMs2U6rB5mxOMib3S2HGbs791uBva2a\nA6pzNzRmgV/w6CyOcxhCkZdVL7MwO9y5iq6V65R4GgfkCrIAYi/BW6XdXOyw/7J0\nt/4wB0/wKtsXf541NLfmUprJ+QOBhAACgYBGbXflbrGGg02+w8Xo6RO+tHoekREZ\nlJA0KKBN4jT0S3/OsLQeHtO7k/gkdMMbXD1J1fae9tIxy1SwYVTR6csgydGuvuyG\nB4A/ZtXEb+dumCBbtw8dyred4Okhl44Fdrs79F1rjSWEcwKqJghxS+GsbA0vcTaf\nAHDL6OblN04uzg==\n-----END PUBLIC KEY-----`,
    crypto.generateKeyPairSync('dsa', { modulusLength: 1024 }).publicKey,
    crypto.generateKeyPairSync('dsa', { modulusLength: 1024 }).privateKey
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
    asKey({ kty: 'RSA', d: d.substr(1), e, n }, { calculateMissingRSAPrimes: true })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'failed to calculate missing primes' })
  t.throws(() => {
    asKey({ kty: 'RSA', d, e, n })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'importing private RSA keys without all other private key parameters is not enabled, see documentation and its advisory on how and when its ok to enable it' })
  t.throws(() => {
    asKey({ kty: 'RSA', d: `${d}F`, e, n }, { calculateMissingRSAPrimes: true })
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
