import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import timekeeper from 'timekeeper'
import { EncryptJWT, jwtDecrypt, CompactEncrypt } from '../../src/index.js'
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
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
    .setIssuer(issuer)
    .setSubject(subject)
    .setAudience(audience)
    .setJti(jti)
    .setNotBefore(nbf)
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .encrypt(context.secret)
  assert.deepEqual(
    await jwtDecrypt(jwt, context.secret, {
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
        alg: 'dir',
        enc: 'A256GCM',
        typ: 'urn:example:typ',
      },
    },
  )
  await assert.doesNotReject(jwtDecrypt(new TextEncoder().encode(jwt), context.secret))
})

test('Payload must be an object', async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  for (const value of [0, 1, -1, true, false, null, [], '']) {
    const token = await new CompactEncrypt(encode(JSON.stringify(value)))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(context.secret)
    await assert.rejects(
      jwtDecrypt(token, context.secret),
      errorLike({
        code: 'ERR_JWT_INVALID',
        message: 'JWT Claims Set must be a top-level JSON object',
      }),
    )
  }
})

test('resolved keys are returned as own data properties', async () => {
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  let intercepted: unknown
  let result
  const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'key')
  Object.defineProperty(Object.prototype, 'key', {
    configurable: true,
    set(value) {
      intercepted = value
    },
  })
  try {
    result = await jwtDecrypt(jwt, async () => context.secret)
  } finally {
    if (descriptor) Object.defineProperty(Object.prototype, 'key', descriptor)
    else Reflect.deleteProperty(Object.prototype, 'key')
  }
  assert.equal(Object.hasOwn(result!, 'key'), true)
  assert.equal(result!.key, context.secret)
  assert.equal(intercepted, undefined)
})

test('Payload must JSON parseable', async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const token = await new CompactEncrypt(encode('{'))
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(token, context.secret),
    errorLike({
      code: 'ERR_JWT_INVALID',
      message: 'JWT Claims Set must be a top-level JSON object',
    }),
  )
})

test('contentEncryptionAlgorithms and keyManagementAlgorithms options', async () => {
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      keyManagementAlgorithms: ['RSA-OAEP'],
    }),
    errorLike({
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    }),
  )
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      keyManagementAlgorithms: [null],
    }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, '"keyManagementAlgorithms" option must be an array of strings')
      return true
    },
  )
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      contentEncryptionAlgorithms: ['A128GCM'],
    }),
    errorLike({
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"enc" (Encryption Algorithm) Header Parameter value not allowed',
    }),
  )
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      contentEncryptionAlgorithms: [null],
    }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(
        error.message,
        '"contentEncryptionAlgorithms" option must be an array of strings',
      )
      return true
    },
  )
})

