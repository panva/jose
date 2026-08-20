import test from 'ava'
import timekeeper from 'timekeeper'

import { base64url, SignJWT, jwtVerify, CompactSign } from '../../src/index.js'

const now = 1604416038

test.before(async (t) => {
  t.context.secret = new Uint8Array(32)
  t.context.payload = { 'urn:example:claim': true }

  timekeeper.freeze(now * 1000)
})

test.after(timekeeper.reset)

test('Basic JWT Claims Set verification', async (t) => {
  const issuer = 'urn:example:issuer'
  const subject = 'urn:example:subject'
  const audience = 'urn:example:audience'
  const jti = 'urn:example:jti'
  const nbf = now - 10
  const iat = now - 20
  const exp = now + 10
  const typ = 'urn:example:typ'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256', typ })
    .setIssuer(issuer)
    .setSubject(subject)
    .setAudience(audience)
    .setJti(jti)
    .setNotBefore(nbf)
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .sign(t.context.secret)

  t.deepEqual(
    await jwtVerify(jwt, t.context.secret, {
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
  await t.notThrowsAsync(jwtVerify(new TextEncoder().encode(jwt), t.context.secret))
})

test('Payload must be an object', async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  for (const value of [0, 1, -1, true, false, null, [], '']) {
    const token = await new CompactSign(encode(JSON.stringify(value)))
      .setProtectedHeader({ alg: 'HS256' })
      .sign(t.context.secret)
    await t.throwsAsync(jwtVerify(token, t.context.secret), {
      code: 'ERR_JWT_INVALID',
      message: 'JWT Claims Set must be a top-level JSON object',
    })
  }
})

test('incorrect hmac signature lengths', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.throwsAsync(jwtVerify(jwt.slice(0, -3), t.context.secret), {
    code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    message: 'signature verification failed',
  })
})

test('Payload must JSON parseable', async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const token = await new CompactSign(encode('{'))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)
  await t.throwsAsync(jwtVerify(token, t.context.secret), {
    code: 'ERR_JWT_INVALID',
    message: 'JWT Claims Set must be a top-level JSON object',
  })
})

test('algorithms options', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      algorithms: ['PS256'],
    }),
    {
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    },
  )
  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      algorithms: [null],
    }),
    {
      instanceOf: TypeError,
      message: '"algorithms" option must be an array of strings',
    },
  )
})

test('typ verification', async (t) => {
  {
    const jwt = await new SignJWT(t.context.payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(t.context.secret)

    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { typ: '' }), {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: 'unexpected "typ" JWT header value',
    })
  }
  {
    const typ = 'urn:example:typ'
    const jwt = await new SignJWT(t.context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(t.context.secret)

    await t.notThrowsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'application/urn:example:typ',
      }),
    )

    await t.throwsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'urn:example:typ:2',
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
    )

    await t.throwsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'application/urn:example:typ:2',
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
    )
  }
  {
    const typ = 'application/urn:example:typ'
    const jwt = await new SignJWT(t.context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(t.context.secret)

    await t.notThrowsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'urn:example:typ',
      }),
    )

    await t.throwsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'application/urn:example:typ:2',
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
    )

    await t.throwsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'urn:example:typ:2',
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
    )
  }
  {
    const typ = 'text/plain'
    const jwt = await new SignJWT(t.context.payload)
      .setProtectedHeader({ alg: 'HS256', typ })
      .sign(t.context.secret)

    await t.notThrowsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'text/plain',
      }),
    )

    await t.throwsAsync(
      jwtVerify(jwt, t.context.secret, {
        typ: 'application/text/plain',
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "typ" JWT header value' },
    )
  }
})

test('Issuer[] verification', async (t) => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .sign(t.context.secret)

  await t.notThrowsAsync(
    jwtVerify(jwt, t.context.secret, {
      issuer: [issuer],
    }),
  )
})

test('Issuer[] verification failed', async (t) => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      issuer: [],
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' },
  )
})

test('Issuer[] verification failed []', async (t) => {
  const issuer = 'urn:example:issuer'
  const jwt = await new SignJWT({ ...t.context.payload, iss: [issuer] as never })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      issuer: [],
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "iss" claim value' },
  )
})

