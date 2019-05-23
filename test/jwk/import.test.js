const test = require('ava')
const crypto = require('crypto')

const { JWK: { importKey, generate }, errors } = require('../..')

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
  test(`fails to import ${type} as invalid string`, t => {
    t.throws(() => {
      importKey(priv.toString('ascii').replace(/\n/g, ''))
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
  })
  test(`fails to import ${type} as invalid buffer`, t => {
    t.throws(() => {
      importKey(Buffer.from(priv.toString('ascii').replace(/\n/g, '')))
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
  })
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
  `-----BEGIN PUBLIC KEY-----\nMIIBtjCCASsGByqGSM44BAEwggEeAoGBANuHjLdqQcKozzWf9fUfe/mw4i5NLT8k\nCIA75k+GNYNbBaGZ2lGNeKsrjHzM8w7mE5k6qx5hDB4n88qFoauqCsUZ4knbTybn\nYV08gfWS375l/EGSpt3c/1dezVZuT/FmEeXbMhOIDORf/9f/6PpEMFN3eghszLvN\ng+L/19HVpWAXAhUAnOFG9vvOiZIz/ZxdpR+EVv8o4T8CgYBDk/ChY3fo4DrxzLZT\n7AjsAiJOzO8QnsV07Gh8gSzUCBsb+Hb4GvMs2U6rB5mxOMib3S2HGbs791uBva2a\nA6pzNzRmgV/w6CyOcxhCkZdVL7MwO9y5iq6V65R4GgfkCrIAYi/BW6XdXOyw/7J0\nt/4wB0/wKtsXf541NLfmUprJ+QOBhAACgYBGbXflbrGGg02+w8Xo6RO+tHoekREZ\nlJA0KKBN4jT0S3/OsLQeHtO7k/gkdMMbXD1J1fae9tIxy1SwYVTR6csgydGuvuyG\nB4A/ZtXEb+dumCBbtw8dyred4Okhl44Fdrs79F1rjSWEcwKqJghxS+GsbA0vcTaf\nAHDL6OblN04uzg==\n-----END PUBLIC KEY-----`,
  crypto.generateKeyPairSync('dsa', { modulusLength: 1024 }).publicKey,
  crypto.generateKeyPairSync('dsa', { modulusLength: 1024 }).privateKey
].forEach((unsupported, i) => {
  test(`fails to import unsupported PEM ${i + 1}/4`, t => {
    t.throws(() => {
      importKey(unsupported)
    }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'only RSA, EC and OKP asymmetric keys are supported' })
  })
})


test('fails to import RSA without all optimization parameters', async t => {
  const full = (await generate('RSA')).toJWK(true)
  for (const param of ['p', 'q', 'dp', 'dq', 'qi']) {
    const { [param]: omit, ...jwk } = full
    t.throws(() => {
      importKey(jwk)
    }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'all other private key parameters must be present when any one of them is present' })
  }
})

test('fails to import JWK RSA with oth', async t => {
  const jwk = (await generate('RSA')).toJWK(true)
  t.throws(() => {
    importKey({
      ...jwk,
      oth: []
    })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'Private RSA keys with more than two primes are not supported' })
})
