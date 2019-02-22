const test = require('ava')

const isObject = require('../../lib/help/is_object')
const { JWKS, JWK: { generateSync }, JWE } = require('../..')
const key = generateSync('oct')
const ks = new JWKS.KeyStore(generateSync('ec'), key)

const complete = (t, jwe, k, ...keys) => {
  if (typeof k === 'string') {
    keys.unshift(k)
    k = key
  }
  const decrypted = JWE.decrypt(jwe(), k, { complete: true })
  t.is(Object.values(decrypted).length, keys.length)
  t.true(keys.every(k => k in decrypted))
  if (keys.includes('header')) {
    t.true(isObject(decrypted.header))
  }
  if (keys.includes('protected')) {
    t.true(isObject(decrypted.protected))
  }
  if (keys.includes('unprotected')) {
    t.true(isObject(decrypted.unprotected))
  }
  if (keys.includes('aad')) {
    t.is(typeof decrypted.aad, 'string')
  }
  t.true(Buffer.isBuffer(decrypted.cleartext))
}

test('compact', complete, () => JWE.encrypt('foo', key), 'cleartext', 'protected')
test('flattened', complete, () => JWE.encrypt.flattened('foo', key), 'cleartext', 'protected')
test('flattened w/ aad', complete, () => JWE.encrypt.flattened('foo', key, undefined, undefined, 'bar'), 'cleartext', 'protected', 'aad')
test('flattened w/ unprotected', complete, () => JWE.encrypt.flattened('foo', key, undefined, { foo: 'bar' }), 'cleartext', 'protected', 'unprotected')
test('flattened w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('flattened')
}, 'cleartext', 'protected', 'header')
test('general', complete, () => JWE.encrypt.general('foo', key), 'cleartext', 'protected')
test('general w/ aad', complete, () => JWE.encrypt.general('foo', key, undefined, undefined, 'bar'), 'cleartext', 'protected', 'aad')
test('general w/ unprotected', complete, () => JWE.encrypt.general('foo', key, undefined, { foo: 'bar' }), 'cleartext', 'protected', 'unprotected')
test('general w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('general')
}, 'cleartext', 'protected', 'header')

test('with keystore > compact', complete, () => JWE.encrypt('foo', key), ks, 'cleartext', 'protected')
test('with keystore > flattened', complete, () => JWE.encrypt.flattened('foo', key), ks, 'cleartext', 'protected')
test('with keystore > flattened w/ aad', complete, () => JWE.encrypt.flattened('foo', key, undefined, undefined, 'bar'), ks, 'cleartext', 'protected', 'aad')
test('with keystore > flattened w/ unprotected', complete, () => JWE.encrypt.flattened('foo', key, undefined, { foo: 'bar' }), ks, 'cleartext', 'protected', 'unprotected')
test('with keystore > flattened w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('flattened')
}, ks, 'cleartext', 'protected', 'header')
test('with keystore > general', complete, () => JWE.encrypt.general('foo', key), ks, 'cleartext', 'protected')
test('with keystore > general w/ aad', complete, () => JWE.encrypt.general('foo', key, undefined, undefined, 'bar'), ks, 'cleartext', 'protected', 'aad')
test('with keystore > general w/ unprotected', complete, () => JWE.encrypt.general('foo', key, undefined, { foo: 'bar' }), ks, 'cleartext', 'protected', 'unprotected')
test('with keystore > general w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('general')
}, ks, 'cleartext', 'protected', 'header')
