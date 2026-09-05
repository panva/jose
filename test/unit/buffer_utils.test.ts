import test from 'ava'

import { encode, uint32be } from '../../src/lib/buffer_utils.js'

test('lib/buffer_utils.ts', (t) => {
  t.throws(() => uint32be(-1), { instanceOf: RangeError })
  t.throws(() => uint32be(2 ** 32), { instanceOf: RangeError })
})

test('ASCII encoding preserves every byte, including control characters', (t) => {
  for (const length of [0, 1, 127, 128, 129, 1024]) {
    const bytes = Uint8Array.from({ length }, (_, index) => index % 128)
    t.deepEqual(encode(String.fromCharCode(...bytes)), bytes)
  }
})

test('ASCII encoding rejects non-ASCII code points and lone surrogates', (t) => {
  for (const prefixLength of [0, 127, 128, 1024]) {
    for (const character of ['\x80', 'é', '😀', '\ud800', '\udfff']) {
      t.throws(() => encode('a'.repeat(prefixLength) + character), {
        instanceOf: TypeError,
        message: 'non-ASCII string encountered in encode()',
      })
    }
  }
})
