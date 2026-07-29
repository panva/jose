import test from 'ava'

import { checkIvLength } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'

test('lib/content_encryption.ts checkIvLength', (t) => {
  const gcm = jweEncryption('A256GCM')
  t.throws(() => checkIvLength(gcm, new Uint8Array(13)), {
    code: 'ERR_JWE_INVALID',
    message: 'Invalid Initialization Vector length',
  })
  t.notThrows(() => checkIvLength(gcm, new Uint8Array(12)))
  t.notThrows(() => checkIvLength(jweEncryption('A256CBC-HS512'), new Uint8Array(16)))
})
