import test from 'ava'

import iv from '../../src/lib/iv.js'

test('lib/iv.ts', (t) => {
  t.throws(() => iv('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
