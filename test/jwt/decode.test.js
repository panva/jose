const test = require('ava')

const { decode } = require('../../lib/jwt')

const JWT = 'eyJhbGciOiJIUzI1NiJ9.e30.wFzc1AaKc-h2sBmMo-q5Btx4pthqj4E1uI9iieszJB4'

const jwtdecode = (t, jwt, ePayload, options) => {
  t.deepEqual(decode(jwt, options), ePayload)
}

test('returns just the payload without complete', jwtdecode, JWT, {})
test('returns the full JWT with complete', jwtdecode, JWT, {
  header: { alg: 'HS256' },
  payload: {},
  signature: 'wFzc1AaKc-h2sBmMo-q5Btx4pthqj4E1uI9iieszJB4'
}, { complete: true })

test('throws when its encrypted', t => {
  function fn () {
    return decode('e30.e30.e30.e30.e30')
  }

  const error = t.throws(fn, Error)
  t.is(error.message, 'jwt appears to be encrypted')
})

test('throws when malformed', t => {
  function fn () {
    return decode('e30.e30')
  }

  const error = t.throws(fn, Error)
  t.is(error.message, 'jwt malformed')
})

test('throws when not a valid JWT', t => {
  function fn () {
    return decode('e30.7&&.foo')
  }

  const error = t.throws(fn, Error)
  t.is(error.message, 'jwt malformed')
})

test('throws when not a valid input', t => {
  function fn () {
    return decode(0)
  }

  const error = t.throws(fn, TypeError)
  t.is(error.message, 'jwt must be a string')
})
