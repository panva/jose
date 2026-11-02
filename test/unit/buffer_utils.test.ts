import assert from 'node:assert/strict'
import test from 'node:test'

import { encode, uint32be } from '../../src/lib/buffer_utils.js'

test('lib/buffer_utils.ts', () => {
  assert.throws(() => uint32be(-1), RangeError)
  assert.throws(() => uint32be(2 ** 32), RangeError)
})

test('ASCII encoding preserves every byte, including control characters', () => {
  for (const length of [0, 1, 127, 128, 129, 1024]) {
    const bytes = Uint8Array.from({ length }, (_, index) => index % 128)
    assert.deepStrictEqual(encode(String.fromCharCode(...bytes)), bytes)
  }
})

test('ASCII encoding rejects non-ASCII code points and lone surrogates', () => {
  for (const prefixLength of [0, 127, 128, 1024]) {
    for (const character of ['\x80', 'é', '😀', '\ud800', '\udfff']) {
      assert.throws(
        () => encode('a'.repeat(prefixLength) + character),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.strictEqual(error.message, 'non-ASCII string encountered in encode()')
          return true
        },
      )
    }
  }
})
