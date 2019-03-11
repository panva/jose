const test = require('ava')

const { JWKS, JWK: { generateSync }, JWS } = require('../..')
const Key = require('../../lib/jwk/key/base')
const key = generateSync('oct')
const ks = new JWKS.KeyStore(generateSync('EC'), key)

const complete = (t, jws, k, ...keys) => {
  if (typeof k === 'string') {
    keys.unshift(k)
    k = key
  }
  const verified = JWS.verify(jws(), k, { complete: true })
  t.is(Object.values(verified).length, keys.length)
  if (k instanceof Key) {
    t.is(verified.key, k)
  } else {
    t.is(verified.key, ks.get(verified.protected))
  }
  if (keys.includes('header')) {
    t.is(typeof verified.header, 'object')
  }
  if (keys.includes('protected')) {
    t.is(typeof verified.protected, 'object')
  }
  t.is(typeof verified.payload, 'object')
}

test('compact', complete, () => JWS.sign({}, key), 'payload', 'protected', 'key')
test('flattened', complete, () => JWS.sign.flattened({}, key), 'payload', 'protected', 'key')
test('flattened w/ header', complete, () => JWS.sign.flattened({}, key, undefined, { foo: 'bar' }), 'payload', 'protected', 'header', 'key')
test('general', complete, () => JWS.sign.general({}, key), 'payload', 'protected', 'key')
test('general w/ header', complete, () => JWS.sign.general({}, key, undefined, { foo: 'bar' }), 'payload', 'protected', 'header', 'key')

test('with keystore > compact', complete, () => JWS.sign({}, key), ks, 'payload', 'protected', 'key')
test('with keystore > flattened', complete, () => JWS.sign.flattened({}, key), ks, 'payload', 'protected', 'key')
test('with keystore > flattened w/ header', complete, () => JWS.sign.flattened({}, key, undefined, { foo: 'bar' }), ks, 'payload', 'protected', 'header', 'key')
test('with keystore > general', complete, () => JWS.sign.general({}, key), ks, 'payload', 'protected', 'key')
test('with keystore > general w/ header', complete, () => JWS.sign.general({}, key, undefined, { foo: 'bar' }), ks, 'payload', 'protected', 'header', 'key')
