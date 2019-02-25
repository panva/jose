const test = require('ava')

const { JWK, JWS, errors } = require('../..')

const k = JWK.importKey({
  kty: 'oct',
  k: 'AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow'
})

const FIXTURE = {
  protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
  payload: '$.02',
  signature: 'A5dxf2s96_n5FLueVuW1Z_vh161FwXZC4YLPff6dmDY'
}

test('b64=false is supported for JWS', t => {
  t.deepEqual(
    JWS.sign.flattened('$.02', k, { alg: 'HS256', b64: false, crit: ['b64'] }),
    FIXTURE
  )

  t.is(JWS.verify(FIXTURE, k, { crit: ['b64'] }), FIXTURE.payload)
})

test('b64=true is also allowed', t => {
  const jws = JWS.sign.flattened('$.02', k, { alg: 'HS256', b64: true, crit: ['b64'] })
  t.is(jws.payload, 'JC4wMg')
  t.is(JWS.verify(FIXTURE, k, { crit: ['b64'] }), FIXTURE.payload)
})

test('b64 must be integrity protected', t => {
  t.throws(() => {
    JWS.sign.flattened('foo', k, { alg: 'HS256', crit: ['b64'] }, { b64: true })
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"b64" critical parameter must be integrity protected' })
})

test('b64 must be a boolean', t => {
  t.throws(() => {
    JWS.sign.flattened('foo', k, { alg: 'HS256', crit: ['b64'], b64: 'true' })
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"b64" critical parameter must be a boolean' })
})

test('b64 must be the same for all recipients', t => {
  const sign = new JWS.Sign('$.02')
  sign.recipient(k, { crit: ['b64'], b64: false })
  sign.recipient(k, { crit: ['b64'], b64: true })

  t.throws(() => {
    sign.sign('general')
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'the "b64" Header Parameter value MUST be the same for all recipients' })
})
