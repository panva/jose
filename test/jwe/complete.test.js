const test = require('ava')

const isObject = require('../../lib/help/is_object')
const Key = require('../../lib/jwk/key/base')
const { JWKS, JWK: { generateSync }, JWE } = require('../..')
const key = generateSync('oct')
const ks = new JWKS.KeyStore(generateSync('EC'), key)

const complete = (t, jwe, k, ...keys) => {
  if (typeof k === 'string') {
    keys.unshift(k)
    k = key
  }
  const decrypted = JWE.decrypt(jwe(), k, { complete: true })
  t.is(Object.values(decrypted).length, keys.length)
  if (k instanceof Key) {
    t.is(decrypted.key, k)
  } else {
    t.is(decrypted.key, ks.get(decrypted.protected))
  }
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

test('compact', complete, () => JWE.encrypt('foo', key), 'cleartext', 'protected', 'key', 'cek')
test('flattened', complete, () => JWE.encrypt.flattened('foo', key), 'cleartext', 'protected', 'key', 'cek')
test('flattened w/ aad', complete, () => JWE.encrypt.flattened('foo', key, undefined, undefined, 'bar'), 'cleartext', 'protected', 'aad', 'key', 'cek')
test('flattened w/ unprotected', complete, () => JWE.encrypt.flattened('foo', key, undefined, { foo: 'bar' }), 'cleartext', 'protected', 'unprotected', 'key', 'cek')
test('flattened w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('flattened')
}, 'cleartext', 'protected', 'header', 'key', 'cek')
test('general', complete, () => JWE.encrypt.general('foo', key), 'cleartext', 'protected', 'key', 'cek')
test('general w/ aad', complete, () => JWE.encrypt.general('foo', key, undefined, undefined, 'bar'), 'cleartext', 'protected', 'aad', 'key', 'cek')
test('general w/ unprotected', complete, () => JWE.encrypt.general('foo', key, undefined, { foo: 'bar' }), 'cleartext', 'protected', 'unprotected', 'key', 'cek')
test('general w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('general')
}, 'cleartext', 'protected', 'header', 'key', 'cek')

test('with keystore > compact', complete, () => JWE.encrypt('foo', key), ks, 'cleartext', 'protected', 'key', 'cek')
test('with keystore > flattened', complete, () => JWE.encrypt.flattened('foo', key), ks, 'cleartext', 'protected', 'key', 'cek')
test('with keystore > flattened w/ aad', complete, () => JWE.encrypt.flattened('foo', key, undefined, undefined, 'bar'), ks, 'cleartext', 'protected', 'aad', 'key', 'cek')
test('with keystore > flattened w/ unprotected', complete, () => JWE.encrypt.flattened('foo', key, undefined, { foo: 'bar' }), ks, 'cleartext', 'protected', 'unprotected', 'key', 'cek')
test('with keystore > flattened w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('flattened')
}, ks, 'cleartext', 'protected', 'header', 'key', 'cek')
test('with keystore > general', complete, () => JWE.encrypt.general('foo', key), ks, 'cleartext', 'protected', 'key', 'cek')
test('with keystore > general w/ aad', complete, () => JWE.encrypt.general('foo', key, undefined, undefined, 'bar'), ks, 'cleartext', 'protected', 'aad', 'key', 'cek')
test('with keystore > general w/ unprotected', complete, () => JWE.encrypt.general('foo', key, undefined, { foo: 'bar' }), ks, 'cleartext', 'protected', 'unprotected', 'key', 'cek')
test('with keystore > general w/ header', complete, () => {
  const enc = new JWE.Encrypt('foo')
  enc.recipient(key, { foo: 'bar' })
  return enc.encrypt('general')
}, ks, 'cleartext', 'protected', 'header', 'key', 'cek')
