const test = require('ava')

const errors = require('../../lib/errors')
const asKey = require('../../lib/jwk/import')
const { generateSync } = require('../../lib/jwk/generate')
const { generateKeyPairSync } = require('../macros/generate')

const { edDSASupported } = require('../../lib/help/node_support')

const jwk = asKey('foo').toJWK(true)

test('key_ops ignores unrecognized values', t => {
  asKey({ ...jwk, key_ops: ['sign', 'verify', 'foo'] })
  t.pass()
})

test('key_ops ignores duplicate values', t => {
  const k = asKey({ ...jwk, key_ops: ['sign', 'verify', 'sign'] })
  t.deepEqual(k.key_ops, ['sign', 'verify'])
})

test('key_ops can be combined with use if consistent', t => {
  asKey({ ...jwk, key_ops: ['sign', 'verify'], use: 'sig' })
  t.pass()
})

test('key_ops are part of toJWK', t => {
  const k = asKey({ ...jwk, key_ops: ['sign', 'verify'], use: 'sig' })
  t.deepEqual(k.toJWK().key_ops, ['sign', 'verify'])
  t.deepEqual(k.toJWK(true).key_ops, ['sign', 'verify'])
})

test('key_ops must be an array', t => {
  t.throws(() => {
    asKey({ ...jwk, key_ops: 'wrapKey' })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings when provided' })
})

test('key_ops must not be empty', t => {
  t.throws(() => {
    asKey({ ...jwk, key_ops: [] })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings when provided' })
})

test('key_ops must only contain strings', t => {
  t.throws(() => {
    asKey({ ...jwk, key_ops: ['wrapKey', true] })
  }, { instanceOf: TypeError, message: '`key_ops` must be a non-empty array of strings when provided' })
})

test('JWK asKey with invalid use / key_ops throws', t => {
  t.throws(() => {
    asKey({ ...jwk, use: 'sig', key_ops: ['wrapKey'] })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID' })
})

test('keyObject asKey with invalid use / key_ops throws 1/2', t => {
  const { publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

  t.throws(() => {
    asKey(publicKey, { use: 'sig', key_ops: ['wrapKey'] })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID' })
})

test('keyObject asKey with invalid use / key_ops throws 2/2', t => {
  const { publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

  t.throws(() => {
    asKey(publicKey, { use: 'enc', key_ops: ['sign'] })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID' })
})

test('PEM asKey with invalid use / key_ops throws', t => {
  const { publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

  t.throws(() => {
    asKey(publicKey.export({ type: 'spki', format: 'pem' }), { use: 'sig', key_ops: ['wrapKey'] })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID' })
})

test('RSA key key_ops', t => {
  const k = generateSync('RSA', 2048, { key_ops: ['sign'] })
  t.deepEqual([...k.algorithms()], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  t.deepEqual([...k.algorithms('sign')], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  t.deepEqual([...k.algorithms('verify')], [])
})

test('EC key key_ops', t => {
  const k = generateSync('EC', 'P-256', { key_ops: ['verify'] })
  t.deepEqual([...k.algorithms()], ['ES256'])
  t.deepEqual([...k.algorithms('verify')], ['ES256'])
  t.deepEqual([...k.algorithms('sign')], [])
})

test('oct key key_ops', t => {
  const k = generateSync('oct', 256, { key_ops: ['verify'] })
  t.deepEqual([...k.algorithms()], ['HS256', 'HS384', 'HS512'])
  t.deepEqual([...k.algorithms('verify')], ['HS256', 'HS384', 'HS512'])
  t.deepEqual([...k.algorithms('sign')], [])
})

if (edDSASupported) {
  test('OKP key key_ops', t => {
    const k = generateSync('OKP', 'Ed25519', { key_ops: ['verify'] })
    t.deepEqual([...k.algorithms()], ['EdDSA'])
    t.deepEqual([...k.algorithms('verify')], ['EdDSA'])
    t.deepEqual([...k.algorithms('sign')], [])
  })
}
