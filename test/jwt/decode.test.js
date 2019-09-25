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

test('invalid tokens', t => {
  t.throws(() => {
    JWT.decode('eyJ0eXAiOiJKV1QiLCJraWQiOiIyZTFkYjRmMC1mYmY5LTQxZjYtOGMxYi1hMzczYjgwZmNhYTEiLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHktc3RhZ2luZy5kZWxpdmVyb28uY29tLyIsImNsaWVudCI6ImIyM2I0ZjM1YzIyMTI5NDQxZjMwZDMyYmI5ZmM4ZWYyIiwic2lnbmVyIjoiYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzpldS13ZXN0LTE6NTE3OTAyNjYzOTE1OmxvYWRiYWxhbmNlci9hcHAvcGF5bWVudHMtZGFzaGJvYXJkLXdlYi80YzA4ZGI2NDMyMDIyOWEyIiwiZXhwIjoxNTYyNjkxNTg1fQ==.eyJlbWFpbCI6ImpvYW8udmllaXJhQGRlbGl2ZXJvby5jby51ayIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmYW1pbHlfbmFtZSI6Ikd1ZXJyYSBWaWVpcmEiLCJnaXZlbl9uYW1lIjoiSm9hbyIsIm5hbWUiOiJKb2FvIEd1ZXJyYSBWaWVpcmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1sTUpXTXV3R1dpYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFCVS9lNGtkTDg5UjlqZy9zOTYtYy9waG90by5qcGciLCJzdWIiOiIxMWE1YmFmMGRjNzcwNWRmMzk1ZTMzYWFkZjU2MDk4OCIsImV4cCI6MTU2MjY5MTU4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1zdGFnaW5nLmRlbGl2ZXJvby5jb20vIn0=.DSHLJXLOfLJ-ZYcX0Vlii6Ak_jcDSkKOvNRj_rvtAyY9uYXtwo798ZrR35fgut-LuCdx0aKz2SgK0KJqw5q6dA==')
  }, { instanceOf: errors.JOSEInvalidEncoding, code: 'ERR_JOSE_INVALID_ENCODING', message: 'input is not a valid base64url encoded string' })
})
