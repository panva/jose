const test = require('ava')
const crypto = require('crypto')

const { JWK: { importKey } } = require('../..')

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