test('Audience[] verification', async (t) => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(audience)
    .sign(t.context.secret)

  await t.notThrowsAsync(
    jwtVerify(jwt, t.context.secret, {
      audience: [audience],
    }),
  )
})

test('Audience[] verification failed', async (t) => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(audience)
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      audience: [],
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' },
  )
})

test('Audience[] verification failed []', async (t) => {
  const audience = 'urn:example:audience'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience([audience])
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      audience: [],
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "aud" claim value' },
  )
})

test('Subject verification failed', async (t) => {
  const subject = 'urn:example:subject'
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(subject)
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      subject: 'urn:example:subject:2',
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED', message: 'unexpected "sub" claim value' },
  )
})

async function numericDateNumber(t, claim) {
  const jwt = await new SignJWT({ [claim]: null })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.throwsAsync(jwtVerify(jwt, t.context.secret), {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: `"${claim}" claim must be a number`,
  })
}
numericDateNumber.title = (t, claim) => `${claim} must be a number`

test('clockTolerance num', async (t) => {
  const jwt = await new SignJWT({ exp: now })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.notThrowsAsync(jwtVerify(jwt, t.context.secret, { clockTolerance: 1 }))
  await t.notThrowsAsync(jwtVerify(jwt, t.context.secret, { clockTolerance: '1s' }))
})

async function failingNumericDate(t, claims, assertion, verifyOptions) {
  const jwt = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { ...verifyOptions }), assertion)
}

test(
  'exp must be in the future',
  failingNumericDate,
  { exp: now },
  {
    code: 'ERR_JWT_EXPIRED',
    message: '"exp" claim timestamp check failed',
  },
)

test(
  'nbf must be at least now',
  failingNumericDate,
  { nbf: now + 1 },
  {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: '"nbf" claim timestamp check failed',
  },
)

test(
  'iat must be in the past (maxTokenAge, no exp)',
  failingNumericDate,
  { iat: now + 1 },
  {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: '"iat" claim timestamp check failed (it should be in the past)',
  },
  {
    maxTokenAge: 5,
  },
)

test(
  'iat must be in the past (maxTokenAge, with exp)',
  failingNumericDate,
  { iat: now + 1, exp: now + 10 },
  {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: '"iat" claim timestamp check failed (it should be in the past)',
  },
  {
    maxTokenAge: 5,
  },
)

test(
  'iat must be in the past (maxTokenAge, with exp, as a string)',
  failingNumericDate,
  { iat: now + 1, exp: now + 10 },
  {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: '"iat" claim timestamp check failed (it should be in the past)',
  },
  {
    maxTokenAge: '5s',
  },
)

test(
  'maxTokenAge option',
  failingNumericDate,
  { iat: now - 31 },
  {
    code: 'ERR_JWT_EXPIRED',
    message: '"iat" claim timestamp check failed (too far in the past)',
  },
  {
    maxTokenAge: '30s',
  },
)

for (const claim of ['iat', 'nbf', 'exp']) {
  test(numericDateNumber, claim)
}

test('Signed JWTs cannot use unencoded payload', async (t) => {
  await t.throwsAsync(
    jwtVerify(
      'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.foo.VklKdp4tVYD61VNPDBTqxqdEQcUL3JK-D4dGXu9NvWs',
      t.context.secret,
    ),
    { code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' },
  )
})

test('"b64" is ignored when "crit" does not list it', async (t) => {
  // RFC 7797 requires a producer to list "b64" in "crit" for the unencoded payload option to be in
  // effect. Absent from "crit" the parameter is inert, the payload is base64url encoded like any
  // other, and the JWT is ordinary - so this is not the case RFC 7797 Section 7 forbids.
  const jwt = await new CompactSign(new TextEncoder().encode(JSON.stringify(t.context.payload)))
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(t.context.secret)

  const { payload, protectedHeader } = await jwtVerify(jwt, t.context.secret)
  t.deepEqual(protectedHeader, { alg: 'HS256', b64: false })
  t.deepEqual(payload, t.context.payload)
})

test('signatures are compared before claim set', async (t) => {
  // https://github.com/panva/jose/discussions/447
  const jwt = await new SignJWT({ exp: 0 })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  // with valid secret should throw exp failing to verify
  await t.throwsAsync(jwtVerify(jwt, t.context.secret), { code: 'ERR_JWT_EXPIRED' })

  // with invalid secret should throw signature failing to verify
  await t.throwsAsync(jwtVerify(jwt, new Uint8Array([0x00, 0x01])), {
    code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
  })
})

test('requiredClaims claims check', async (t) => {
  const jwt = await new SignJWT({
    ...t.context.payload,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  const requiredClaims = ['nbf']

  for (const [claim, option] of [
    ['iss', 'issuer'],
    ['aud', 'audience'],
    ['iat', 'maxTokenAge'],
    ['sub', 'subject'],
  ]) {
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { [option]: 'foo' }), {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `missing required "${claim}" claim`,
    })
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { [option]: 'foo', requiredClaims }), {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `missing required "${claim}" claim`,
    })
  }
  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { requiredClaims }), {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
    message: `missing required "nbf" claim`,
  })

  for (const claim of ['constructor', 'toString', '__proto__']) {
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { requiredClaims: [claim] }), {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `missing required "${claim}" claim`,
    })
  }

  t.deepEqual(requiredClaims, ['nbf'])
})

