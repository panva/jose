const test = require('ava')

const { randomBytes } = require('crypto')

const { JWK, JWS } = require('../../lib')

const key = JWK.generateSync('oct')

test('JWS.verify can skip parsing the payload', t => {
  let payload = 'foo'
  let jws = JWS.sign(payload, key)
  t.deepEqual(JWS.verify(jws, key, { parse: false }), Buffer.from(payload))

  jws = JWS.sign.flattened(payload, key)
  t.deepEqual(JWS.verify(jws, key, { parse: false }), Buffer.from(payload))
  t.deepEqual(JWS.verify(jws, key, { parse: false, complete: true }), { key, protected: { alg: 'HS256' }, payload: Buffer.from(payload) })

  payload = randomBytes(8)

  jws = JWS.sign(payload, key)
  t.deepEqual(JWS.verify(jws, key, { parse: false }), payload)
  t.deepEqual(JWS.verify(jws, key, { parse: false, complete: true }), { key, protected: { alg: 'HS256' }, payload: payload })
})

test('JWS.verify can parse any valid encoding', t => {
  let jws = JWS.sign('foo', key)
  t.deepEqual(JWS.verify(jws, key, { encoding: 'hex' }), '666f6f')
  t.deepEqual(JWS.verify(jws, key, { encoding: 'base64' }), 'Zm9v')

  jws = JWS.sign.flattened('foo', key)
  t.deepEqual(JWS.verify(jws, key, { encoding: 'hex' }), '666f6f')
  t.deepEqual(JWS.verify(jws, key, { complete: true, encoding: 'hex' }), { key, protected: { alg: 'HS256' }, payload: '666f6f' })
  t.deepEqual(JWS.verify(jws, key, { encoding: 'base64' }), 'Zm9v')
  t.deepEqual(JWS.verify(jws, key, { complete: true, encoding: 'base64' }), { key, protected: { alg: 'HS256' }, payload: 'Zm9v' })
})
