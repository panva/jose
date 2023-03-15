import test from 'ava'

const { decodeJwt, errors, base64url } = await import('#dist')

test('invalid inputs', (t) => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const parts = jwt.split('.')

  t.throws(() => decodeJwt(null), {
    instanceOf: errors.JWTInvalid,
    message: 'JWTs must use Compact JWS serialization, JWT must be a string',
  })

  t.throws(() => decodeJwt('....'), {
    instanceOf: errors.JWTInvalid,
    message: 'Only JWTs using Compact JWS serialization can be decoded',
  })

  t.throws(() => decodeJwt('.'), {
    instanceOf: errors.JWTInvalid,
    message: 'Invalid JWT',
  })

  t.throws(() => decodeJwt([parts[0], '', parts[2]].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'JWTs must contain a payload',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('null'), parts[2]].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Invalid JWT Claims Set',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('[]'), parts[2]].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Invalid JWT Claims Set',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('{"notajson'), parts[2]].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Failed to parse the decoded payload as JSON',
  })

  t.deepEqual(decodeJwt([parts[0], base64url.encode('{}'), parts[2]].join('.')), {})

  t.deepEqual(decodeJwt(jwt), {
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
  })
})
