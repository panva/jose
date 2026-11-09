import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import timekeeper from 'timekeeper'
import { base64url, SignJWT, jwtVerify, CompactSign } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { secret: Uint8Array; payload: Record<string, unknown> }

const now = 1604416038

before(async () => {
  context.secret = new Uint8Array(32)
  context.payload = { 'urn:example:claim': true }
  timekeeper.freeze(now * 1000)
})

after(timekeeper.reset)

test('Basic JWT Claims Set verification', async () => {
  const issuer = 'urn:example:issuer'
  const subject = 'urn:example:subject'
  const audience = 'urn:example:audience'
  const jti = 'urn:example:jti'
  const nbf = now - 10
  const iat = now - 20
  const exp = now + 10
  const typ = 'urn:example:typ'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256', typ })
    .setIssuer(issuer)
    .setSubject(subject)
    .setAudience(audience)
    .setJti(jti)
    .setNotBefore(nbf)
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .sign(context.secret)
  assert.deepEqual(
    await jwtVerify(jwt, context.secret, {
      issuer,
      subject,
      audience,
      jti,
      typ,
      maxTokenAge: '30s',
    }),
    {
      payload: {
        aud: 'urn:example:audience',
        exp: 1604416048,
        iat: 1604416018,
        iss: 'urn:example:issuer',
        jti: 'urn:example:jti',
        nbf: 1604416028,
        sub: 'urn:example:subject',
        'urn:example:claim': true,
      },
      protectedHeader: {
        alg: 'HS256',
        typ: 'urn:example:typ',
      },
    },
  )
  await assert.doesNotReject(jwtVerify(new TextEncoder().encode(jwt), context.secret))
})

test('Payload must be an object', async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  for (const value of [0, 1, -1, true, false, null, [], '']) {
    const token = await new CompactSign(encode(JSON.stringify(value)))
      .setProtectedHeader({ alg: 'HS256' })
      .sign(context.secret)
    await assert.rejects(
      jwtVerify(token, context.secret),
      errorLike({
        code: 'ERR_JWT_INVALID',
        message: 'JWT Claims Set must be a top-level JSON object',
      }),
    )
  }
})

test('incorrect hmac signature lengths', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt.slice(0, -3), context.secret),
    errorLike({
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
      message: 'signature verification failed',
    }),
  )
})

test('Payload must JSON parseable', async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const token = await new CompactSign(encode('{'))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(token, context.secret),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'JWT Claims Set must be a top-level JSON object',
    }),
  )
})

test('algorithms options', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      algorithms: ['PS256'],
    }),
    errorLike({
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    }),
  )
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      algorithms: [null],
    }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, '"algorithms" option must be an array of strings')
      return true
    },
  )
})

