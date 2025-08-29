import test from 'ava'

import { generateIv } from '../../src/lib/iv.js'

test('lib/iv.ts', (t) => {
  t.throws(() => generateIv('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
