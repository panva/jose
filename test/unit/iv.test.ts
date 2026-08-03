import test from 'ava'

import { generateIv } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'

test('lib/content_encryption.ts generateIv', (t) => {
  t.throws(() => jweEncryption('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported "enc" (JWE Encryption Algorithm) header value',
  })
  t.is(generateIv(jweEncryption('A256GCM')).byteLength, 12)
  t.is(generateIv(jweEncryption('A256CBC-HS512')).byteLength, 16)
})
