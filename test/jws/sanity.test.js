const test = require('ava')

const { JWS, errors: { JWSInvalid } } = require('../..')

test('compact parts length check', t => {
  t.throws(() => {
    JWS.verify('')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('.')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('...')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
})