test('typ verification', async () => {
  {
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(context.secret)
    await assert.rejects(
      jwtVerify(jwt, context.secret, { typ: '' }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
  }
  {
    const typ = 'urn:example:typ'
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(context.secret)
    await assert.doesNotReject(
      jwtVerify(jwt, context.secret, {
        typ: 'application/urn:example:typ',
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, {
        typ: 'urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, {
        typ: 'application/urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
  }
  {
    const typ = 'application/urn:example:typ'
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(context.secret)
    await assert.doesNotReject(
      jwtVerify(jwt, context.secret, {
        typ: 'urn:example:typ',
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, {
        typ: 'application/urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, {
        typ: 'urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
  }
  {
    const typ = 'text/plain'
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(context.secret)
    await assert.doesNotReject(
      jwtVerify(jwt, context.secret, {
        typ: 'text/plain',
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, {
        typ: 'application/text/plain',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
  }
})

test('Issuer[] verification', async () => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .sign(context.secret)
  await assert.doesNotReject(
    jwtVerify(jwt, context.secret, {
      issuer: [issuer],
    }),
  )
})

test('Issuer[] verification failed', async () => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      issuer: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' }),
  )
})

test('Issuer[] verification failed []', async () => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT({ ...context.payload, iss: [issuer] as never })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      issuer: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' }),
  )
})

test('Audience[] verification', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(audience)
    .sign(context.secret)
  await assert.doesNotReject(
    jwtVerify(jwt, context.secret, {
      audience: [audience],
    }),
  )
})

test('Audience[] verification failed', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(audience)
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      audience: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' }),
  )
})

test('Audience[] verification failed []', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience([audience])
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      audience: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' }),
  )
})

test('Subject verification failed', async () => {
  const subject = 'urn:example:subject'
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(subject)
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      subject: 'urn:example:subject:2',
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "sub" claim value' }),
  )
})

async function numericDateNumber(claim: string) {
  const jwt = await new SignJWT({ [claim]: null })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret),
    errorLike({
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `"${claim}" claim must be a number`,
    }),
  )
}

test('clockTolerance num', async () => {
  const jwt = await new SignJWT({ exp: now })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.doesNotReject(jwtVerify(jwt, context.secret, { clockTolerance: 1 }))
  await assert.doesNotReject(jwtVerify(jwt, context.secret, { clockTolerance: '1s' }))
})

async function failingNumericDate(
  claims: Record<string, unknown>,
  assertion: import('node:assert').AssertPredicate,
  verifyOptions: import('../../src/index.js').JWTVerifyOptions = {},
) {
  const jwt = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  await assert.rejects(jwtVerify(jwt, context.secret, { ...verifyOptions }), errorLike(assertion))
}

test('exp must be in the future', () =>
  failingNumericDate(
    { exp: now },
    {
      code: 'ERR_JWT_EXPIRED',
      message: '"exp" claim timestamp check failed',
    },
  ))

test('nbf must be at least now', () =>
  failingNumericDate(
    { nbf: now + 1 },
    {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: '"nbf" claim timestamp check failed',
    },
  ))

test('iat must be in the past (maxTokenAge, no exp)', () =>
  failingNumericDate(
    { iat: now + 1 },
    {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: '"iat" claim timestamp check failed (it should be in the past)',
    },
    {
      maxTokenAge: 5,
    },
  ))

test('iat must be in the past (maxTokenAge, with exp)', () =>
  failingNumericDate(
    { iat: now + 1, exp: now + 10 },
    {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: '"iat" claim timestamp check failed (it should be in the past)',
    },
    {
      maxTokenAge: 5,
    },
  ))

test('iat must be in the past (maxTokenAge, with exp, as a string)', () =>
  failingNumericDate(
    { iat: now + 1, exp: now + 10 },
    {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: '"iat" claim timestamp check failed (it should be in the past)',
    },
    {
      maxTokenAge: '5s',
    },
  ))

test('maxTokenAge option', () =>
  failingNumericDate(
    { iat: now - 31 },
    {
      code: 'ERR_JWT_EXPIRED',
      message: '"iat" claim timestamp check failed (too far in the past)',
    },
    {
      maxTokenAge: '30s',
    },
  ))

for (const claim of ['iat', 'nbf', 'exp']) {
  test(`${claim} must be a number`, () => numericDateNumber(claim))
}

test('Signed JWTs cannot use unencoded payload', async () => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.foo.VklKdp4tVYD61VNPDBTqxqdEQcUL3JK-D4dGXu9NvWs'
  await assert.rejects(
    jwtVerify(jwt, context.secret),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'JWTs MUST NOT use unencoded payload',
    }),
  )
  const [protectedHeader, payload] = jwt.split('.')
  await assert.rejects(
    jwtVerify(`${protectedHeader}.${payload}.AA`, context.secret),
    errorLike({
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }),
  )
})

test('JWT verification ignores b64 false without crit', async () => {
  const jwt = await new CompactSign(new TextEncoder().encode('{}'))
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(context.secret)
  const { payload, protectedHeader } = await jwtVerify(jwt, context.secret)
  assert.deepEqual(payload, {})
  assert.equal(protectedHeader.b64, false)
})

test('signatures are compared before claim set', async () => {
  // https://github.com/panva/jose/discussions/447
  const jwt = await new SignJWT({ exp: 0 })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  // with valid secret should throw exp failing to verify
  await assert.rejects(jwtVerify(jwt, context.secret), errorLike({ code: 'ERR_JWT_EXPIRED' }))
  // with invalid secret should throw signature failing to verify
  await assert.rejects(
    jwtVerify(jwt, new Uint8Array([0x00, 0x01])),
    errorLike({
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }),
  )
})

test('requiredClaims claims check', async () => {
  const jwt = await new SignJWT({
    ...context.payload,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  const requiredClaims = ['nbf']
  for (const [claim, option] of [
    ['iss', 'issuer'],
    ['aud', 'audience'],
    ['iat', 'maxTokenAge'],
    ['sub', 'subject'],
  ]) {
    await assert.rejects(
      jwtVerify(jwt, context.secret, { [option]: 'foo' }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `missing required "${claim}" claim`,
      }),
    )
    await assert.rejects(
      jwtVerify(jwt, context.secret, { [option]: 'foo', requiredClaims }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `missing required "${claim}" claim`,
      }),
    )
  }
  await assert.rejects(
    jwtVerify(jwt, context.secret, { requiredClaims }),
    errorLike({
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `missing required "nbf" claim`,
    }),
  )
  for (const claim of ['constructor', 'toString', '__proto__']) {
    await assert.rejects(
      jwtVerify(jwt, context.secret, { requiredClaims: [claim] }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `missing required "${claim}" claim`,
      }),
    )
  }
  assert.deepEqual(requiredClaims, ['nbf'])
})

