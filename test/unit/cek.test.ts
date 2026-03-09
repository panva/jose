import test from 'ava'

import { generateCek } from '../../src/lib/content_encryption.js'

test('lib/cek.ts', (t) => {
  t.throws(() => generateCek('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