test('empty string validation options compare the claim value', async (t) => {
  const jwt = await new SignJWT({ iss: 'urn:example:issuer', sub: 'urn:example:subject' })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience('urn:example:audience')
    .sign(t.context.secret)

  for (const [claim, option] of [
    ['iss', 'issuer'],
    ['sub', 'subject'],
    ['aud', 'audience'],
  ]) {
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { [option]: '' }), {
      code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
      message: `unexpected "${claim}" claim value`,
    })
  }
})

test('maxTokenAge of 0 is enforced', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now - 30)
    .sign(t.context.secret)

  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { maxTokenAge: 0 }), {
    code: 'ERR_JWT_EXPIRED',
    message: '"iat" claim timestamp check failed (too far in the past)',
  })
  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { maxTokenAge: '0 seconds' }), {
    code: 'ERR_JWT_EXPIRED',
  })

  const fresh = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .sign(t.context.secret)
  await t.notThrowsAsync(jwtVerify(fresh, t.context.secret, { maxTokenAge: 0 }))
})

test('time validation options must be finite', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(now - 30)
    .sign(t.context.secret)

  for (const clockTolerance of [NaN, Infinity, -Infinity]) {
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { clockTolerance }), {
      instanceOf: TypeError,
      message: 'Invalid clockTolerance option input',
    })
  }

  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { currentDate: new Date('nope') }), {
    instanceOf: TypeError,
    message: 'Invalid currentDate option input',
  })

  const issued = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .sign(t.context.secret)
  for (const maxTokenAge of [NaN, Infinity, -Infinity]) {
    await t.throwsAsync(jwtVerify(issued, t.context.secret, { maxTokenAge }), {
      instanceOf: TypeError,
      message: 'Invalid maxTokenAge option input',
    })
  }

  // The token is genuinely expired, so a valid tolerance still rejects it.
  await t.throwsAsync(jwtVerify(jwt, t.context.secret, { clockTolerance: 0 }), {
    code: 'ERR_JWT_EXPIRED',
  })
})

test('currentDate must not silently default invalid falsy values', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(now + 30)
    .sign(t.context.secret)

  for (const currentDate of [null, 0, false, '']) {
    await t.throwsAsync(jwtVerify(jwt, t.context.secret, { currentDate: currentDate as never }), {
      instanceOf: TypeError,
    })
  }
})

test('maxTokenAge must not coerce arbitrary values to duration strings', async (t) => {
  const jwt = await new SignJWT(t.context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(t.context.secret)

  await t.throwsAsync(
    jwtVerify(jwt, t.context.secret, {
      maxTokenAge: { toString: () => '1 hour' } as never,
    }),
    { instanceOf: TypeError, message: 'Invalid time period format' },
  )
})

test('invalid UTF-8 in the Claims Set is rejected', async (t) => {
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
          t.context.secret,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        ),
        new TextEncoder().encode(`${header}.${payload}`),
      ),
    ),
  )

  await t.throwsAsync(jwtVerify(`${header}.${payload}.${signature}`, t.context.secret), {
    code: 'ERR_JWT_INVALID',
  })
})