test('empty string validation options compare the claim value', async () => {
  const jwt = await new SignJWT({ iss: 'urn:example:issuer', sub: 'urn:example:subject' })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience('urn:example:audience')
    .sign(context.secret)
  for (const [claim, option] of [
    ['iss', 'issuer'],
    ['sub', 'subject'],
    ['aud', 'audience'],
  ]) {
    await assert.rejects(
      jwtVerify(jwt, context.secret, { [option]: '' }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `unexpected "${claim}" claim value`,
      }),
    )
  }
})

test('maxTokenAge of 0 is enforced', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now - 30)
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, { maxTokenAge: 0 }),
    errorLike({
      code: 'ERR_JWT_EXPIRED',
      message: '"iat" claim timestamp check failed (too far in the past)',
    }),
  )
  await assert.rejects(
    jwtVerify(jwt, context.secret, { maxTokenAge: '0 seconds' }),
    errorLike({
      code: 'ERR_JWT_EXPIRED',
    }),
  )
  const fresh = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .sign(context.secret)
  await assert.doesNotReject(jwtVerify(fresh, context.secret, { maxTokenAge: 0 }))
})

for (const [iat, clockTolerance] of [
  [now, 0],
  [now + 1, 2],
]) {
  test(`negative maxTokenAge is rejected with clockTolerance ${clockTolerance}`, async () => {
    const jwt = await new SignJWT(context.payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .sign(context.secret)
    for (const maxTokenAge of [-1, '-1s', '1s ago']) {
      await assert.rejects(
        jwtVerify(jwt, context.secret, { maxTokenAge, clockTolerance }),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.equal(error.message, 'Invalid maxTokenAge option input')
          return true
        },
      )
    }
  })
}

test('time validation options must be finite', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(now - 30)
    .sign(context.secret)
  for (const clockTolerance of [NaN, Infinity, -Infinity, -1, '-1s', '1s ago']) {
    await assert.rejects(jwtVerify(jwt, context.secret, { clockTolerance }), (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Invalid clockTolerance option input')
      return true
    })
  }
  await assert.rejects(
    jwtVerify(jwt, context.secret, { currentDate: new Date('nope') }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Invalid currentDate option input')
      return true
    },
  )
  const issued = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .sign(context.secret)
  for (const maxTokenAge of [NaN, Infinity, -Infinity]) {
    await assert.rejects(jwtVerify(issued, context.secret, { maxTokenAge }), (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Invalid maxTokenAge option input')
      return true
    })
  }
  // The token is genuinely expired, so a valid tolerance still rejects it.
  await assert.rejects(
    jwtVerify(jwt, context.secret, { clockTolerance: 0 }),
    errorLike({
      code: 'ERR_JWT_EXPIRED',
    }),
  )
})

test('currentDate must not silently default invalid falsy values', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(now + 30)
    .sign(context.secret)
  for (const currentDate of [null, 0, false, '']) {
    await assert.rejects(
      jwtVerify(jwt, context.secret, { currentDate: currentDate as never }),
      TypeError,
    )
  }
})

test('maxTokenAge must not coerce arbitrary values to duration strings', async () => {
  const jwt = await new SignJWT(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(context.secret)
  await assert.rejects(
    jwtVerify(jwt, context.secret, {
      maxTokenAge: { toString: () => '1 hour' } as never,
    }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Invalid time period format')
      return true
    },
  )
})

test('invalid UTF-8 in the Claims Set is rejected', async () => {
  // RFC 7519 Section 7.2 step 10 requires verifying the octets are a UTF-8 encoding.
  // C0 AF is an overlong encoding of "/".
  const header = base64url.encode(JSON.stringify({ alg: 'HS256' }))
  const claims = new Uint8Array([
    ...new TextEncoder().encode('{"sub":"a'),
    0xc0,
    0xaf,
    ...new TextEncoder().encode('b"}'),
  ])
  const payload = base64url.encode(claims)
  const signature = base64url.encode(
    new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          context.secret,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        ),
        new TextEncoder().encode(`${header}.${payload}`),
      ),
    ),
  )
  await assert.rejects(
    jwtVerify(`${header}.${payload}.${signature}`, context.secret),
    errorLike({
      code: 'ERR_JWT_INVALID',
    }),
  )
})
