import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import timekeeper from 'timekeeper'
import { setters, type SetterMethod, type SetterValue } from './time_setters.js'
import { SignJWT, compactVerify, jwtVerify } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { secret: Uint8Array; payload: Record<string, unknown> }

const now = 1604416038

before(async () => {
  context.secret = new Uint8Array(32)
  context.payload = { 'urn:example:claim': true }
  timekeeper.freeze(now * 1000)
})

after(timekeeper.reset)

test('SignJWT', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  assert.equal(
    jwt,
    'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.yPnOE--rxp3rJaYy0iZaW2Vswvus05G6_ZBdXqIdjGo',
  )
})

test('SignJWT with default (empty) payload', async () => {
  const jwt = await new SignJWT().setProtectedHeader({ alg: 'HS256' }).sign(context.secret)
  assert.equal(jwt, 'eyJhbGciOiJIUzI1NiJ9.e30.4E_Bsx-pJi3kOW9wVXN8CgbATwP09D9V5gxh9-9zSZ0')
})

test('SignJWT w/crit', async () => {
  const expected =
    'eyJhbGciOiJIUzI1NiIsImNyaXQiOlsiaHR0cDovL29wZW5iYW5raW5nLm9yZy51ay9pYXQiXSwiaHR0cDovL29wZW5iYW5raW5nLm9yZy51ay9pYXQiOjB9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.YzOrPZaNql7PpCo43HAJdj-LASP8lOmtb-Bzj9OrNAk'
  await assert.rejects(
    new SignJWT(context.payload)
      .setProtectedHeader({
        alg: 'HS256',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .sign(context.secret),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
    }),
  )
  await assert.doesNotReject(async () => {
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({
        alg: 'HS256',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .sign(context.secret, { crit: { 'http://openbanking.org.uk/iat': true } })
    assert.equal(jwt, expected)
  })
  await assert.rejects(
    jwtVerify(expected, context.secret),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
    }),
  )
  await assert.doesNotReject(
    jwtVerify(expected, context.secret, { crit: { 'http://openbanking.org.uk/iat': true } }),
  )
})

test('Signed JWTs cannot use unencoded payload', async () => {
  await assert.rejects(
    () =>
      new SignJWT()
        .setProtectedHeader({ alg: 'HS256', crit: ['b64'], b64: false })
        .sign(context.secret),
    errorLike({ code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' }),
  )
  await assert.rejects(
    () => new SignJWT().sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    }),
  )
})

test('SignJWT rejects unencoded payloads before validating alg', async () => {
  await assert.rejects(
    new SignJWT().setProtectedHeader({ b64: false, crit: ['b64'] }).sign(context.secret),
    errorLike({ code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' }),
  )
})

test('SignJWT uses one normalized protected header snapshot', async () => {
  let b64Reads = 0
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({
      alg: 'HS256',
      crit: ['b64'],
      get b64() {
        b64Reads++
        return b64Reads === 1 ? true : false
      },
    })
    .sign(context.secret)
  assert.equal(b64Reads, 1)
  const { protectedHeader, payload } = await jwtVerify(jwt, context.secret)
  assert.equal(protectedHeader.b64, true)
  assert.deepEqual(payload, context.payload)
})

test('SignJWT protected header can only be set once', () => {
  assert.throws(
    () => new SignJWT().setProtectedHeader({ alg: 'HS256' }).setProtectedHeader({ alg: 'HS384' }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setProtectedHeader can only be called once')
      return true
    },
  )
})

test('time setters reject overflowing duration strings', () => {
  const duration = `${'9'.repeat(400)} years`
  for (const method of ['setExpirationTime', 'setNotBefore', 'setIssuedAt'] as const) {
    assert.throws(
      () => new SignJWT()[method](duration),
      (error) => {
        assert.ok(error instanceof TypeError)
        assert.equal(error.message, 'Invalid time period format')
        return true
      },
    )
  }
})

test('time setters reject values that only coerce to duration strings', () => {
  const durationLike = { toString: () => '1 hour' }
  for (const method of ['setExpirationTime', 'setNotBefore', 'setIssuedAt'] as const) {
    assert.throws(
      () => new SignJWT()[method](durationLike as never),
      (error) => {
        assert.ok(error instanceof TypeError)
        assert.equal(error.message, 'Invalid time period format')
        return true
      },
    )
  }
})

test('registered string claim setters reject invalid types', () => {
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
    assert.throws(setClaim, (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, message)
      return true
    })
  }
})

test('JWT production rejects non-finite NumericDate claims', async () => {
  for (const claim of ['exp', 'nbf', 'iat']) {
    for (const value of [NaN, Infinity, -Infinity]) {
      await assert.rejects(
        new SignJWT({ [claim]: value }).setProtectedHeader({ alg: 'HS256' }).sign(context.secret),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.equal(error.message, `"${claim}" claim must be a finite number`)
          return true
        },
      )
    }
  }
})

test('Signed JWTs ignore b64 false without crit', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(context.secret)
  const { payload, protectedHeader } = await jwtVerify(jwt, context.secret)
  assert.deepEqual(payload, context.payload)
  assert.equal(protectedHeader.b64, false)
})

async function testJWTsetFunction(
  method: SetterMethod,
  claim: string,
  value: SetterValue,
  expected: SetterValue = value,
) {
  const jwt = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    [method](value as never)
    .sign(context.secret)
  const { payload, key: resolvedKey } = await compactVerify(jwt, async (header, token) => {
    assert.equal('alg' in header, true)
    assert.equal(header.alg, 'HS256')
    assert.equal('payload' in token, true)
    assert.equal('protected' in token, true)
    assert.equal('signature' in token, true)
    return context.secret
  })
  assert.equal(resolvedKey, context.secret)
  const claims = JSON.parse(new TextDecoder().decode(payload))
  assert.equal(claim in claims, true)
  assert.equal(claims[claim], expected)
}

const testJWTsetFunctionTitle = (method: SetterMethod, value: SetterValue) =>
  `SignJWT.prototype.${method} called with ${value?.constructor?.name || typeof value} (${value})`

for (const [method, claim, vectors] of setters(now)) {
  for (const [input, output = input] of vectors) {
    test(testJWTsetFunctionTitle(method, input), () =>
      testJWTsetFunction(method, claim, input, output),
    )
  }
}
