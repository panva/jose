import test from 'ava'

import cek from '../../src/lib/cek.js'

test('lib/cek.ts', (t) => {
  t.throws(() => cek('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
