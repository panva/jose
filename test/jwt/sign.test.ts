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

test('SignJWT rejects unencoded payloads before validating alg', async (t) => {
  await t.throwsAsync(
    new SignJWT().setProtectedHeader({ b64: false, crit: ['b64'] }).sign(t.context.secret),
    { code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' },
  )
})

test('SignJWT uses one normalized protected header snapshot', async (t) => {
  let b64Reads = 0
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({
      alg: 'HS256',
      crit: ['b64'],
      get b64() {
        b64Reads++
        return b64Reads === 1 ? true : false
      },
    })
    .sign(t.context.secret)

  t.is(b64Reads, 1)
  const { protectedHeader, payload } = await jwtVerify(jwt, t.context.secret)
  t.is(protectedHeader.b64, true)
  t.deepEqual(payload, t.context.payload)
})

test('SignJWT protected header can only be set once', (t) => {
  t.throws(
    () => new SignJWT().setProtectedHeader({ alg: 'HS256' }).setProtectedHeader({ alg: 'HS384' }),
    {
      instanceOf: TypeError,
      message: 'setProtectedHeader can only be called once',
    },
  )
})

test('time setters reject overflowing duration strings', (t) => {
  const duration = `${'9'.repeat(400)} years`

  for (const method of ['setExpirationTime', 'setNotBefore', 'setIssuedAt'] as const) {
    t.throws(() => new SignJWT()[method](duration), {
      instanceOf: TypeError,
      message: 'Invalid time period format',
    })
  }
})

test('time setters reject values that only coerce to duration strings', (t) => {
  const durationLike = { toString: () => '1 hour' }

  for (const method of ['setExpirationTime', 'setNotBefore', 'setIssuedAt'] as const) {
    t.throws(() => new SignJWT()[method](durationLike as never), {
      instanceOf: TypeError,
      message: 'Invalid time period format',
    })
  }
})

test('registered string claim setters reject invalid types', (t) => {
  for (const [setClaim, message] of [
    [() => new SignJWT().setIssuer(0 as never), '"iss" claim must be a string'],
    [() => new SignJWT().setSubject(null as never), '"sub" claim must be a string'],
    [() => new SignJWT().setJti({} as never), '"jti" claim must be a string'],
    [
      () => new SignJWT().setAudience(0 as never),
      '"aud" claim must be a string or an array of strings',
    ],
    [
      () => new SignJWT().setAudience(['audience', 0] as never),
      '"aud" claim must be a string or an array of strings',
    ],
  ] as const) {
    t.throws(setClaim, { instanceOf: TypeError, message })
  }
})

test('JWT production rejects non-finite NumericDate claims', async (t) => {
  for (const claim of ['exp', 'nbf', 'iat']) {
    for (const value of [NaN, Infinity, -Infinity]) {
      await t.throwsAsync(
        new SignJWT({ [claim]: value }).setProtectedHeader({ alg: 'HS256' }).sign(t.context.secret),
        { instanceOf: TypeError, message: `"${claim}" claim must be a finite number` },
      )
    }
  }
})

test('Signed JWTs ignore b64 false without crit', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(t.context.secret)
  const { payload, protectedHeader } = await jwtVerify(jwt, t.context.secret)

  t.deepEqual(payload, t.context.payload)
  t.false(protectedHeader.b64)
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
