import test from 'ava'

import { uint32be } from '../../src/lib/buffer_utils.js'

test('lib/buffer_utils.ts', (t) => {
  t.throws(() => uint32be(-1), { instanceOf: RangeError })
  t.throws(() => uint32be(2 ** 32), { instanceOf: RangeError })
})
