import assert from 'node:assert/strict'
import test from 'node:test'

import { decodeJwt, errors, base64url } from '../../src/index.js'

test('invalid inputs', () => {
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const parts = jwt.split('.')

  assert.throws(
    () => decodeJwt(null as any),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(
        error.message,
        'JWTs must use Compact JWS serialization, JWT must be a string',
      )
      return true
    },
  )

  assert.throws(
    () => decodeJwt('....'),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'Only JWTs using Compact JWS serialization can be decoded')
      return true
    },
  )

  assert.throws(
    () => decodeJwt('.'),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'Invalid JWT')
      return true
    },
  )

  assert.throws(
    () => decodeJwt([parts[0], '', parts[2]].join('.')),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'JWTs must contain a payload')
      return true
    },
  )

  assert.throws(
    () => decodeJwt([parts[0], base64url.encode('null'), parts[2]].join('.')),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'Invalid JWT Claims Set')
      return true
    },
  )

  assert.throws(
    () => decodeJwt([parts[0], base64url.encode('[]'), parts[2]].join('.')),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'Invalid JWT Claims Set')
      return true
    },
  )

  assert.throws(
    () => decodeJwt([parts[0], base64url.encode('{"notajson'), parts[2]].join('.')),
    (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'Failed to parse the decoded payload as JSON')
      return true
    },
  )

  assert.deepStrictEqual(decodeJwt([parts[0], base64url.encode('{}'), parts[2]].join('.')), {})

  assert.deepStrictEqual(decodeJwt(jwt), {
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
  })
})
