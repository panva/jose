import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { captureError, errorLike } from '../_errors.js'
import timekeeper from 'timekeeper'
import { setters, type SetterMethod, type SetterValue } from './time_setters.js'
import { UnsecuredJWT, base64url, decodeJwt } from '../../src/index.js'

const context = {} as { payload: Record<string, unknown> }

const now = 1604416038

before(async () => {
  context.payload = { 'urn:example:claim': true }
  timekeeper.freeze(now * 1000)
})

after(timekeeper.reset)

test('UnsecuredJWT', async () => {
  const jwt = new UnsecuredJWT(context.payload).encode()
  assert.equal(jwt, 'eyJhbGciOiJub25lIn0.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.')
})

test('UnsecuredJWT validations', () => {
  assert.throws(
    () => UnsecuredJWT.decode(null),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Unsecured JWT must be a string',
    }),
  )
  assert.throws(
    () => UnsecuredJWT.decode('....'),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    }),
  )
  assert.throws(
    () => UnsecuredJWT.decode('..'),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    }),
  )
  assert.throws(
    () => UnsecuredJWT.decode('..foo'),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    }),
  )
  assert.throws(
    () => UnsecuredJWT.decode('eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.'),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    }),
  )
  // a payload segment that is not base64url used to escape as a bare TypeError
  assert.throws(
    () => UnsecuredJWT.decode('eyJhbGciOiJub25lIn0.++++.'),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'Failed to base64url decode the payload',
    }),
  )
})

for (const [iat, clockTolerance] of [
  [now, 0],
  [now + 1, 2],
]) {
  test(`negative maxTokenAge is rejected with clockTolerance ${clockTolerance}`, () => {
    const jwt = new UnsecuredJWT(context.payload).setIssuedAt(iat).encode()
    for (const maxTokenAge of [-1, '-1s', '1s ago']) {
      assert.throws(
        () => UnsecuredJWT.decode(jwt, { maxTokenAge, clockTolerance }),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.equal(error.message, 'Invalid maxTokenAge option input')
          return true
        },
      )
    }
  })
}

test('UnsecuredJWT rejects unrecognized critical header parameters', () => {
  const header = base64url.encode(
    JSON.stringify({ alg: 'none', crit: ['urn:example:critical'], 'urn:example:critical': true }),
  )
  const payload = base64url.encode(JSON.stringify(context.payload))
  assert.throws(
    () => UnsecuredJWT.decode(`${header}.${payload}.`),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "urn:example:critical" is not recognized',
    }),
  )
})

test('UnsecuredJWT rejects the unencoded payload option', () => {
  const header = base64url.encode(JSON.stringify({ alg: 'none', b64: false, crit: ['b64'] }))
  const payload = base64url.encode(JSON.stringify(context.payload))
  assert.throws(
    () => UnsecuredJWT.decode(`${header}.${payload}.`),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'JWTs MUST NOT use unencoded payload',
    }),
  )
})

test('UnsecuredJWT applies JWS crit and b64 validation', () => {
  const payload = base64url.encode(JSON.stringify(context.payload))
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
    const error = captureError(() => UnsecuredJWT.decode(token(header)), {
      code: 'ERR_JWT_INVALID',
      message: 'Invalid Unsecured JWT',
    })
    assert.equal(
      error.cause instanceof Error &&
        'code' in error.cause &&
        error.cause.code === 'ERR_JWS_INVALID' &&
        error.cause.message === causeMessage,
      true,
    )
  }
  for (const b64 of [false, true, 'false']) {
    const decoded = UnsecuredJWT.decode(token({ b64 }))
    assert.deepEqual(decoded.payload, context.payload)
  }
  const decoded = UnsecuredJWT.decode(token({ b64: true, crit: ['b64', 'b64'] }))
  assert.deepEqual(decoded.payload, context.payload)
})

test('new UnsecuredJWT()', () => {
  assert.equal(new UnsecuredJWT().encode(), 'eyJhbGciOiJub25lIn0.e30.')
})

async function testJWTsetFunction(
  method: SetterMethod,
  claim: string,
  value: SetterValue,
  expected: SetterValue = value,
) {
  const jwt = new UnsecuredJWT()[method](value as never).encode()
  const claims = decodeJwt(jwt)
  assert.equal(claim in claims, true)
  assert.equal(claims[claim], expected)
}

const testJWTsetFunctionTitle = (method: SetterMethod, value: SetterValue) =>
  `UnsecuredJWT.prototype.${method} called with ${value?.constructor?.name || typeof value} (${value})`

for (const [method, claim, vectors] of setters(now)) {
  for (const [input, output = input] of vectors) {
    test(testJWTsetFunctionTitle(method, input), () =>
      testJWTsetFunction(method, claim, input, output),
    )
  }
}
