import test from 'ava'
import timekeeper from 'timekeeper'
import { setters } from './time_setters.js'

import { UnsecuredJWT, base64url, decodeJwt } from '../../src/index.js'

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
  // a payload segment that is not base64url used to escape as a bare TypeError
  t.throws(() => UnsecuredJWT.decode('eyJhbGciOiJub25lIn0.++++.'), {
    code: 'ERR_JWT_INVALID',
    message: 'Failed to base64url decode the payload',
  })
})

test('UnsecuredJWT rejects unrecognized critical header parameters', (t) => {
  const header = base64url.encode(
    JSON.stringify({ alg: 'none', crit: ['urn:example:critical'], 'urn:example:critical': true }),
  )
  const payload = base64url.encode(JSON.stringify(t.context.payload))

  t.throws(() => UnsecuredJWT.decode(`${header}.${payload}.`), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Extension Header Parameter "urn:example:critical" is not recognized',
  })
})

test('UnsecuredJWT rejects the unencoded payload option', (t) => {
  const header = base64url.encode(JSON.stringify({ alg: 'none', b64: false, crit: ['b64'] }))
  const payload = base64url.encode(JSON.stringify(t.context.payload))

  t.throws(() => UnsecuredJWT.decode(`${header}.${payload}.`), {
    code: 'ERR_JWT_INVALID',
    message: 'JWTs MUST NOT use unencoded payload',
  })
})

test('UnsecuredJWT applies JWS crit and b64 validation', (t) => {
  const payload = base64url.encode(JSON.stringify(t.context.payload))
  const token = (header: object) =>
    `${base64url.encode(JSON.stringify({ alg: 'none', ...header }))}.${payload}.`

  for (const [header, causeMessage] of [
    [
      { crit: null },
      '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
    ],
    [{ crit: ['b64'] }, 'Extension Header Parameter "b64" is missing'],
    [
      { b64: 'true', crit: ['b64'] },
      'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
    ],
  ] as const) {
    const error = t.throws(() => UnsecuredJWT.decode(token(header)), {
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    })
    t.true(
      error.cause instanceof Error &&
        'code' in error.cause &&
        error.cause.code === 'ERR_JWS_INVALID' &&
        error.cause.message === causeMessage,
    )
  }

  for (const b64 of [false, true, 'false']) {
    const decoded = UnsecuredJWT.decode(token({ b64 }))
    t.deepEqual(decoded.payload, t.context.payload)
  }

  const decoded = UnsecuredJWT.decode(token({ b64: true, crit: ['b64', 'b64'] }))
  t.deepEqual(decoded.payload, t.context.payload)
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
