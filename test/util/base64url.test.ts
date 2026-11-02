import assert from 'node:assert/strict'
import test from 'node:test'
import fc from 'fast-check'

import * as base64url from '../../src/util/base64url.js'

// RFC 4648 Section 5 defines the Base64URL alphabet as A-Z, a-z, 0-9, "-" and "_". "+" and "/"
// belong to the standard Base64 alphabet of Section 4 and are not part of it.
test('characters outside the Base64URL alphabet are rejected', () => {
  for (const input of ['a+b/', 'a+bc', 'ab/c', '+', '/', 'ab!c', 'ab.c']) {
    assert.throws(
      () => base64url.decode(input),
      (error) => {
        assert.ok(error instanceof TypeError)
        assert.strictEqual(error.message, 'The input to be decoded is not correctly encoded.')
        return true
      },
    )
  }
})

// "-" and "_" alias to "+" and "/" when translated to the standard alphabet, so accepting the
// latter would decode two distinct inputs to the same octets.
test('the Base64URL alphabet does not alias the standard one', () => {
  assert.deepStrictEqual([...base64url.decode('a-b_')], [107, 230, 255])
  assert.throws(() => base64url.decode('a+b/'), Error)
})

test('the Base64URL alphabet is accepted', () => {
  assert.deepStrictEqual([...base64url.decode('YWJj')], [97, 98, 99])
  assert.deepStrictEqual([...base64url.decode('YWJ')], [97, 98])
  assert.deepStrictEqual([...base64url.decode('YQ')], [97])
  assert.deepStrictEqual([...base64url.decode('YW==')], [97])
  assert.deepStrictEqual([...base64url.decode('')], [])
  assert.deepStrictEqual([...base64url.decode(new TextEncoder().encode('YWJj'))], [97, 98, 99])
})

test('a round trip preserves the input', () => {
  fc.assert(
    fc.property(fc.uint8Array({ maxLength: 4096 }), (bytes) => {
      const encoded = base64url.encode(bytes)
      assert.match(encoded, /^[A-Za-z0-9_-]*$/)
      assert.deepStrictEqual(base64url.decode(encoded), bytes)
    }),
    { numRuns: 1000 },
  )
})
