const test = require('ava')

const { JWT, errors } = require('../..')

test('token must be a string', t => {
  ;[{}, new Object(), false, null, Infinity, 0, '', Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWT.decode(val)
    }, { instanceOf: TypeError, message: 'JWT must be a string' })
  })
})

test('token must not be encrypted', t => {
  t.throws(() => {
    JWT.decode('....')
  }, { instanceOf: TypeError, message: 'JWTs must be decrypted first' })
})

test('token must have three components', t => {
  t.throws(() => {
    JWT.decode('.')
  }, { instanceOf: errors.JWTMalformed, code: 'ERR_JWT_MALFORMED', message: 'JWTs must have three components' })
})

test('token must have a valid base64url encoded JSON header', t => {
  t.throws(() => {
    JWT.decode('foo.e30.')
  }, { instanceOf: errors.JWTMalformed, code: 'ERR_JWT_MALFORMED', message: 'JWT is malformed' })
})

test('token must have a valid base64url encoded payload', t => {
  t.throws(() => {
    JWT.decode('e30.foo.')
  }, { instanceOf: errors.JWTMalformed, code: 'ERR_JWT_MALFORMED', message: 'JWT is malformed' })
})

test('returns the payload, header and signature', t => {
  t.deepEqual(JWT.decode('eyJmb28iOiJiYXIifQ.e30.', { complete: true }), {
    header: { foo: 'bar' },
    payload: {},
    signature: ''
  })
})

test('returns the payload', t => {
  t.deepEqual(JWT.decode('e30.eyJmb28iOiJiYXIifQ.'), {
    foo: 'bar'
  })
})
