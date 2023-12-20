import test from 'ava'
import timekeeper from 'timekeeper'
import { setters } from './time_setters.mjs'

const { UnsecuredJWT, decodeJwt } = await import('#dist')

const now = 1604416038

test.before(async (t) => {
  t.context.payload = { 'urn:example:claim': true }

  timekeeper.freeze(now * 1000)
})

test.after(timekeeper.reset)

test('UnsecuredJWT', async (t) => {
  const jwt = new UnsecuredJWT(t.context.payload).encode()
  t.is(jwt, 'eyJhbGciOiJub25lIn0.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.')
})

test('UnsecuredJWT validations', (t) => {
  t.throws(() => UnsecuredJWT.decode(null), {
    code: 'ERR_JWT_INVALID',
    message: 'Unsecured JWT must be a string',
  })
  t.throws(() => UnsecuredJWT.decode('....'), {
    code: 'ERR_JWT_INVALID',
    message: 'Invalid Unsecured JWT',
  })
  t.throws(() => UnsecuredJWT.decode('..'), {
    code: 'ERR_JWT_INVALID',
    message: 'Invalid Unsecured JWT',
  })
  t.throws(() => UnsecuredJWT.decode('..foo'), {
    code: 'ERR_JWT_INVALID',
    message: 'Invalid Unsecured JWT',
  })
  t.throws(() => UnsecuredJWT.decode('eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.'), {
    code: 'ERR_JWT_INVALID',
    message: 'Invalid Unsecured JWT',
  })
})

test('new UnsecuredJWT()', (t) => {
  t.is(new UnsecuredJWT().encode(), 'eyJhbGciOiJub25lIn0.e30.')
})

async function testJWTsetFunction(t, method, claim, value, expected = value) {
  const jwt = new UnsecuredJWT()[method](value).encode()
  const claims = decodeJwt(jwt)
  t.true(claim in claims)
  t.is(claims[claim], expected)
}
testJWTsetFunction.title = (title, method, claim, value) =>
  `UnsecuredJWT.prototype.${method} called with ${
    value?.constructor?.name || typeof value
  } (${value})`

for (const [method, claim, vectors] of setters(now)) {
  for (const [input, output = input] of vectors) {
    test(testJWTsetFunction, method, claim, input, output)
  }
}
