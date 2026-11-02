import assert from 'node:assert/strict'
import test from 'node:test'

import { decodeProtectedHeader } from '../../src/index.js'

test('invalid inputs', () => {
  assert.throws(
    () => decodeProtectedHeader(null),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('.'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('ew..'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('bnVsbA..'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('W10..'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('...'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('ew....'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('bnVsbA....'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('W10....'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader('.....'),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader({ protected: null }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader({ protected: 'ew' }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader({ protected: 'bnVsbA' }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader({ protected: 'W10' }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Invalid Token or Protected Header formatting')
      return true
    },
  )

  assert.throws(
    () => decodeProtectedHeader({}),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, 'Token does not contain a Protected Header')
      return true
    },
  )

  assert.deepStrictEqual(decodeProtectedHeader('eyJhbGciOiJIUzI1NiJ9..'), { alg: 'HS256' })
  assert.deepStrictEqual(decodeProtectedHeader('eyJhbGciOiJIUzI1NiJ9....'), { alg: 'HS256' })
  assert.deepStrictEqual(decodeProtectedHeader({ protected: 'eyJhbGciOiJIUzI1NiJ9' }), {
    alg: 'HS256',
  })
})
