import test from 'ava'
import { root } from '../dist.mjs'

const { decodeJwt, errors, base64url } = await import(root)

test('invalid inputs', (t) => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'

  const parts = jwt.split('.')

  t.throws(() => decodeJwt(null), {
    instanceOf: errors.JWTInvalid,
    message: 'JWTs must use Compact JWS serialization, JWT must be a string',
  })

  t.throws(() => decodeJwt('....'), {
    instanceOf: errors.JWTInvalid,
    message: 'Only JWTs using Compact JWS serialization can be decoded',
  })

  t.throws(() => decodeJwt([parts[0], ''].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'JWTs must contain a header and a payload',
  })

  t.throws(() => decodeJwt(['', parts[1]].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'JWTs must contain a header and a payload',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('null')].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Invalid JWT Claims Set',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('[]')].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Invalid JWT Claims Set',
  })

  t.throws(() => decodeJwt([parts[0], base64url.encode('{"notajson')].join('.')), {
    instanceOf: errors.JWTInvalid,
    message: 'Failed to parse the decoded payload as JSON',
  })

  t.deepEqual(decodeJwt([parts[0], base64url.encode('{}')].join('.')), {})

  t.deepEqual(decodeJwt(jwt), {
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
  })
})