test('typ verification', async () => {
  {
    const typ = 'urn:example:typ'
    const jwt = await new EncryptJWT(context.payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
      .encrypt(context.secret)
    await assert.doesNotReject(
      jwtDecrypt(jwt, context.secret, {
        typ: 'application/urn:example:typ',
      }),
    )
    await assert.rejects(
      jwtDecrypt(jwt, context.secret, {
        typ: 'urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
    await assert.rejects(
      jwtDecrypt(jwt, context.secret, {
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
    const jwt = await new EncryptJWT(context.payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ })
      .encrypt(context.secret)
    await assert.doesNotReject(
      jwtDecrypt(jwt, context.secret, {
        typ: 'urn:example:typ',
      }),
    )
    await assert.rejects(
      jwtDecrypt(jwt, context.secret, {
        typ: 'application/urn:example:typ:2',
      }),
      errorLike({
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: 'unexpected "typ" JWT header value',
      }),
    )
    await assert.rejects(
      jwtDecrypt(jwt, context.secret, {
        typ: 'urn:example:typ:2',
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
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuer(issuer)
    .encrypt(context.secret)
  await assert.doesNotReject(
    jwtDecrypt(jwt, context.secret, {
      issuer: [issuer],
    }),
  )
})

test('Issuer[] verification failed', async () => {
  const issuer = 'urn:example:issuer'
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuer(issuer)
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      issuer: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' }),
  )
})

test('Issuer[] verification failed []', async () => {
  const issuer = 'urn:example:issuer'
  const jwt = await new EncryptJWT({ ...context.payload, iss: [issuer] as never })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      issuer: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' }),
  )
})

test('Audience[] verification', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAudience(audience)
    .encrypt(context.secret)
  await assert.doesNotReject(
    jwtDecrypt(jwt, context.secret, {
      audience: [audience],
    }),
  )
})

test('Audience[] verification failed', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAudience(audience)
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      audience: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' }),
  )
})

test('Audience[] verification failed []', async () => {
  const audience = 'urn:example:audience'
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAudience([audience])
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      audience: [],
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' }),
  )
})

test('Subject verification failed', async () => {
  const subject = 'urn:example:subject'
  const jwt = await new EncryptJWT(context.payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setSubject(subject)
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret, {
      subject: 'urn:example:subject:2',
    }),
    errorLike({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "sub" claim value' }),
  )
})

async function numericDateNumber(claim: string) {
  const jwt = await new EncryptJWT({ [claim]: null })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.rejects(
    jwtDecrypt(jwt, context.secret),
    errorLike({
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `"${claim}" claim must be a number`,
    }),
  )
}

test('clockTolerance num', async () => {
  const jwt = await new EncryptJWT({ exp: now })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.doesNotReject(jwtDecrypt(jwt, context.secret, { clockTolerance: 1 }))
  await assert.doesNotReject(jwtDecrypt(jwt, context.secret, { clockTolerance: '1s' }))
  await assert.rejects(jwtDecrypt(jwt, context.secret, { clockTolerance: null }), (error) => {
    assert.ok(error instanceof TypeError)
    assert.equal(error.message, 'Invalid clockTolerance option type')
    return true
  })
})

async function failingNumericDate(
  claims: Record<string, unknown>,
  assertion: import('node:assert').AssertPredicate,
  decryptOptions: import('../../src/index.js').JWTDecryptOptions = {},
) {
  const jwt = await new EncryptJWT({ ...claims })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(context.secret)
  await assert.rejects(jwtDecrypt(jwt, context.secret, { ...decryptOptions }), errorLike(assertion))
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

for (const [iat, clockTolerance] of [
  [now, 0],
  [now + 1, 2],
]) {
  test(`negative maxTokenAge is rejected with clockTolerance ${clockTolerance}`, async () => {
    const jwt = await new EncryptJWT(context.payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt(iat)
      .encrypt(context.secret)
    for (const maxTokenAge of [-1, '-1s', '1s ago']) {
      await assert.rejects(
        jwtDecrypt(jwt, context.secret, { maxTokenAge, clockTolerance }),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.equal(error.message, 'Invalid maxTokenAge option input')
          return true
        },
      )
    }
  })
}

for (const claim of ['iat', 'nbf', 'exp']) {
  test(`${claim} must be a number`, () => numericDateNumber(claim))
}

async function replicatedClaimCheck(claim: 'iss' | 'sub' | 'aud') {
  {
    const jwt = await new EncryptJWT({ [claim]: 'urn:example' })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', [claim]: 'urn:example' })
      .encrypt(context.secret)
    await assert.doesNotReject(jwtDecrypt(jwt, context.secret))
  }
  {
    const jwt = await new EncryptJWT({ [claim]: 'urn:example:mismatched' })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', [claim]: 'urn:example' })
      .encrypt(context.secret)
    await assert.rejects(
      jwtDecrypt(jwt, context.secret, {
        code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
        message: `replicated "${claim}" claim header parameter mismatch`,
      }),
      Error,
    )
  }
}

for (const claim of ['iss', 'sub', 'aud']) {
  test(`${claim} header claim must match the payload`, () => replicatedClaimCheck(claim))
}
