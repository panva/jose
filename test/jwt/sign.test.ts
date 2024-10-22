import test from 'ava'
import timekeeper from 'timekeeper'
import { setters } from './time_setters.js'

import { SignJWT, compactVerify, jwtVerify } from '../../src/index.js'

const now = 1604416038

test.before(async (t) => {
  t.context.secret = new Uint8Array(32)
  t.context.payload = { 'urn:example:claim': true }

  timekeeper.freeze(now * 1000)
})

test.after(timekeeper.reset)

test('SignJWT', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)
  t.is(
    jwt,
    'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.yPnOE--rxp3rJaYy0iZaW2Vswvus05G6_ZBdXqIdjGo',
  )
})

test('SignJWT with default (empty) payload', async (t) => {
  const jwt = await new SignJWT().setProtectedHeader({ alg: 'HS256' }).sign(t.context.secret)
  t.is(jwt, 'eyJhbGciOiJIUzI1NiJ9.e30.4E_Bsx-pJi3kOW9wVXN8CgbATwP09D9V5gxh9-9zSZ0')
})

test('SignJWT w/crit', async (t) => {
  const expected =
    'eyJhbGciOiJIUzI1NiIsImNyaXQiOlsiaHR0cDovL29wZW5iYW5raW5nLm9yZy51ay9pYXQiXSwiaHR0cDovL29wZW5iYW5raW5nLm9yZy51ay9pYXQiOjB9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.YzOrPZaNql7PpCo43HAJdj-LASP8lOmtb-Bzj9OrNAk'
  await t.throwsAsync(
    new SignJWT(t.context.payload)
      .setProtectedHeader({
        alg: 'HS256',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .sign(t.context.secret),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
    },
  )

  await t.notThrowsAsync(async () => {
    const jwt = await new SignJWT(t.context.payload)
      .setProtectedHeader({
        alg: 'HS256',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .sign(t.context.secret, { crit: { 'http://openbanking.org.uk/iat': true } })
    t.is(jwt, expected)
  })

  await t.throwsAsync(jwtVerify(expected, t.context.secret), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
  })
  await t.notThrowsAsync(
    jwtVerify(expected, t.context.secret, { crit: { 'http://openbanking.org.uk/iat': true } }),
  )
})

test('Signed JWTs cannot use unencoded payload', async (t) => {
  await t.throwsAsync(
    () =>
      new SignJWT()
        .setProtectedHeader({ alg: 'HS256', crit: ['b64'], b64: false })
        .sign(t.context.secret),
    { code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' },
  )
  await t.throwsAsync(() => new SignJWT().sign(t.context.secret), {
    code: 'ERR_JWS_INVALID',
    message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
  })
})

async function testJWTsetFunction(t, method, claim, value, expected = value) {
  const jwt = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    [method](value)
    .sign(t.context.secret)
  const { payload, key: resolvedKey } = await compactVerify(jwt, async (header, token) => {
    t.true('alg' in header)
    t.is(header.alg, 'HS256')
    t.true('payload' in token)
    t.true('protected' in token)
    t.true('signature' in token)
    return t.context.secret
  })
  t.is(resolvedKey, t.context.secret)
  const claims = JSON.parse(new TextDecoder().decode(payload))
  t.true(claim in claims)
  t.is(claims[claim], expected)
}
testJWTsetFunction.title = (title, method, claim, value) =>
  `SignJWT.prototype.${method} called with ${value?.constructor?.name || typeof value} (${value})`

for (const [method, claim, vectors] of setters(now)) {
  for (const [input, output = input] of vectors) {
    test(testJWTsetFunction, method, claim, input, output)
  }
}
