import test from 'ava'

import { compactDecrypt } from '../../src/index.js'

test('JWE format validation', async (t) => {
  await t.throwsAsync(compactDecrypt(null, new Uint8Array(0)), {
    message: 'Compact JWE must be a string or Uint8Array',
    code: 'ERR_JWE_INVALID',
  })
  await t.throwsAsync(compactDecrypt('...', new Uint8Array(0)), {
    message: 'Invalid Compact JWE',
    code: 'ERR_JWE_INVALID',
  })
})
