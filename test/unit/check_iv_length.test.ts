import test from 'ava'

import { checkIvLength } from '../../src/lib/check_iv_length.js'

test('lib/check_iv_length.ts', (t) => {
  t.throws(() => checkIvLength('A256GCM', new Uint8Array(13)), {
    code: 'ERR_JWE_INVALID',
    message: 'Invalid Initialization Vector length',
  })
  t.notThrows(() => checkIvLength('A256GCM', new Uint8Array(12)))
})
