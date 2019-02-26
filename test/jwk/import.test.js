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

test('failed to import throws an error', t => {
  t.throws(() => {
    importKey({
      key: fixtures.PEM.RSA.public,
      format: 'der'
    })
  }, { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED' })
})
